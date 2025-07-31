import toast from "react-hot-toast";

export const useClipboard = () => {
  const copyToClipboard = async (
    text?: string,
    successMessage = "Copied!",
    errorMessage = "Failed to copy!"
  ) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
    } catch (err) {
      toast.error(errorMessage);
    }
  };

  return copyToClipboard;
};
