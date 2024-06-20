import { FlexProps, Flex, Icon, Tooltip } from "@chakra-ui/react";
import { useSorobanReact } from "@soroban-react/core";
import Link from "next/link";
import { IconType } from "react-icons";

interface NavItemProps extends FlexProps {
  icon: IconType;
  href: string;
  children: React.ReactNode;
  requiresWallet?: boolean;
}

export const NavItem = ({
  icon,
  href,
  children,
  requiresWallet,
  ...rest
}: NavItemProps) => {
  const { address } = useSorobanReact();
  const isDisabled = requiresWallet && !address;

  return (
    <Tooltip label={isDisabled ? "Wallet connection required" : ""}>
      <Flex
        as={isDisabled ? "div" : Link}
        href={isDisabled ? undefined : href}
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor={"pointer"}
        _hover={{
          bg: isDisabled ? "gray.200" : "pink.400",
          color: isDisabled ? "gray.500" : "white",
        }}
        {...rest}
      >
        <Icon
          mr={4}
          fontSize="24"
          _groupHover={{
            color: isDisabled ? "gray.500" : "white",
          }}
          as={icon}
        />
        {children}
      </Flex>
    </Tooltip>
  );
};
