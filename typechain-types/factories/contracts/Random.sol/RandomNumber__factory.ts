/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RandomNumber,
  RandomNumberInterface,
} from "../../../contracts/Random.sol/RandomNumber";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610258806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80635c975abb1461003b5780638129fc1c14610059575b600080fd5b610043610063565b604051610050919061017b565b60405180910390f35b61006161007a565b005b6000603360009054906101000a900460ff16905090565b610082610084565b565b600060019054906101000a900460ff166100d3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ca90610196565b60405180910390fd5b6100db6100dd565b565b600060019054906101000a900460ff1661012c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161012390610196565b60405180910390fd5b6000603360006101000a81548160ff021916908315150217905550565b610152816101c7565b82525050565b6000610165602b836101b6565b9150610170826101d3565b604082019050919050565b60006020820190506101906000830184610149565b92915050565b600060208201905081810360008301526101af81610158565b9050919050565b600082825260208201905092915050565b60008115159050919050565b7f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960008201527f6e697469616c697a696e6700000000000000000000000000000000000000000060208201525056fea2646970667358221220b60e92ba6a61e2db8623ef4094cfcd74a9cdab342866985ad0548feefce0081664736f6c63430008040033";

type RandomNumberConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RandomNumberConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RandomNumber__factory extends ContractFactory {
  constructor(...args: RandomNumberConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RandomNumber> {
    return super.deploy(overrides || {}) as Promise<RandomNumber>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): RandomNumber {
    return super.attach(address) as RandomNumber;
  }
  override connect(signer: Signer): RandomNumber__factory {
    return super.connect(signer) as RandomNumber__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RandomNumberInterface {
    return new utils.Interface(_abi) as RandomNumberInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RandomNumber {
    return new Contract(address, _abi, signerOrProvider) as RandomNumber;
  }
}
