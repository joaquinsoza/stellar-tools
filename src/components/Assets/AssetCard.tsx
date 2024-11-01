import { shortenAddress } from "@/helpers/address";
import { useClipboard } from "@/hooks/useClipboard";
import { Link } from "@chakra-ui/next-js";
import {
  Avatar,
  Card,
  CardBody,
  Flex,
  HStack,
  VStack,
  Text,
  Tooltip,
  Skeleton,
  useMediaQuery,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { BiCopy } from "react-icons/bi";
import { IoChevronDown } from "react-icons/io5";

interface AssetCardProps {
  name?: string;
  icon?: string;
  code?: string;
  contract?: string;
  domain?: string;
}

export function AssetCard({
  name,
  icon,
  code,
  contract,
  domain,
}: AssetCardProps) {
  const copyToClipboard = useClipboard();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <Card rounded={"2xl"} width={"100%"} variant="elevated">
      <CardBody>
        <HStack>
          <HStack alignItems={"center"}>
            <Skeleton
              isLoaded={Boolean(icon)}
              fadeDuration={1}
              rounded={"full"}
            >
              <Avatar name={name} src={icon} size={{ base: "lg", md: "xl" }} />
            </Skeleton>
            <Box>
              <Skeleton
                height={{ base: "30px", md: 9 }}
                isLoaded={Boolean(name)}
                fadeDuration={1}
              >
                <Flex alignItems={"baseline"} gap={2}>
                  <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="clip"
                    textColor={"#333333"}
                  >
                    {name ?? "Asset name"}
                  </Text>
                  {name !== code && (
                    <Text
                      textColor={"#A3A3A3"}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      ({code})
                    </Text>
                  )}
                </Flex>
              </Skeleton>
              <Skeleton isLoaded={Boolean(domain)} fadeDuration={1}>
                <Link
                  href={`https://${domain}`}
                  textColor={"#A3A3A3"}
                  target="_blank"
                >
                  {domain ?? "Asset Domain"}
                </Link>
              </Skeleton>
            </Box>
          </HStack>
          <HStack>
            <Box>
              <VStack>
                <HStack>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<IoChevronDown />}>
                      See on
                    </MenuButton>
                    <MenuList>
                      <MenuItem>Download</MenuItem>
                      <MenuItem>Create a Copy</MenuItem>
                    </MenuList>
                  </Menu>
                  <Button
                    colorScheme="pink"
                    variant="solid"
                    // onClick={onClick}
                    // isLoading={isLoading}
                  >
                    Swap on Soroswap
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </HStack>
          {/* <VStack
            align={"start"}
            gap={{ base: 0, md: 2 }}
            borderLeftWidth="2px"
            borderLeftColor={"gray.200"}
            pl={2}
            width="full"
          >
            <Skeleton isLoaded={Boolean(contract)} fadeDuration={1} height={6}>
              <Tooltip label="Copy to clipboard" openDelay={500}>
                <HStack
                  cursor={"pointer"}
                  color="gray.500"
                  onClick={() =>
                    copyToClipboard(contract, `${code} address copied!`)
                  }
                >
                  <Text width="full">
                    <BiCopy /> {shortenAddress(contract!)}
                  </Text>
                </HStack>
              </Tooltip>
            </Skeleton>
          </VStack> */}
        </HStack>
      </CardBody>
    </Card>
  );
}
