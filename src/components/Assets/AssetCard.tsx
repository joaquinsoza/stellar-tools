import { shortenAddress } from "@/helpers/address";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
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
} from "@chakra-ui/react";
import { useMemo } from "react";
import { BiCopy } from "react-icons/bi";

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
  const copyToClipboard = useCopyToClipboard();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <Card rounded={"2xl"} width={"100%"}>
      <CardBody>
        <HStack alignItems={"center"}>
          <Skeleton isLoaded={Boolean(icon)} fadeDuration={1} rounded={"full"}>
            <Avatar name={name} src={icon} size={{ base: "lg", md: "2xl" }} />
          </Skeleton>
          <VStack
            align={"start"}
            gap={{ base: 0, md: 2 }}
            borderLeftWidth="2px"
            borderLeftColor={"gray.200"}
            pl={2}
          >
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
                >
                  {name ?? "Asset name"}
                </Text>
                {name !== code && (
                  <Text fontSize={{ base: "xs", md: "sm" }}>({code})</Text>
                )}
              </Flex>
            </Skeleton>
            <Skeleton isLoaded={Boolean(domain)} fadeDuration={1}>
              <Link href={`https://${domain}`} target="_blank">
                {domain ?? "Asset Domain"}
              </Link>
            </Skeleton>
            <Skeleton isLoaded={Boolean(contract)} fadeDuration={1} height={6}>
              <Tooltip label="Copy to clipboard" openDelay={500}>
                <HStack
                  cursor={"pointer"}
                  color="gray.500"
                  onClick={() =>
                    copyToClipboard(contract, `${code} address copied!`)
                  }
                >
                  <BiCopy />
                  <Text>{shortenAddress(contract!)}</Text>
                </HStack>
              </Tooltip>
            </Skeleton>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
}
