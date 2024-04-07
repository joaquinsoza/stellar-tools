"use client";

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  VStack,
  HStack,
  Heading,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import { IconType } from "react-icons";
import Nav from "./Navbar";
import { Image } from "@chakra-ui/next-js";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { BiCoinStack } from "react-icons/bi";
import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  href: string;
  children: React.ReactNode;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, href: "/" },
  { name: "Assets", icon: BiCoinStack, href: "/assets" },
];

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { isOpen, setIsOpen } = useContext(SidebarContext); // we will use context to manage the sidebar state

  return (
    <Box
      transition="width 0.3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: `${isOpen ? "60" : "20"}` }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      pos="fixed"
      h="full"
      overflow="hidden"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        pl="5"
        justifyContent="space-between"
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Flex align="center" gap={4} borderRadius="lg">
          <Image
            width={45}
            height={45}
            alt="StellarTools"
            src={"/stellartools.svg"}
          />
          <Heading
            fontFamily={"bukhari"}
            fontSize={"2xl"}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="clip"
          >
            Stellar Tools
          </Heading>
        </Flex>
        <CloseButton
          display={{ base: "flex", md: "none" }}
          mr={8}
          onClick={onClose}
        />
      </Flex>
      <Box py={4}>
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            href={link.href}
            overflow={"hidden"}
          >
            {link.name}
          </NavItem>
        ))}
      </Box>
      <VStack position="absolute" bottom="0" w="full">
        <HStack justifyContent="center" spacing={4} pb={4}>
          <Link
            href="https://github.com/joaquinsoza/stellar-tools"
            target="_blank"
          >
            <FaGithub fontSize="1.5rem" />
          </Link>
          <Link href="https://discord.gg/5znubwk5" target="_blank">
            <FaDiscord fontSize="1.5rem" />
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};
export const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
  return (
    <Link href={href}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "pink.400",
          color: "white",
        }}
        {...rest}
      >
        <Icon
          mr={4}
          fontSize="24"
          _groupHover={{
            color: "white",
          }}
          as={icon}
        />
        {children}
      </Flex>
    </Link>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen }}
    >
      <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
        <Nav onOpen={onOpen} zIndex={50} />
        <SidebarContent
          onClose={() => onClose}
          display={{ base: "none", md: "block" }}
          zIndex={50}
        />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: 20 }} p="4" pt={24}>
          {children}
        </Box>
      </Box>
    </SidebarContext.Provider>
  );
};

export default MainLayout;
