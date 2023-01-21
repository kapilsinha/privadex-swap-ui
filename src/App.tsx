import { ChakraProvider, Flex, useDisclosure, VStack } from "@chakra-ui/react";
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

  return (
    <ChakraProvider theme={theme}>
      <Header>
        <ConnectButton handleOpenModal={onOpen} />
        <AccountModal isOpen={isOpen} onClose={onClose} />
      </Header>
      <VStack position={"absolute"} px="4.3rem">
        <SocialIcon
          url="https://discord.gg/dpPDNreeQ3"
          style={{ height: 35, width: 35, marginBottom: 10 }}
        />
        <SocialIcon
          url="https://twitter.com/doprivadex"
          style={{ height: 35, width: 35, marginBottom: 10 }}
        />
        <SocialIcon
          url="https://www.youtube.com/@privadex"
          style={{ height: 35, width: 35, marginBottom: 10 }}
        />
        <SocialIcon
          url="https://github.com/kapilsinha/privadex"
          style={{ height: 35, width: 35, marginBottom: 10 }}
        />
      </VStack>
      <Flex px="5" position={"absolute"} left="2rem" bottom="2rem">
        <FeedbackForm />
      </Flex>
      <Swap />
    </ChakraProvider>
  );
}

export default App;
