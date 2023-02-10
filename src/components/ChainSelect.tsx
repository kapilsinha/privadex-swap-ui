import { useState } from "react";
import {Button, Box, Image, useDisclosure, RadioGroup, Stack, Radio, Text} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import astarLogo from "../assets/astar.webp";
import moonbeamLogo from "../assets/moonbeam.png";

type Props = {
  chain: string;
  setChain: any;
  // image: string;
  disabled: boolean;
  fontSize: string;
};

export default function ChainSelect({chain, setChain, disabled, fontSize}: Props) {
    return (
      <RadioGroup pb={"1rem"} onChange={(newChain: string) => setChain(newChain)} value={chain}>
        <Stack direction='row'>
          <Radio value='moonbeam' isDisabled={disabled}>
          <Image boxSize="1.5rem"
             src={moonbeamLogo}
             alt="Logo"
             mr="0.5rem"
            />
            <Text fontSize={fontSize}>Moonbeam</Text>
            </Radio>
          <Radio value='astar' isDisabled={disabled}>
          <Image boxSize="1.5rem"
             src={astarLogo}
             alt="Logo"
             mr="0.5rem"
            />
            <Text fontSize={fontSize}>Astar</Text>
            </Radio>
        </Stack>
      </RadioGroup>
    )
  }
