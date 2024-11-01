export function isAddress(value: string): string | false {
  try {
    return value.match(/^[A-Z0-9]{56}$/) ? value : false;
  } catch {
    return false;
  }
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars)}...${parsed.substring(56 - chars)}`;
}

export function isCodeIssuerPair(input: string) {
  if (!input) return;
  return input.includes("-") || input.includes(":");
}

export function shortenText(text: string, chars = 4): string {
  return `${text.substring(0, chars)}...${text.substring(text.length - chars)}`;
}
