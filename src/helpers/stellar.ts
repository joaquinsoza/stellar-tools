import { BURNER_ACCOUNT, stellarRouterContracts } from "@/common/constans";
import {
  Account,
  Address,
  Asset,
  BASE_FEE,
  Contract,
  hash,
  Horizon,
  Memo,
  MemoType,
  Networks,
  Operation,
  rpc,
  scValToNative,
  SorobanDataBuilder,
  StrKey,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";

const server = new rpc.Server(process.env.NEXT_PUBLIC_SOROBAN_RPC_URL!);
const serverHorizon = new Horizon.Server(
  process.env.NEXT_PUBLIC_HORIZON_RPC_URL!
);

export interface Invocation {
  contract: Address;
  method: string;
  args: xdr.ScVal[];
}

/**
 * Simulates a call to a Soroban contract
 * @param contractId Contract ID
 * @param method Method to call
 * @param params Parameters for the call
 * @param network Network to use for the call (defaults to MAINNET)
 * @returns Simulation response
 */
export const simulateContractCall = async (
  networkPassphrase: Networks = Networks.PUBLIC,
  contractId: string,
  method: string,
  params: xdr.ScVal[]
) => {
  const contract = new Contract(contractId);
  let operation = contract.call(method, ...params);

  const sourceAccount = BURNER_ACCOUNT;
  const account = new Account(sourceAccount, "0");

  const txBuilder = new TransactionBuilder(account, {
    fee: BASE_FEE,
    timebounds: { minTime: 0, maxTime: 0 },
    networkPassphrase,
  });

  txBuilder.addOperation(operation);
  const tx = txBuilder.build();

  try {
    // Usar el servidor correcto según la red
    const simulationResponse = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationError(simulationResponse)) {
      console.log(
        `Simulation Error for ${contractId}.${method}: ${simulationResponse.error}`
      );
      throw new Error(
        `Error simulating transaction: ${simulationResponse.error}`
      );
    } else if (simulationResponse.result === undefined) {
      console.log(
        `Simulation for ${contractId}.${method} succeeded but returned no result.`
      );
      throw new Error(
        `Simulation for ${contractId}.${method} succeeded but returned no result.`
      );
    } else {
      return simulationResponse;
    }
  } catch (error: any) {
    if (error.message && error.message.includes("MissingValue")) {
      console.log(
        `Contract not found or missing value: ${contractId}.${method}`
      );
    } else {
      console.log(
        `Network or RPC error during simulation for ${contractId}.${method}: ${error.message}`
      );
    }
    throw error;
  }
};

const handleContractSimulationError = (error: string) => {
  console.log(
    "🚀 | StellarService | handleContractSimulationError | error:",
    error
  );
  // const match = error.match(/Error\(Contract, #([0-9]+)\)/)
  // console.log("🚀 | handleContractSimulationError | match:", match)
  // if (match) {
  //   const code = parseInt(match[1], 10)
  //   const errorName = getErrorNameByCode(code)
  //   if (code === 13) {
  //     const matchAddress = match.input.match(/data:\["trustline entry is missing for account", ([A-Z0-9]{56})\]/); // 56 is the length of stellar addresses
  //     console.log("🚀 | handleContractSimulationError | matchAddress:", matchAddress)
  //     if (matchAddress && matchAddress[1]) {
  //       const missingAccount = matchAddress[1];
  //       throw new ContractSimulationException(
  //         errorName,
  //         code,
  //         'Missing Trustline for account: ' + missingAccount,
  //         {missingAccount}
  //       )
  //     }
  //   }
  //   throw new ContractSimulationException(errorName, code)
  // }
};

const createTransaction = async (
  networkPassphrase: Networks,
  operation: string | xdr.Operation,
  source: string
): Promise<Transaction<Memo<MemoType>, Operation[]>> => {
  const account = await server.getAccount(source);

  const txBuilder = new TransactionBuilder(account, {
    fee: "201",
    networkPassphrase,
  });

  if (typeof operation === "string") {
    operation = xdr.Operation.fromXDR(operation, "base64");
  }

  txBuilder.addOperation(operation);
  const tx = txBuilder.build();

  const simulationResponse = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationError(simulationResponse)) {
    handleContractSimulationError(simulationResponse.error);
  }

  const assembledTransaction = rpc.assembleTransaction(tx, simulationResponse);
  const prepped_tx = assembledTransaction.setTimeout(300).build();

  return prepped_tx;
};

const executeMultipleInvocations = async (
  networkPassphrase: Networks,
  from: string,
  invocations: Invocation[]
): Promise<Transaction<Memo<MemoType>, Operation[]>> => {
  const stellarRouterContract = new Contract(
    stellarRouterContracts(networkPassphrase)!
  );

  const operations = stellarRouterContract.call(
    "exec",
    new Address(from).toScVal(),
    xdr.ScVal.scvVec(
      invocations.map((invocation) =>
        xdr.ScVal.scvVec([
          new Address(invocation.contract.toString()).toScVal(),
          xdr.ScVal.scvSymbol(invocation.method),
          xdr.ScVal.scvVec(invocation.args),
        ])
      )
    )
  );

  const transaction = await createTransaction(
    networkPassphrase,
    operations,
    from
  );
  return sendSorobanTransaction(transaction);
};

const simulateMultipleInvocations = async (
  networkPassphrase: Networks,
  from: string,
  invocations: Invocation[]
) => {
  return simulateContractCall(
    networkPassphrase,
    stellarRouterContracts(networkPassphrase)!,
    "exec",
    [
      new Address(from).toScVal(),
      xdr.ScVal.scvVec(
        invocations.map((invocation) =>
          xdr.ScVal.scvVec([
            new Address(invocation.contract.toString()).toScVal(),
            xdr.ScVal.scvSymbol(invocation.method),
            xdr.ScVal.scvVec(invocation.args),
          ])
        )
      ),
    ]
  );
};

const sendHorizonTransaction = async (
  networkPassphrase: Networks,
  xdr: string
) => {
  const transaction = new Transaction(xdr, networkPassphrase);

  const tx_hash = transaction.hash().toString("hex");
  console.log("🚀 | performSwap | tx_hash:", tx_hash);

  const response = await serverHorizon.submitTransaction(transaction);
  console.log("🚀 | performSwap | response:", response);

  return response;
};

const sendSorobanTransaction = async (transaction: Transaction) => {
  const tx_hash = transaction.hash().toString("hex");

  const response = await server.sendTransaction(transaction);
  console.log(
    "🚀 | StellarService | sendSorobanTransaction | response:",
    response
  );
  const status = response.status;
  console.log("🚀 | sendSorobanTransaction | status:", status);

  let txResponse: any;
  while (status === "PENDING") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("waiting for tx...");
    txResponse = await server.getTransaction(tx_hash);
    console.log("🚀 | performSwap | txResponse:", txResponse);

    if (txResponse.status === "SUCCESS") {
      console.log("Transaction successful");
      break;
    }
    if (txResponse.status === "FAILED") {
      const status = txResponse.status;

      // const resultMetaXdr = xdr.TransactionMetaV3.fromXDR(txResponse.resultMetaXdr.toXDR("base64"))
      // console.log("🛑 Diagnostic Events", (resultMetaXdr.sorobanMeta as any).diagnostic_events)
      let detail = "unknown";

      try {
        const resultXdr = xdr.TransactionResult.fromXDR(
          txResponse.resultXdr.toXDR()
        );
        detail = JSON.parse(
          JSON.stringify(
            JSON.parse(JSON.stringify(resultXdr.result().value()))[0]._value
          )
        )._value._switch.name;
      } catch (error) {
        console.log("🛑 Error stellarService Line #1697", error);
      }

      const extras = {
        envelopeXdr: txResponse.envelopeXdr.toXDR("base64"),
        resultXdr: txResponse.resultXdr.toXDR("base64"),
        resultMetaXdr: txResponse.resultMetaXdr.toXDR("base64"),
        returnValue: txResponse.returnValue.toXDR("base64"),
      };
      // title: string, detail: string, extra: Record<string, any>, error = 'Transaction Failed') {
      throw new Error("Error sending transaction");
      // throw new TransactionFailedException(status, detail, extras)
    }
  }
  return txResponse;
};

const createTrustlineTransactionXDR = async (
  networkPassphrase: Networks,
  from: string,
  assetCode: string,
  assetIssuer: string
) => {
  const fromAccount = await serverHorizon.loadAccount(from);

  const stellarAsset = new Asset(assetCode, assetIssuer);

  const transaction = new TransactionBuilder(fromAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  }).addOperation(
    Operation.changeTrust({
      asset: stellarAsset,
      source: from,
    })
  );

  return {
    xdr: transaction.setTimeout(300).build().toXDR(),
    assetCode,
    assetIssuer,
  };
};

const extractAssetInfo = async (
  networkPassphrase: Networks,
  from: string,
  asset: string
): Promise<{ assetCode: string; assetIssuer: string }> => {
  const isAssetFormat = asset.includes(":") || asset.includes("-");

  if (isAssetFormat) {
    const [assetCode, assetIssuer] = asset.split(/[:-]/);
    return { assetCode, assetIssuer };
  }

  const contractInfo = await getContractAssetInfo(
    networkPassphrase,
    from,
    asset
  );

  if (contractInfo.name.includes(":")) {
    const [nameCode, nameIssuer] = contractInfo.name.split(":");
    return { assetCode: nameCode, assetIssuer: nameIssuer };
  }

  return { assetCode: contractInfo.code, assetIssuer: contractInfo.issuer };
};

const getContractAssetInfo = async (
  networkPassphrase: Networks,
  from: string,
  contractAddress: string
): Promise<{
  name: string;
  code: string;
  issuer: string;
  decimals: number;
}> => {
  const invocations: Invocation[] = [
    {
      contract: new Address(contractAddress),
      method: "name",
      args: [],
    },
    {
      contract: new Address(contractAddress),
      method: "symbol",
      args: [],
    },
    {
      contract: new Address(contractAddress),
      method: "admin",
      args: [],
    },
    {
      contract: new Address(contractAddress),
      method: "decimals",
      args: [],
    },
  ];

  const simRaw = await simulateMultipleInvocations(
    networkPassphrase,
    from,
    invocations
  );
  const sim = scValToNative(simRaw?.result?.retval as xdr.ScVal);

  return {
    name: sim[0],
    code: sim[1],
    issuer: sim[2],
    decimals: sim[3],
  };
};

export const deployStellarAsset = async (
  networkPassphrase: Networks,
  asset: Asset,
  source: string
) => {
  const xdrAsset = asset.toXDRObject();
  const networkId = hash(Buffer.from(networkPassphrase));
  const preimage = xdr.HashIdPreimage.envelopeTypeContractId(
    new xdr.HashIdPreimageContractId({
      networkId: networkId,
      contractIdPreimage:
        xdr.ContractIdPreimage.contractIdPreimageFromAsset(xdrAsset),
    })
  );
  const contractId = StrKey.encodeContract(hash(preimage.toXDR()));
  console.log("🚀 « deployed Stellar Asset:", contractId);

  const deployFunction = xdr.HostFunction.hostFunctionTypeCreateContract(
    new xdr.CreateContractArgs({
      contractIdPreimage:
        xdr.ContractIdPreimage.contractIdPreimageFromAsset(xdrAsset),
      executable: xdr.ContractExecutable.contractExecutableStellarAsset(),
    })
  );

  const operation = Operation.invokeHostFunction({
    func: deployFunction,
    auth: [],
  });

  const transaction = await createTransaction(
    networkPassphrase,
    operation,
    source
  );

  return await sendSorobanTransaction(transaction);
};

export const bumpContractInstance = async (
  networkPassphrase: Networks,
  contractId: string,
  source: string
) => {
  const contract = Address.fromString(contractId);
  const account = await server.getAccount(source);
  console.log("bumping contract instance: ", contract.toString());
  const contractInstanceXDR = xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: contract.toScAddress(),
      key: xdr.ScVal.scvLedgerKeyContractInstance(),
      durability: xdr.ContractDataDurability.persistent(),
    })
  );
  const bumpTransactionData = new xdr.SorobanTransactionData({
    resources: new xdr.SorobanResources({
      footprint: new xdr.LedgerFootprint({
        readOnly: [contractInstanceXDR],
        readWrite: [],
      }),
      instructions: 0,
      diskReadBytes: 0,
      writeBytes: 0,
    }),
    resourceFee: xdr.Int64.fromString("0"),
    // @ts-ignore
    ext: new xdr.ExtensionPoint(0),
  });

  const txBuilder = new TransactionBuilder(
    account,
    {
      fee: BASE_FEE,
      networkPassphrase
    }
  ).addOperation(
    Operation.extendFootprintTtl({ extendTo: 3110400 - 1 })
  ).setSorobanData(bumpTransactionData).build()
  
  return sendSorobanTransaction(txBuilder);
};

export const restoreContract = async (
  networkPassphrase: Networks,
  contractId: string,
  source: string
) => {
  const contract = Address.fromString(contractId);
  const account = await server.getAccount(source);
  console.log("bumping contract instance: ", contract.toString());
  const contractInstanceXDR = xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: contract.toScAddress(),
      key: xdr.ScVal.scvLedgerKeyContractInstance(),
      durability: xdr.ContractDataDurability.persistent(),
    })
  );

  const txBuilder = new TransactionBuilder(
    account,
    {
      fee: BASE_FEE,
      networkPassphrase
    }
  ).addOperation(Operation.restoreFootprint({})).setSorobanData(
    new SorobanDataBuilder().setReadWrite([contractInstanceXDR]).build()
  );

  const tx = txBuilder.build();
  
  console.log("XDR:", tx.toXDR());
  return sendSorobanTransaction(tx)
};