"use client";
import Image from "next/image";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-xl flex flex-col items-center text-center space-y-3">
      <Image
        alt={title}
        src={icon}
        width={40}
        height={40}
        className="text-pink-500"
      />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

const FeaturesComponent = () => {
  const features = [
    {
      icon: "/stellartools.svg",
      title: "Assets",
      description: "View asset details, including contract and issuer data.",
    },
    {
      icon: "/stellartools.svg",
      title: "Balances",
      description: "Manage your portfolio, track your asset performance.",
    },
    {
      icon: "/stellartools.svg",
      title: "Transactions",
      description: "Review your Stellar and Soroban transaction history.",
    },
  ];

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-3xl text-center">
          A Suite of Tools for Stellar
        </h2>
        <p className="text-base text-center">
          Discover a versatile toolkit for the Stellar/Soroban ecosystem,
          designed to streamline asset creation, account management, and more.
          Embrace the simplicity of blockchain technology, made accessible for
          everyone.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 mt-10">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesComponent;
