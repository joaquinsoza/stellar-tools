"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  InputGroup,
  InputLeftElement,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  Text,
  Modal,
  useOutsideClick,
  useDisclosure,
} from "@chakra-ui/react";
import { IoMdSearch } from "react-icons/io";
import { useMergedAssetLists } from "@/hooks/useMergedAssetsList";
import Link from "next/link";

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

      return (
        matchesCodeIssuer ||
        matchesContract ||
        matchesOrg ||
        matchesName ||
        matchesDomain
      );
    });
  }, [searchTerm, assets]);

  const getRedirectUrl = (asset: any) => {
    if (asset.contract) {
      return `/assets/${asset.contract}`;
    } else if (!asset.contract) {
      return `/assets/${asset.code}:${asset.issuer}`;
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
                <Box key={index} paddingY="2">
                  <Text fontWeight="bold">{asset.name}</Text>
                  <Text fontSize="sm">
                    {asset.code}:{asset.issuer}
                  </Text>
                  <Text fontSize="sm">{asset.org}</Text>
                  <Text fontSize="sm">{asset.domain}</Text>
                </Box>
              </Link>
            ))}
          </Box>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default SearchBar;
