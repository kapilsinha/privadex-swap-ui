import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { typeDefinitions } from "@polkadot/types";
import { ContractPromise } from "@polkadot/api-contract";
import {
  create as phala_create,
  signCertificate as phala_signCertificate,
  types as phala_types,
} from "@phala/sdk";

import privadex_executor_contract from "./privadex_executor_contract.json";

function loadPrivadexContractFile(address) {
  const metadata = privadex_executor_contract;
  // console.log('Metadata:', metadata);
  // const constructor = metadata.V3.spec.constructors.find(c => c.label == 'default').selector;
  const constructor = metadata.V3.spec.constructors.find(
    (c) => c.label === "new"
  ).selector;
  const name = metadata.contract.name;
  const wasm = metadata.source.wasm;
  return { wasm, metadata, constructor, name, address };
}

async function contractApi(api, pruntimeUrl, contract) {
  const newApi = await api.clone().isReady;
  const phala = await phala_create({
    api: newApi,
    baseURL: pruntimeUrl,
    contractId: contract.address,
    autoDeposit: true,
  });
  const contractApi = new ContractPromise(
    phala.api,
    contract.metadata,
    contract.address
  );
  contractApi.sidevmQuery = phala.sidevmQuery;
  contractApi.instantiate = phala.instantiate;
  return contractApi;
}

export class PrivaDexAPI {
  #contractApi;
  #certSudo;

  constructor(contractApi, certSudo) {
    this.#contractApi = contractApi;
    this.#certSudo = certSudo;
  }

  static async initialize() {
    const nodeUrl = "wss://poc5.phala.network/ws";
    const pruntimeUrl = "https://poc5.phala.network/tee-api-1";
    const sudoAccount = "//Alice";

    const contractPrivadex = loadPrivadexContractFile(
      "0xefc4881781de25f25f7e6e4a8323ee778229b2921a826f3be281c8226a90173e"
    );

    // Connect to the chain
    const wsProvider = new WsProvider(nodeUrl);
    const api = await ApiPromise.create({
      provider: wsProvider,
      types: {
        ...phala_types,
        GistQuote: {
          username: "String",
          accountId: "AccountId",
        },
        ...typeDefinitions.contracts.types,
      },
    });

    // Prepare accounts
    const keyring = new Keyring({ type: "sr25519" });
    const sudo = keyring.addFromUri(sudoAccount);
    // console.log(`Sudo has address ${sudo.address} with publicKey [${sudo.publicKey}]`);

    const certSudo = await phala_signCertificate({ api, pair: sudo });
    // console.log("certSudo (Alice):", certSudo)

    const privadexContractApi = await contractApi(
      api,
      pruntimeUrl,
      contractPrivadex
    );
    // console.log("PrivaDEX API:", privadexContractApi, privadexContractApi.query);

    // privadexApi.query functions:
    // computeExecutionPlan
    // executionPlanStepForward
    // getAdmin
    // getEscrowEthAccountAddress
    // getExecPlan
    // getExecplanIds
    // initSecretKeys
    // quote
    // startSwap
    return new PrivaDexAPI(privadexContractApi, certSudo);
  }

  async escrowEthAddress() {
    const escrowAddress =
      await this.#contractApi.query.getEscrowEthAccountAddress(
        this.#certSudo,
        {}
      );
    console.log(
      "PrivaDEX escrow =",
      escrowAddress,
      escrowAddress.output.asOk.toString()
    );
    return escrowAddress.output.asOk.toString();
  }

  async quote(
    srcChain,
    destChain,
    srcTokenEncoded,
    destTokenEncoded,
    amountIn
  ) {
    // Backend returns (quote in destToken, amountIn in $ x 1e6, quote in $ x 1e6)
    // This function returns (quote in destToken, amountIn in $, quote in $)
    const quoteInfo = await this.#contractApi.query.quote(
      this.#certSudo,
      {},
      srcChain,
      destChain,
      srcTokenEncoded,
      destTokenEncoded,
      amountIn.toString()
    );
    // console.log("PrivaDEX quote =", amountIn.toString(), quoteInfo);
    if (quoteInfo.output.isOk) {
      let tup = quoteInfo.output.asOk;
      // console.log(tup[0].toBigInt(), tup[1] / 1e6, tup[2] / 1e6);
      return [tup[0].toBigInt(), tup[1] / 1e6, tup[2] / 1e6];
    }
    return [0n, 0, 0];
  }

  async startSwap(
    userToEscrowTransferEthTxn,
    srcChain,
    destChain,
    srcEthAddress,
    destEthAddress,
    srcTokenEncoded,
    destTokenEncoded,
    amountIn
  ) {
    const exec_plan_uuid = await this.#contractApi.query.startSwap(
      this.#certSudo,
      {},
      userToEscrowTransferEthTxn.replace("0x", ""),
      srcChain,
      destChain,
      srcEthAddress.replace("0x", ""),
      destEthAddress.replace("0x", ""),
      srcTokenEncoded,
      destTokenEncoded,
      amountIn.toString()
    );
    let uuid = exec_plan_uuid.output.asOk.toString('hex')
    console.log("PrivaDEX UUID =", exec_plan_uuid.output.asOk, uuid);
    return uuid;
  }
}
