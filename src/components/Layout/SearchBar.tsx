"use client";
import React, { useState, useMemo, useRef } from "react";
import {
  InputGroup,
  InputLeftElement,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  Text,
  useOutsideClick,
  useDisclosure,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import { IoMdSearch } from "react-icons/io";
import { useMergedAssetLists } from "@/hooks/useMergedAssetsList";
import Link from "next/link";
import { Asset } from "@/types/external";

const SearchBar = () => {
  const { assets } = useMergedAssetLists();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");

  const popoverRef = useRef(null);
  useOutsideClick({
    ref: popoverRef,
    handler: onClose,
  });

  const filteredAssets = useMemo(() => {
    return assets?.filter((asset) => {
      // Normalize search term and asset properties for case-insensitive comparison
      const term = searchTerm.toLowerCase();
      const matchesCodeIssuer =
        asset.code && asset.issuer
          ? `${asset.code}:${asset.issuer}`.toLowerCase().includes(term)
          : false;
      const matchesContract = asset.contract?.toLowerCase().includes(term);
      const matchesOrg = asset.org?.toLowerCase().includes(term);
      const matchesName = asset.name?.toLowerCase().includes(term);
      const matchesDomain = asset.domain?.toLowerCase().includes(term);

      //TODO: if no matches llok in the blockchain with useAsset or similar

      return (
        matchesCodeIssuer ||
        matchesContract ||
        matchesOrg ||
        matchesName ||
        matchesDomain
      );
    });
  }, [searchTerm, assets]);

  const getRedirectUrl = (asset: Asset) => {
    if (asset.contract) {
      return `/assets/${asset.contract}`;
    } else if (!asset.contract) {
      return `/assets/${asset.code}-${asset.issuer}`;
    }
    // Fallback or additional conditions here
    return "#"; // Placeholder: adjust according to logic
  };

  return (
    <Box ref={popoverRef} w={"full"}>
      <Popover
        isOpen={filteredAssets?.length! > 0 && searchTerm.length > 0 && isOpen}
        placement="bottom-start"
        autoFocus={false}
        closeOnBlur
        closeOnEsc
      >
        <PopoverTrigger>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <IoMdSearch color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Type address, symbol, CODE:ISSUER"
              value={searchTerm}
              onChange={(e) => [onOpen(), setSearchTerm(e.target.value)]}
            />
          </InputGroup>
        </PopoverTrigger>
        <PopoverContent width="auto" maxWidth="100%">
          <Box p={4}>
            {filteredAssets?.map((asset, index) => (
              <Link key={index} href={getRedirectUrl(asset)} onClick={onClose}>
                <Flex
                  key={index}
                  paddingY="2"
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                  gap={4}
                  borderBottomWidth="1px"
                  borderBottomColor={"gray.200"}
                >
                  <Avatar src={asset.icon}></Avatar>
                  <Box>
                    <Flex gap={2} alignItems={"center"}>
                      {asset.name ? (
                        <>
                          <Text fontWeight="bold">{asset.name}</Text>
                          <Text fontSize="xs">{asset.code}</Text>
                        </>
                      ) : (
                        <Text fontWeight="bold">{asset.code}</Text>
                      )}
                    </Flex>
                    <Text fontSize="sm">{asset.domain}</Text>
                    <Text fontSize="sm">{asset.contract}</Text>
                  </Box>
                </Flex>
              </Link>
            ))}
          </Box>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default SearchBar;
