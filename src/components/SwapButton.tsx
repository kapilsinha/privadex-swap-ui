import { Button, Box, useToast } from "@chakra-ui/react";
import { Astar, Moonbeam, useConnector, useEthers } from "@usedapp/core";
import { Token } from "../data_models/Token";
import { priva_grayed_lavender, priva_lavender, priva_turquoise } from "../theme";

type Props = {
  srcChain: string;
  srcToken: Token | null;
  areTokensSelected: boolean;
  areQuantitiesHighEnough: boolean;
  userHasSufficientBalance: boolean;
  startSwap: any;
  disabled: boolean;
};

export default function SwapButton({
  srcChain,
  srcToken,
  areTokensSelected,
  areQuantitiesHighEnough,
  userHasSufficientBalance,
  startSwap,
  disabled,
}: Props) {
  const { account, chainId, switchNetwork, activateBrowserWallet, error } =
    useEthers();
  const { connector, isLoading } = useConnector();
  const toast = useToast();

  function funcIsCorrectChainId() {
    // Should make Chain not a string later so I don't have to do this if-else logic here
    if (srcChain === "moonbeam") {
      return chainId === Moonbeam.chainId;
    }
    if (srcChain === "astar") {
      return chainId === Astar.chainId;
    }
    return false;
  }

  const isCorrectChainId = funcIsCorrectChainId();

  async function handleConnectWallet() {
    activateBrowserWallet({ type: "metamask" });
    if (srcChain === "astar") {
      await switchNetwork(Astar.chainId);
    } else if (srcChain === "moonbeam") {
      await switchNetwork(Moonbeam.chainId);
    }
  }

  return account && isCorrectChainId ? (
    areTokensSelected && areQuantitiesHighEnough && userHasSufficientBalance ? (
      <Box mt="0.5rem">
        <Button
          onClick={() => {
            toast({
              title: "Don't exit this app tab/window yet!",
              description: `Please feel free to exit the application after you get a pop-up saying 'Swap in progress' (takes just a few seconds). But we will show your swap status updates if you stay on :).`,
              status: "info",
              duration: 16000,
              isClosable: true,
              position: "bottom",
            });
            startSwap();
          }}
          color="white"
          bg={priva_lavender}
          width="100%"
          p="1.62rem"
          borderRadius="1.25rem"
          _hover={{ bg: priva_turquoise }}
          disabled={disabled}
        >
          Swap
        </Button>
      </Box>
    ) : (
      <Box mt="0.5rem">
        <Button
          color="white"
          bg={priva_grayed_lavender}
          width="100%"
          p="1.62rem"
          borderRadius="1.25rem"
          _hover={{ bg: priva_grayed_lavender }}
          disabled={disabled}
        >
          {areTokensSelected
            ? areQuantitiesHighEnough
              ? `Insufficient ${srcToken?.symbol} balance`
              : "Amount too low"
            : "Please select a token"}
        </Button>
      </Box>
    )
  ) : (
    <Box mt="0.5rem">
      <Button
        onClick={handleConnectWallet}
        color="white"
        bg={priva_lavender}
        width="100%"
        p="1.62rem"
        borderRadius="1.25rem"
        _hover={{ bg: priva_turquoise }}
        disabled={disabled}
      >
        {account === undefined
          ? "Connect Wallet"
          : `Switch network to ${srcChain
              .charAt(0)
              .toUpperCase()}${srcChain.slice(1)}`}
      </Button>
    </Box>
  );
}
