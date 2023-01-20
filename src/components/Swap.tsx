import {
  Flex,
  Box,
  Image,
  Button,
  Input,
  useDisclosure,
  Stack,
  Text,
} from "@chakra-ui/react";

import { SettingsIcon, ChevronDownIcon, ArrowDownIcon } from "@chakra-ui/icons";
import SwapButton from "./SwapButton";
import TokenSelect from "./TokenSelect";
import TokenModal from "./Modal/TokenModal";
import { useEffect, useState, useRef } from "react";
import { PrivaDexAPI } from "../phat_api/privadex_phat_contract_api";
import ChainSelect from "./ChainSelect";
import { Token } from "../data_models/Token";
import {
  useEthers,
  useSendTransaction,
  TransactionOptions,
  useContractFunction,
  ERC20Interface,
} from "@usedapp/core";
import { useConfig } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "ethers";

export default function Trade() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, chainId, library } = useEthers();
  const config = useConfig();

  const [srcQuantity, setSrcQuantity] = useState<number>(0);
  const [estimatedQuote, setEstimatedQuote] = useState<number>(0);
  const [srcUsd, setSrcUsd] = useState<number>(0);
  const [destUsd, setDestUsd] = useState<number>(0);
  const [estimatedOneSrcTokenQuote, setEstimatedOneSrcTokenQuote] =
    useState<number>(0);
  const [srcToken, setSrcToken] = useState<Token | null>(null);
  const [destToken, setDestToken] = useState<Token | null>(null);
  const [srcChain, setSrcChain] = useState<string>("moonbeam"); // arbitrarily selected one of the chains
  const [destChain, setDestChain] = useState<string>("astar");
  const [disabled, setDisabled] = useState<boolean>(false);

  const activatedIsSrcTokenModal = useRef(true); // false means the Dest token's TokenModal is activated
  const privadexApi = useRef(new PrivaDexAPI(null, null));

  // We use the unchecked signer to get the transaction hash immediately.
  // useDapp/core doesn't even let you interface with the response (instead it makes you
  // wait for the receipt, so we hack in a callback)
  // https://docs.ethers.org/v5/api/providers/jsonrpc-provider/#UncheckedJsonRpcSigner
  // MetaMask apparently does not allow for signTransaction, only sendTransaction -
  // which is pretty frustrating
  const provider = config.connectors.metamask.provider;
  const signer = provider?.getSigner();
  const delegateUncheckedSigner = provider?.getUncheckedSigner();
  if (provider && signer && delegateUncheckedSigner) {
    signer.sendTransaction = async (txn) => {
      console.log("sendTransaction", txn, signer);
      let earlyResponse = await delegateUncheckedSigner.sendTransaction(txn);
      console.log("txn hash =", earlyResponse.hash);
      await kickOffPhatContract(earlyResponse.hash);
      console.log("Kicked off Phat Contract");
      setDisabled(false);
      return earlyResponse;
    };
  }
  const txnOpts: TransactionOptions | undefined = signer
    ? { signer: signer }
    : undefined;
  // console.log("Txn opts:", txnOpts);
  const { sendTransaction, state: ethSendState } = useSendTransaction(txnOpts);

  const erc20Contract: any =
    srcToken && srcToken.getAddressFromEncodedTokenName() !== "native"
      ? (new Contract(
          srcToken.getAddressFromEncodedTokenName(),
          ERC20Interface
        ) as any)
      : null;
  // console.log('srcToken ERC20 contract', erc20Contract);
  const { send, state: erc20State } = useContractFunction(
    erc20Contract,
    "transfer",
    txnOpts
  );

  async function kickOffPhatContract(userToEscrowTxnHash: string) {
    await privadexApi.current.startSwap(
      userToEscrowTxnHash,
      srcChain,
      destChain,
      account,
      account, // TODO: need to let the user specify this
      srcToken!.tokenNameEncoded,
      destToken!.tokenNameEncoded,
      BigInt(Math.floor(srcQuantity * 10 ** srcToken!.decimals))
    );
  }

  async function startSwap() {
    // Assume that the caller has performed the necessary checks
    // (srcToken and destToken are set, we are on srcChain, and srcQuantity > 0)
    let escrowAddress = await privadexApi.current.escrowEthAddress();
    let srcTokenAddress = srcToken!.getAddressFromEncodedTokenName();
    let amountIn = BigInt(Math.floor(srcQuantity * 10 ** srcToken?.decimals));
    let receipt;
    setDisabled(true);
    if (srcTokenAddress === "native") {
      receipt = await sendTransaction({
        to: escrowAddress,
        value: amountIn,
        gasLimit: BigNumber.from(21000),
      });
    } else {
      // For some reason, the gas fee estimate is 0 sometimes (I assume the gas
      // fee estimate in useDapp fails). I'm hard-coding 65,000 across the board
      // as a generous overestimate
      receipt = await send(escrowAddress, amountIn, {
        gasLimit: BigNumber.from(65000),
      });
    }
    console.log("User to escrow transaction receipt =", receipt);
    setDisabled(false);
  }

  useEffect(() => {
    async function initializePrivaDexApi() {
      privadexApi.current = await PrivaDexAPI.initialize();
    }
    initializePrivaDexApi();
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (srcToken && destToken && srcQuantity > 0) {
        let [rawQuote, srcUsd, destUsd] = await privadexApi.current.quote(
          srcChain,
          destChain,
          srcToken.tokenNameEncoded,
          destToken.tokenNameEncoded,
          BigInt(Math.floor(srcQuantity * 10 ** srcToken.decimals))
        );
        let quote = Number(rawQuote) / 10 ** destToken.decimals;
        // console.log("quote =", quote);
        setEstimatedQuote(quote);
        setSrcUsd(srcUsd);
        setDestUsd(destUsd);
      }
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [srcQuantity, srcToken, destToken, srcChain, destChain]);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (srcToken && destToken) {
        let [rawQuote, _srcUsd, _destUsd] = await privadexApi.current.quote(
          srcChain,
          destChain,
          srcToken.tokenNameEncoded,
          destToken.tokenNameEncoded,
          BigInt(Math.floor(10 ** srcToken.decimals))
        );
        let quote = Number(rawQuote) / 10 ** destToken.decimals;
        setEstimatedOneSrcTokenQuote(quote);
      }
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [srcToken, destToken, srcChain, destChain]);

  return (
    <Box
      w="30.62rem"
      mx="auto"
      mt="3.5rem"
      boxShadow="rgb(0 0 0 / 8%) 0rem 0.37rem 0.62rem"
      borderRadius="1.37rem"
    >
      <TokenModal
        isOpen={isOpen}
        onClose={onClose} // These are messy, consolidate into an object later
        selectedChain={
          activatedIsSrcTokenModal.current === true ? srcChain : destChain
        }
        selectedToken={
          activatedIsSrcTokenModal.current === true ? srcToken : destToken
        }
        otherToken={
          activatedIsSrcTokenModal.current === true ? destToken : srcToken
        }
        setSelectedToken={
          activatedIsSrcTokenModal.current === true ? setSrcToken : setDestToken
        }
      />

      <Flex
        alignItems="center"
        p="1rem 1.25rem 0.5rem"
        bg="white"
        color="rgb(86, 90, 105)"
        justifyContent="space-between"
        borderRadius="1.37rem 1.37rem 0 0"
      >
        <Text color="black" fontWeight="500">
          Swap
        </Text>
        {/* <SettingsIcon
          fontSize="1.25rem"
          cursor="pointer"
          _hover={{ color: "rgb(128,128,128)" }}
        /> */}
      </Flex>

      <Box p="0.5rem" bg="white" borderRadius="0 0 1.37rem 1.37rem">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          bg="rgb(247, 248, 250)"
          p="1rem 1rem 1.7rem"
          borderRadius="1.25rem"
          border="0.06rem solid rgb(237, 238, 242)"
          _hover={{ border: "0.06rem solid rgb(211,211,211)" }}
        >
          <Box>
            <ChainSelect
              chain={srcChain}
              setChain={(chainName: string) => {
                setSrcToken(null);
                setEstimatedQuote(0);
                setSrcUsd(0);
                setDestUsd(0);
                setSrcChain(chainName);
              }}
              disabled={disabled}
            />
            <TokenSelect
              /*image={window.__imageSelected}*/ openTokenModal={onOpen}
              token={srcToken}
              setActivatedButton={() =>
                (activatedIsSrcTokenModal.current = true)
              }
              disabled={disabled}
            />
          </Box>
          <Box>
            <Input
              mt="2rem"
              placeholder="0.0"
              fontWeight="500"
              fontSize="1.5rem"
              width="100%"
              size="19rem"
              textAlign="right"
              bg="rgb(247, 248, 250)"
              outline="none"
              border="none"
              focusBorderColor="none"
              type="number"
              color="black"
              onChange={async function (e) {
                if (e.target.value !== undefined) {
                  setSrcQuantity(Number(e.target.value));
                } else {
                  console.log("src quantity is undefined");
                }
              }}
              disabled={disabled}
            />
            <Text
              mt="1rem"
              width="100%"
              size="19rem"
              textAlign="right"
              bg="rgb(247, 248, 250)"
              color="gray"
            >
              ${srcUsd.toFixed(4)}
            </Text>
          </Box>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="center"
          // bg="white"
          p="0.18rem"
          borderRadius="0.75rem"
          pos="relative"
          top="0rem"
        >
          <ArrowDownIcon
            bg="rgb(247, 248, 250)"
            color="rgb(128,128,128)"
            h="1.5rem"
            width="1.62rem"
            borderRadius="0.75rem"
          />
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          bg="rgb(247, 248, 250)"
          pos="relative"
          p="1rem 1rem 1.7rem"
          borderRadius="1.25rem"
          mt="0.25rem"
          border="0.06rem solid rgb(237, 238, 242)"
          _hover={{ border: "0.06rem solid rgb(211,211,211)" }}
        >
          <Box>
            <ChainSelect
              chain={destChain}
              setChain={(chainName: string) => {
                setDestToken(null);
                setEstimatedQuote(0);
                setDestUsd(0);
                setDestChain(chainName);
              }}
              disabled={disabled}
            />
            <TokenSelect
              /*image={window.__imageSelected2}*/ openTokenModal={onOpen}
              token={destToken}
              setActivatedButton={() =>
                (activatedIsSrcTokenModal.current = false)
              }
              disabled={disabled}
            />
          </Box>
          <Box>
            <Input
              mt="2rem"
              placeholder="0.0"
              fontSize="1.5rem"
              width="100%"
              size="19rem"
              textAlign="right"
              bg="rgb(247, 248, 250)"
              outline="none"
              border="none"
              focusBorderColor="none"
              type="number"
              color="black"
              readOnly={true}
              value={estimatedQuote.toFixed(4)}
            />
            <Text
              mt="1rem"
              width="100%"
              size="19rem"
              textAlign="right"
              bg="rgb(247, 248, 250)"
              color="gray"
            >
              ${destUsd.toFixed(4)}
            </Text>
          </Box>
        </Flex>
        {srcToken && destToken && (
          <Box color="black">
            <div>
              1 {srcToken.symbol} = {estimatedOneSrcTokenQuote.toFixed(4)}{" "}
              {destToken.symbol}
            </div>
          </Box>
        )}
        <SwapButton
          srcChain={srcChain}
          areTokensSelected={srcToken !== null && destToken !== null}
          areQuantitiesHighEnough={destUsd >= 0.10}
          startSwap={startSwap}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
}
