import { FC } from "react";
import Image from "next/image";

type InfoCardProps = {
  title: string;
  content: string | number;
  icon: string;
};

export const InfoCard: FC<InfoCardProps> = ({
  title = "-",
  content = "-",
  icon,
}) => {
  const displayContent = content ?? "-";
  const formattedContent =
    typeof displayContent === "number"
      ? displayContent.toLocaleString()
      : displayContent;

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Image
          src={icon}
          alt={`${title} icon`}
          width={16}
          height={16}
          className="opacity-60"
        />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {title}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
        {formattedContent}
      </p>
    </div>
  );
};
