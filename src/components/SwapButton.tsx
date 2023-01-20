import { Button, Box } from "@chakra-ui/react";
import { Astar, Moonbeam, useConnector, useEthers } from "@usedapp/core";

type Props = {
  srcChain: string;
  areQuantitiesHighEnough: boolean;
  areTokensSelected: boolean;
  startSwap: any;
  disabled: boolean;
};

export default function SwapButton({
  srcChain,
  areTokensSelected,
  areQuantitiesHighEnough,
  startSwap,
  disabled,
}: Props) {
  const { account, chainId, switchNetwork, activateBrowserWallet, error } =
    useEthers();
  const { connector, isLoading } = useConnector();

  function funcIsCorrectChainId() {
    // Should make Chain not a string later so I don't have to do this if-else logic here
    if (srcChain === "moonbeam") {
      return chainId === Moonbeam.chainId;
    }
    if (srcChain === "astar") {
      return chainId === Astar.chainId;
    }
    // console.log('test', connector, srcChain, chainId);
    return false;
  }

  const isCorrectChainId = funcIsCorrectChainId();

  async function handleConnectWallet() {
    if (srcChain === "astar") {
      await switchNetwork(Astar.chainId);
    } else if (srcChain === "moonbeam") {
      await switchNetwork(Moonbeam.chainId);
    }
    activateBrowserWallet({ type: "metamask" });
    // console.log("switching network", connector, account, chainId, srcChain, error);
  }

  return account && isCorrectChainId ? (
    areTokensSelected ? (
      areQuantitiesHighEnough ? (
        <Box mt="0.5rem">
          <Button
            onClick={() => {
              startSwap();
            }}
            color="white"
            bg="rgb(187,142,224)"
            width="100%"
            p="1.62rem"
            borderRadius="1.25rem"
            _hover={{ bg: "rgb(119,204,255)" }}
            disabled={disabled}
          >
            Swap
          </Button>
        </Box>
      ) : (
        <Box mt="0.5rem">
          <Button
            color="white"
            bg="rgb(187,142,224)"
            width="100%"
            p="1.62rem"
            borderRadius="1.25rem"
            _hover={{ bg: "rgb(119,204,255)" }}
            disabled={disabled}
          >
            Insufficient amount
          </Button>
        </Box>
      )
    ) : (
      <Box mt="0.5rem">
        <Button
          color="white"
          bg="rgb(187,142,224)"
          width="100%"
          p="1.62rem"
          borderRadius="1.25rem"
          _hover={{ bg: "rgb(119,204,255)" }}
          disabled={disabled}
        >
          Please select token
        </Button>
      </Box>
    )
  ) : (
    <Box mt="0.5rem">
      <Button
        onClick={handleConnectWallet}
        color="white"
        bg="rgb(187,142,224)"
        width="100%"
        p="1.62rem"
        borderRadius="1.25rem"
        _hover={{ bg: "rgb(119,204,255)" }}
        disabled={disabled}
      >
        Connect Wallet to {srcChain.charAt(0).toUpperCase() + srcChain.slice(1)}
      </Button>
    </Box>
  );
}
