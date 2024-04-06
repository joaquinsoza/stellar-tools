import React from "react";
import { InputGroup, InputLeftElement, Input, Button } from "@chakra-ui/react";
import { IoMdSearch } from "react-icons/io";

const SearchBar = () => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <IoMdSearch color="gray.300" />
      </InputLeftElement>
      <Input type="text" placeholder="Type address, symbol, CODE:ISSUER" />
    </InputGroup>
  );
};

export default SearchBar;
