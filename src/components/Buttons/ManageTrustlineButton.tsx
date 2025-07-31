import { FaPencil } from "react-icons/fa6";

interface ManageTrustlineProps {
  asset?: any;
}

export function ManageTrustlineButton({ asset }: ManageTrustlineProps) {
  return (
    <button
      onClick={() => alert("Manage Trustline functionality coming soon!")}
      className="w-full h-8 bg-pink-500 text-white rounded-md text-sm flex items-center justify-center space-x-2"
    >
      <FaPencil className="w-4 h-4" />
      <span>Manage Trustline</span>
    </button>
  );
}
