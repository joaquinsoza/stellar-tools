import { useToast } from "@chakra-ui/react";

export const useCopyToClipboard = () => {
  const toast = useToast();

  const copyToClipboard = async (
    text?: string,
    successMessage = "Copied!",
    errorMessage = "Failed to copy!"
  ) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return copyToClipboard;
};
