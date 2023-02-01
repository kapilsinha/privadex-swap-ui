import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';
import { Dict } from "@chakra-ui/utils";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const fonts = {
  heading: "Inter",
  body: "Inter",
};

const colors = {
  priva_purple: {100: "#41259a"},
  priva_lavender: {100: "#bb8ee0"},
  priva_turquoise: {100: "#77ccff"}
}

const styles = {
  global: (props: Dict<any>) => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      background: mode('gray.100', '#141214')(props),
    },
  }),
};

const theme = extendTheme({
  config,
  fonts,
  colors,
  styles
});

export default theme;
