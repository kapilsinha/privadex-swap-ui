import { ChakraProvider, Flex, useMediaQuery } from "@chakra-ui/react";
import theme from "./theme";
import Header from "./components/Header";
import Swap from "./components/Swap";
import FeedbackForm from "./components/FeedbackForm";

import "@fontsource/inter";
import "./global.css";
import Footer from "./components/Footer";

function App() {
  const [isScreenWideEnough] = useMediaQuery("(min-width: 1150px)");

  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Swap />
      {isScreenWideEnough ? (
        <Flex px="5" position={"absolute"} left="0rem" bottom="2rem">
          <FeedbackForm nrows={5} />
        </Flex>
      ) : (
        <Flex bottom="2rem" justifyContent="center">
          <FeedbackForm nrows={3} />
        </Flex>
      )}
      <Footer />
    </ChakraProvider>
  );
}

export default App;
