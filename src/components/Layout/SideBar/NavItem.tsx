import { useUserContext } from "@/contexts/UserContext";
import { SidebarContext } from "@/context/sidebar/SidebarContext";
import Link from "next/link";
import { useContext } from "react";
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
  const { address } = useUserContext();
  const { isOpen } = useContext(SidebarContext);
  const isDisabled = requiresWallet && !address;

  const content = (
    <div
      className={`
        group flex items-center rounded-lg cursor-pointer p-4 mx-2
        ${isDisabled
          ? 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500'
          : 'text-gray-700 dark:text-gray-200 hover:bg-pink-400 hover:text-white'
        }
      `}
      title={isDisabled ? "Wallet connection required" : ""}
      onClick={onClick}
    >
      <div className="w-6 flex-shrink-0 flex items-center justify-center">
        <Icon
          className={`
            text-2xl
            ${isDisabled
              ? 'group-hover:text-gray-500'
              : 'group-hover:text-white'
            }
          `}
        />
      </div>
      <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? 'ml-4 opacity-100' : 'w-0 ml-0 opacity-0'}`}>
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
