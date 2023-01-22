import {
  ChakraProvider,
  Flex,
  HStack,
  Show,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import theme from "./theme";
import Header from "./components/Header";
import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/Modal/AccountModal";
import Swap from "./components/Swap";
import FeedbackForm from "./components/FeedbackForm";
import { SocialIcon } from "react-social-icons";

import "@fontsource/inter";
import "./global.css";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isScreenWideEnough] = useMediaQuery("(min-width: 1150px)");

  return (
    <ChakraProvider theme={theme}>
      <Header>
        <VStack spacing={4}>
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
      </Header>
      <Swap />
      {isScreenWideEnough ? (
        <Flex px="5" position={"absolute"} left="0rem" bottom="2rem">
          <FeedbackForm nrows={5} />
        </Flex>
      ) : (
        <FeedbackForm nrows={3} />
      )}
    </ChakraProvider>
  );
}

export default App;
