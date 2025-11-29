import { FC } from "react";

type AssetInfoProps = {
  title: string;
  content: string | number;
  icon: string;
};

export const InfoCard: FC<AssetInfoProps> = ({
  title = "-",
  content = "-",
  icon,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg max-w-sm p-4">
      <div className="mb-4">
        <img src={icon} alt={`${icon} icon`} width={40} height={40} />
      </div>
      <div>
        <h3 className="font-normal text-gray-500 dark:text-gray-400 text-base mb-5 tracking-wide">
          {title ? title.toUpperCase() : ""}
        </h3>
        <p className="text-gray-700 dark:text-gray-200 text-2xl font-bold">
          {typeof content === "number" ? content : content?.toUpperCase()}
        </p>
      </div>
    </div>
  );
};
