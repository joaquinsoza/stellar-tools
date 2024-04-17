import { extendTheme } from "@chakra-ui/react";
import { Roboto } from "next/font/google";

const robotoFont = Roboto({
  weight: ["400"],
  subsets: ["latin"],
});

const theme = extendTheme({
  fonts: {
    bukhari: `'Bukhari Script', sans-serif`,
    bukhariAlternate: `'Bukhari Script Alternates', sans-serif`,
    roboto: robotoFont.style.fontFamily,
  },
});

export default theme;
