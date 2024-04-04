"use client";
import { Asset } from "@stellar/stellar-sdk";
import { useState } from "react";

const AssetForm = () => {
  const [code, setCode] = useState("");
  const [issuer, setIssuer] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const network_passphrase = "Public Global Stellar Network ; September 2015";

  const getContractAddress = async (e: any) => {
    e.preventDefault();

    const asset = new Asset(code, issuer);
    const contract = asset.contractId(network_passphrase);
    setContractAddress(contract);
  };

  return (
    <div className="p-8 bg-black rounded-lg shadow-lg max-w-sm mx-auto">
      <form className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="code"
            className="block text-lg font-medium text-white"
          >
            Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 text-white border-transparent focus:border-indigo-500 focus:bg-gray-600 focus:ring-0"
            placeholder="Enter code"
          />
        </div>
        <div>
          <label
            htmlFor="issuer"
            className="block text-lg font-medium text-white"
          >
            Issuer
          </label>
          <input
            type="text"
            id="issuer"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 text-white border-transparent focus:border-indigo-500 focus:bg-gray-600 focus:ring-0"
            placeholder="Enter issuer"
          />
        </div>
        <button
          onClick={getContractAddress}
          type="submit"
          className="mt-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none rounded-lg "
        >
          Get Contract Address
        </button>
      </form>
      {contractAddress && (
        <div className="mt-4 p-4 bg-gray-800 rounded-md">
          <label className="block text-lg font-medium text-white">
            Contract Address:
          </label>
          <span className="text-sm text-gray-300 break-all">
            {contractAddress}
          </span>
        </div>
      )}
    </div>
  );
};

export default AssetForm;
