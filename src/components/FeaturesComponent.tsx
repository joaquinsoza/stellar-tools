"use client";
import {
  Box,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/next-js";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Stack
      p={4}
      bg={useColorModeValue("white", "gray.700")}
      boxShadow={"md"}
      rounded={"xl"}
      align={"center"}
      textAlign={"center"}
      spacing={3}
    >
      <Image
        alt={title}
        src={icon}
        width={10}
        height={10}
        color={useColorModeValue("pink.500", "pink.300")}
      />
      <Text fontWeight={600}>{title}</Text>
      <Text color={useColorModeValue("gray.600", "gray.400")}>
        {description}
      </Text>
    </Stack>
  );
};

const FeaturesComponent = () => {
  const features = [
    {
      icon: "/stellartools.svg",
      title: "Assets",
      description: "View asset details, including contract and issuer data.",
    },
    {
      icon: "/stellartools.svg",
      title: "Balances",
      description: "Manage your portfolio, track your asset performance.",
    },
    {
      icon: "/stellartools.svg",
      title: "Transactions",
      description: "Review your Stellar and Soroban transaction history.",
    },
  ];

  return (
    <Box py={6} maxW="4xl" mx="auto">
      <Flex flexDirection={"column"} alignItems={"center"} gap={4}>
        <Text fontSize={"3xl"} textAlign="center">
          A Suite of Tools for Stellar
        </Text>
        <Text fontSize={"md"} textAlign="center">
          Discover a versatile toolkit for the Stellar/Soroban ecosystem,
          designed to streamline asset creation, account management, and more.
          Embrace the simplicity of blockchain technology, made accessible for
          everyone.
        </Text>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3, lg: 3 }} spacing={5} mt={10}>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default FeaturesComponent;
