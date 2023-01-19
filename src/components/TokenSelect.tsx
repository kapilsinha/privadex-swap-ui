import {Button, Box, Image, useDisclosure} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import { Token } from "../data_models/Token";

type Props = {
  openTokenModal: any;
  token: Token | null;
  // image: string;
  setActivatedButton: any;
  disabled: boolean;
};

export default function TokenSelect({ openTokenModal, token, /*image,*/ setActivatedButton, disabled } : Props) {

  return token !== null ? (
    <Button
      bg="white"
      borderRadius="1.12rem"
      boxShadow="rgba(0, 0, 0, 0.075) 0px 6px 10px"
      fontWeight="500"
      mr="0.5rem"
      color="black"
      onClick={() => {
        setActivatedButton();
        openTokenModal();}}
      _hover={{ bg: "rgb(119,204,255)" }}
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
      bg="rgb(187,142,224)"
      color="white"
      p="0rem 1rem"
      borderRadius="1.12rem"
      onClick={() => {
        setActivatedButton();
        openTokenModal();}}
      _hover={{ bg: "rgb(119,204,255)" }}
      rightIcon={<ChevronDownIcon fontSize="1.37rem" cursor="pointer" />}
      disabled={disabled}>
        Select a token
    </Button>
  );
}
