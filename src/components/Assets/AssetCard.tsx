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
import { BiCopy } from "react-icons/bi";
import { IoChevronDown } from "react-icons/io5";
import { Divider } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";

const SOROSWAP_URL: string = "https://app.soroswap.finance/swap/";
const STELLAR_CHAIN_URL: string = "https://stellarchain.io/assets/";
const STELLAR_EXPERT_URL: string =
  "https://stellar.expert/explorer/public/asset/";
{
  /* <HStack spacing={2}>
<Link
  href={`https://stellar.expert/explorer/public/asset/${asset?.code}-${asset?.issuer}`}
  target="_blank"
  fontSize="sm"
>
  See on stellar.expert
</Link>
<Link
  href={`https://stellarchain.io/assets/${asset?.code}-${asset?.issuer}`}
  target="_blank"
  fontSize="sm"
>
  See on stellarchain.io
</Link>
 */
}
interface AssetCardProps {
  name?: string;
  icon?: string;
  code?: string;
  contract?: string;
  domain?: string;
  issuer?: string;
}

export function AssetCard({
  name,
  icon,
  code,
  contract,
  domain,
  issuer,
}: AssetCardProps) {
  const copyToClipboard = useClipboard();
  const stellarParams = `${code}-${issuer}`;
  const handleRedirectToExternalLink = (url: string, params: string) => {
    window.open(url + `${params}`, "_blank");
  };

  return (
    <Card rounded={"2xl"} width={"100%"} variant="elevated">
      <CardBody>
        <HStack justifyContent="space-between">
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
          <Center height="80px">
            <Divider orientation="vertical" borderWidth={1} />
          </Center>
          <HStack alignItems={"center"}>
            <VStack>
              <HStack>
                <Menu>
                  <MenuButton as={Button} rightIcon={<IoChevronDown />}>
                    See on
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() =>
                        handleRedirectToExternalLink(
                          STELLAR_CHAIN_URL,
                          stellarParams
                        )
                      }
                    >
                      Stellar chain
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        handleRedirectToExternalLink(
                          STELLAR_EXPERT_URL,
                          stellarParams
                        )
                      }
                    >
                      Stellar expert
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Button
                  colorScheme="pink"
                  variant="solid"
                  onClick={() =>
                    handleRedirectToExternalLink(SOROSWAP_URL, contract!)
                  }
                >
                  Swap on Soroswap
                </Button>
              </HStack>

              <VStack
                cursor={"pointer"}
                color="gray.500"
                onClick={() =>
                  copyToClipboard(contract, `${code} address copied!`)
                }
              >
                <Tooltip label="Copy to clipboard" openDelay={500}>
                  <HStack spacing={2}>
                    <Text>CONTRACT ID:</Text>
                    <BiCopy />
                    <Text display="inline-block">
                      {shortenAddress(contract!)}
                    </Text>
                  </HStack>
                </Tooltip>
              </VStack>
            </VStack>
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );
}
