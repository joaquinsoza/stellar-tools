"use client";

import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  IconButton,
  FlexProps,
} from "@chakra-ui/react";
import { BiMoon, BiSun } from "react-icons/bi";
import SearchBar from "./SearchBar";
import { FiMenu } from "react-icons/fi";
import { Image } from "@chakra-ui/next-js";
import { useContext } from "react";
import { SidebarContext } from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

interface NavProps extends FlexProps {
  onOpen: () => void;
}

export default function Nav({ onOpen, ...rest }: NavProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen } = useContext(SidebarContext);

  return (
    <Box
      position="fixed"
      w="full"
      bg={useColorModeValue("white", "gray.900")}
      px={4}
      py={2}
      h={20}
      pl={{ base: "full", md: `${isOpen ? "64" : "24"}` }}
      transition="padding-left 0.3s ease"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={{ base: "space-between", md: "space-between" }}
        w={"full"}
      >
        <Box w={"50%"} display={{ base: "none", md: "flex" }}>
          <SearchBar />
        </Box>
        <Image
          display={{ base: "flex", md: "none" }}
          alt="StellarTools"
          width={35}
          height={35}
          src={"/StellarTools-removebg.png"}
        />
        <Stack direction={"row"} spacing={4}>
          <Button
            display={{ base: "none", md: "flex" }}
            onClick={toggleColorMode}
          >
            {colorMode === "light" ? <BiMoon /> : <BiSun />}
          </Button>
          <Button colorScheme="pink" variant="solid">
            Connect Wallet
          </Button>
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />
        </Stack>
      </Flex>
    </Box>
  );
}
