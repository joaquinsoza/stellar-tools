import { Box, Text } from "@chakra-ui/react";

export const CommingSoon = () => {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backdropFilter="blur(4px)"
      zIndex={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
      rounded="2xl"
    >
      <Text fontSize="xl">Coming Soon...</Text>
    </Box>
  );
};
