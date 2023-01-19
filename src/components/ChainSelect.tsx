import { useState } from "react";
import {Button, Box, Image, useDisclosure, RadioGroup, Stack, Radio} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import astarLogo from "../assets/astar.webp";
import moonbeamLogo from "../assets/moonbeam.png";

type Props = {
  chain: string;
  setChain: any;
  // image: string;
  disabled: boolean;
};

export default function ChainSelect({chain, setChain, disabled}: Props) {
    return (
      <RadioGroup pb={"1rem"} onChange={(newChain: string) => setChain(newChain)} value={chain}>
        <Stack direction='row'>
          <Radio value='moonbeam' isDisabled={disabled}>
          <Image boxSize="1.5rem"
             src={moonbeamLogo}
             alt="Logo"
             mr="0.5rem"
            />
            Moonbeam
            </Radio>
          <Radio value='astar' isDisabled={disabled}>
          <Image boxSize="1.5rem"
             src={astarLogo}
             alt="Logo"
             mr="0.5rem"
            />
            Astar
            </Radio>
        </Stack>
      </RadioGroup>
    )
  }
