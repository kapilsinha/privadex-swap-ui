import { ReactNode, useEffect, useState } from "react";
import {
  Flex,
  Menu,
  Image,
  useColorMode,
  VStack,
  HStack,
  useDisclosure,
  Button,
  Switch,
  useColorModeValue,
  Text,
  SimpleGrid,
  Box,
  useMediaQuery,
} from "@chakra-ui/react";

import light_phat_logo from "../assets/light_phat_contract_logo.svg";
import dark_phat_logo from "../assets/dark_phat_contract_logo.svg";
import light_w3f_logo from "../assets/web3_foundation_grants_badge_black.svg";
import dark_w3f_logo from "../assets/web3_foundation_grants_badge_white.svg";
import AccountModal from "./Modal/AccountModal";
import { SocialIcon } from "react-social-icons";
import ConnectButton from "./ConnectButton";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDarkMode, setIsDarkMode] = useState(colorMode === "dark");
  const phat_logo = isDarkMode ? dark_phat_logo : light_phat_logo;
  const w3f_logo = isDarkMode ? dark_w3f_logo : light_w3f_logo;
  const [isScreenFullWidth] = useMediaQuery("(min-width: 700px)");

  useEffect(() => setIsDarkMode(colorMode === "dark"), [colorMode]);

  function smallWidthFooter() {
    return (
      <VStack>
        <Flex mt="-2rem" justifyContent={"center"}>
          <Image boxSize="12rem" src={w3f_logo} alt="Web3 Foundation Grant" />
        </Flex>
        <Flex justifyContent="flex-end">
          <HStack mx="1.5rem" mt="-3.5rem">
            <Text as="b">Powered by</Text>
            <Image boxSize="6rem" src={phat_logo} alt="Phat Contract" />
          </HStack>
        </Flex>
      </VStack>
    );
  }

  function fullWidthFooter() {
    return (
      <SimpleGrid columns={3} spacing={10}>
        <Box></Box>
        {isScreenFullWidth ? (
          <Flex mt="-2rem" justifyContent={"center"}>
            <Image boxSize="15rem" src={w3f_logo} alt="Web3 Foundation Grant" />
          </Flex>
        ) : (
          <Box></Box>
        )}
        <Flex mt="-2rem" justifyContent={"flex-end"}>
          <HStack mx="1.5rem" mt="1.5rem">
            <Text as="b">Powered by</Text>
            <Image boxSize="6rem" src={phat_logo} alt="Phat Contract" />
          </HStack>
        </Flex>
      </SimpleGrid>
    );
  }

  return isScreenFullWidth ? fullWidthFooter() : smallWidthFooter();
}
