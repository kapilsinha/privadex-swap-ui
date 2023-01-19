import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text, Input,
} from "@chakra-ui/react";
// Can use later to make the table pretty but requires more work
// import ReactTable from "react-table";
import { useEffect, useState, Fragment } from "react";
import { Token } from '../../data_models/Token';
import token_list from './token_list.json';


type Props = {
  isOpen: any;
  onClose: any;
  selectedChain: string;
  selectedToken: Token | null;
  otherToken: Token | null;
  setSelectedToken: any;
};

export default function TokenModal({isOpen, onClose, selectedChain, selectedToken, otherToken, setSelectedToken}: Props) {
  const crypto = token_list.map(x => Token.fromJSON(x));
  // console.log(crypto);
  const [search, setSearch] = useState<any>("");

  // Used to reset the search text. Otherwise between close and open, the search
  // text remains set (but is invisible)
  // Can later dynamically pull tokens, but we do it statically for now
  useEffect(() => {
    setSearch("");
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        background="white"
        border="0.06rem"
        borderStyle="solid"
        borderColor="gray.300"
        borderRadius="3xl">
        <ModalHeader color="black" px={4} fontSize="lg" fontWeight="medium">
          Select A Token
        </ModalHeader>
        <ModalCloseButton
          color="black"
          fontSize="sm"
          _hover={{
            color: "gray.600",
          }}/>
        <ModalBody pt={0} px={4}>
          <Box
            borderRadius="3xl"
            border="0.06rem"
            borderStyle="solid"
            borderColor="gray.300"
            px={5}
            pt={4}
            pb={2}
            mb={3}>
            <Input
              placeholder="Search token name / symbol / address"
              fontSize="1.5rem"
              width="100%"
              size="19rem"
              textAlign="left"
              outline="none"
              border="none"
              focusBorderColor="none"
              type="text"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              color="black"/>
          </Box>
          {/*<Box color="black" display="flex">*/}
          {/*    <img src={imageToShow} alt="logo" width="50px" />*/}
          {/*    <span>{tokenNameToShow}</span>*/}
          {/*</Box>*/}
          <div id="tokenlist" className="App">
            <table style={{'height': '350px', 'overflow':'scroll', 'display': 'block'}}>
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Symbol</td>
                  <td>Address</td>
                </tr>
              </thead>
              {/* <tbody> */}
              <tbody>
                {crypto
                  .filter((token) => {
                    return token.symbol.toLowerCase().includes(search.toLowerCase()) ||
                    token.name.toLowerCase().includes(search.toLowerCase()) ||
                    token.getAddressFromEncodedTokenName().includes(search.toLowerCase());
                  })
                  .map((token, index) => {
                    let hidden = false;
                    // Hide a token if it is selected on the other dropdown
                    // TODO: revisit, should only kick in if they're the same chain
                    let sameAsOtherToken = token.name === otherToken?.name && token.chain === otherToken?.chain;
                    let wrongChain = token.chain !== selectedChain;
                    if (sameAsOtherToken || wrongChain) {
                      hidden = true
                    }
                    // I altogether avoid creating the document elements so we can highlight alternating rows
                    // and also it's wasteful to render but hide the objects
                    return hidden === false && (
                      <Fragment key={index}>
                        <tr id={token.name} key={index}
                            style={{
                              backgroundColor: (token.name === selectedToken?.name ? "rgb(208, 172, 235)" : "")
                            }}
                            hidden={hidden}
                            onClick={function (e) {
                              // console.log('Set token');
                              setSelectedToken(token);
                            }}>
                          <td className="logo">
                              {/* <a href={token.websiteUrl}>
                                <img src={token.icon} alt="logo" width="30px" />
                              </a> */}
                              <span>{token.name}</span>
                          </td>
                          <td className="symbol">{token.symbol}</td>
                          <td className="address">{token.getTruncatedAddressFromEncodedTokenName()}</td>
                        </tr>
                      </Fragment>
                    );
                  })
                  //.slice(0, 10)
                }
              </tbody>
            </table>
          </div>

        </ModalBody>

        <ModalFooter
          justifyContent="flex-start"
          background="rgb(237, 238, 242)"
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          p={6}>
          <Text
            color="black"
            fontWeight="medium"
            fontSize="md">
            Manage Token List
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
