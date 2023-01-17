import { ReactNode } from "react";
import { Flex, Menu, Image } from "@chakra-ui/react";

import logo from "../assets/logo.svg";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Menu>
      <Flex
        d="flex"
        alignItems="center"
        justifyContent="space-between"
        maxW="83.43rem"
        mx="1.5rem"
        mt="1.5rem">
        <Image
          boxSize="8rem"
          src={logo}
          alt="PrivaDEX" />
        {children}
      </Flex>
    </Menu>
  );
}
