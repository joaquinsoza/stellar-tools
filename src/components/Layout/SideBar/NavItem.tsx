import { useSorobanReact } from "@soroban-react/core";
import Link from "next/link";
import { IconType } from "react-icons";

interface NavItemProps {
  icon: IconType;
  href: string;
  children: React.ReactNode;
  requiresWallet?: boolean;
  onClick?: () => void;
}

export const NavItem = ({
  icon: Icon,
  href,
  children,
  requiresWallet,
  onClick,
}: NavItemProps) => {
  const { address } = useSorobanReact();
  const isDisabled = requiresWallet && !address;

  const content = (
    <div
      className={`
        group flex items-center p-4 mx-4 rounded-lg cursor-pointer
        ${isDisabled 
          ? 'hover:bg-gray-200 hover:text-gray-500 text-gray-400' 
          : 'hover:bg-pink-400 hover:text-white'
        }
      `}
      title={isDisabled ? "Wallet connection required" : ""}
      onClick={onClick}
    >
      <Icon
        className={`
          mr-4 text-2xl
          ${isDisabled 
            ? 'group-hover:text-gray-500' 
            : 'group-hover:text-white'
          }
        `}
      />
      <span className="overflow-hidden whitespace-nowrap">
        {children}
      </span>
    </div>
  );

  if (isDisabled) {
    return content;
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  );
};
