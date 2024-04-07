export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text successfully copied to clipboard");
    // Optionally, show a toast or alert to the user that the copy was successful.
  } catch (err) {
    console.error("Failed to copy text to clipboard", err);
    // Optionally, show a toast or alert to the user that the copy failed.
  }
};
