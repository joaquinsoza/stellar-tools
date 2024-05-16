"use client";

import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  BoxProps,
  VStack,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { FiHome } from "react-icons/fi";
import { IconType } from "react-icons";
import { Image } from "@chakra-ui/next-js";
import React, { useContext } from "react";
import { BiCoinStack } from "react-icons/bi";
import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { NavItem } from "./NavItem";
import { SidebarContext } from "@/context/sidebar/SidebarContext";
import { IoContract } from "react-icons/io5";
import { RiContractLine } from "react-icons/ri";

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, href: "/" },
  { name: "Assets", icon: BiCoinStack, href: "/assets" },
  { name: "Contracts", icon: RiContractLine, href: "/contracts" },
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
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
            fontFamily={"roboto"}
            fontSize={"lg"}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="clip"
          >
            STELLAR TOOLS
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
            onClick={onClose}
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
          <Link href="https://discord.gg/Bq8qSteFSz" target="_blank">
            <FaDiscord fontSize="1.5rem" />
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};
