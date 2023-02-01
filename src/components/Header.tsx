import { ReactNode } from "react";
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
} from "@chakra-ui/react";

import logo from "../assets/logo.svg";
import AccountModal from "./Modal/AccountModal";
import { SocialIcon } from "react-social-icons";
import ConnectButton from "./ConnectButton";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Menu>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        // maxW="83.43rem"
        mx="1.5rem"
        mt="1.5rem"
      >
        <Image boxSize="8rem" src={logo} alt="PrivaDEX" />
        <VStack spacing={4}>
          <Switch
            colorScheme="purple"
            onChange={toggleColorMode}
            defaultChecked={colorMode === "dark"}
          >
            Dark mode
          </Switch>
          <ConnectButton handleOpenModal={onOpen} />
          <HStack spacing={3}>
            <SocialIcon
              url="https://discord.gg/dpPDNreeQ3"
              target="_blank"
              style={{ height: 35, width: 35 }}
            />
            <SocialIcon
              url="https://twitter.com/doprivadex"
              target="_blank"
              style={{ height: 35, width: 35 }}
            />
            <SocialIcon
              url="https://www.youtube.com/@privadex"
              target="_blank"
              style={{ height: 35, width: 35 }}
            />
            <SocialIcon
              url="https://github.com/kapilsinha/privadex"
              target="_blank"
              style={{ height: 35, width: 35 }}
            />
          </HStack>
        </VStack>

        <AccountModal isOpen={isOpen} onClose={onClose} />
      </Flex>
    </Menu>
  );
}
