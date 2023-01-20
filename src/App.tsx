import { ChakraProvider, Flex, useDisclosure } from "@chakra-ui/react";
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
      <Swap />
      <Flex alignItems="center" justifyContent="center" py="7">
        <SocialIcon
          url="https://discord.gg/dpPDNreeQ3"
          style={{ left: "-1.5rem" }}
        />
        <SocialIcon
          url="https://twitter.com/doprivadex"
          style={{ left: "-0.5rem" }}
        />
        <SocialIcon url="https://www.youtube.com/@privadex" 
          style={{ left: "0.5rem" }}
        />
        <SocialIcon url="https://github.com/kapilsinha/privadex"
          style={{ left: "1.5rem" }}
          />
      </Flex>
      <Flex px="5" position={'absolute'} left='2rem' bottom='2rem'>
        <FeedbackForm />
      </Flex>
    </ChakraProvider>
  );
}

export default App;
