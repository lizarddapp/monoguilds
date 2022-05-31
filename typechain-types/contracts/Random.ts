/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export interface RandomInterface extends utils.Interface {
  functions: {
    "paused()": FunctionFragment;
    "setup(uint256)": FunctionFragment;
    "vrf()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "paused" | "setup" | "vrf"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(functionFragment: "setup", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "vrf", values?: undefined): string;

  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setup", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "vrf", data: BytesLike): Result;

  events: {
    "Paused(address)": EventFragment;
    "Unpaused(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
}

export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface Random extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RandomInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    paused(overrides?: CallOverrides): Promise<[boolean]>;

    setup(
      _randomSeed: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    vrf(overrides?: CallOverrides): Promise<[string] & { result: string }>;
  };

  paused(overrides?: CallOverrides): Promise<boolean>;

  setup(
    _randomSeed: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  vrf(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    paused(overrides?: CallOverrides): Promise<boolean>;

    setup(_randomSeed: BigNumberish, overrides?: CallOverrides): Promise<void>;

    vrf(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;
  };

  estimateGas: {
    paused(overrides?: CallOverrides): Promise<BigNumber>;

    setup(
      _randomSeed: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    vrf(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setup(
      _randomSeed: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    vrf(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
