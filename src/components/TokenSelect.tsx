import {Button, Box, Image, useDisclosure, useColorMode} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import { Token } from "../data_models/Token";
import { priva_lavender, priva_turquoise } from "../theme";

type Props = {
  openTokenModal: any;
  token: Token | null;
  // image: string;
  setActivatedButton: any;
  disabled: boolean;
};

export default function TokenSelect({ openTokenModal, token, /*image,*/ setActivatedButton, disabled } : Props) {
  const { colorMode } = useColorMode();

  return token !== null ? (
    <Button
      bg={colorMode === "dark" ? "#1e1e1e" : "white"}
      borderRadius="1.12rem"
      boxShadow="rgba(0, 0, 0, 0.075) 0px 6px 10px"
      fontWeight="500"
      mr="0.5rem"
      color={colorMode === "dark" ? "white" : "black"}
      onClick={() => {
        setActivatedButton();
        openTokenModal();}}
      _hover={{ bg: priva_turquoise }}
      rightIcon={<ChevronDownIcon fontSize="1.37rem" cursor="pointer" />}
      disabled={disabled}
      >
      {/* <Image boxSize="1.5rem"
             src={image}
             alt="Logo"
             mr="0.5rem"
      /> */}
      {token!.symbol}
    </Button>
  ) : (
    <Button
      bg={priva_lavender}
      color="white"
      p="0rem 1rem"
      borderRadius="1.12rem"
      onClick={() => {
        setActivatedButton();
        openTokenModal();}}
      _hover={{ bg: priva_turquoise }}
      rightIcon={<ChevronDownIcon fontSize="1.37rem" cursor="pointer" />}
      disabled={disabled}>
        Select a token
    </Button>
  );
}
