"use client";

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
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

const NavLink = (props: Props) => {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export default function Nav({ onOpen, ...rest }: NavProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen } = useContext(SidebarContext); // we will use context to manage the sidebar state

  return (
    <>
      <Box
        position="fixed"
        w="full"
        bg={useColorModeValue("white", "gray.900")}
        px={4}
        pl={isOpen ? "64" : "24"} // Change pl based on isOpen
        transition="padding-left 0.3s ease" // Animate the padding change
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
    </>
  );
}
