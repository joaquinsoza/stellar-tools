import { useSorobanReact } from "@soroban-react/core";
import { ConnectWalletButton } from "../Buttons/ConnectWalletButton";

export const ConnectWalletToUse = () => {
  const { address } = useSorobanReact();
  return (
    <div
      className={`${address ? 'hidden' : ''} absolute inset-0 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl p-6`}
    >
      <div className="bg-white rounded-2xl text-center p-4">
        <div className="flex flex-col space-y-2">
          <ConnectWalletButton />
        </div>
      </div>
    </div>
  );
};
