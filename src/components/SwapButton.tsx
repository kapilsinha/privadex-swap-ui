import { Button, Box} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";

export default function SwapButton() {
  const { account } = useEthers();

  return account  ? (
      window.__selected && window.__selected2 ? (
    <Box mt="0.5rem">
      <Button
        onClick={() => console.log("swap button clicked")}
        color="white"
        bg="rgb(187,142,224)"
        width="100%"
        p="1.62rem"
        borderRadius="1.25rem"
        _hover={{ bg: "rgb(119,204,255)" }}
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
          >
            Please select token
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
      >
        Connect Wallet
      </Button>
    </Box>
  );
}
