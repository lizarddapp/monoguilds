/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../common";

export interface IProfileInterface extends utils.Interface {
  functions: {
    "profileExist(address)": FunctionFragment;
    "profileId(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "profileExist" | "profileId"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "profileExist",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "profileId", values: [string]): string;

  decodeFunctionResult(
    functionFragment: "profileExist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "profileId", data: BytesLike): Result;

  events: {};
}

export interface IProfile extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IProfileInterface;

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
    profileExist(_addr: string, overrides?: CallOverrides): Promise<[boolean]>;

    profileId(_addr: string, overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  profileExist(_addr: string, overrides?: CallOverrides): Promise<boolean>;

  profileId(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    profileExist(_addr: string, overrides?: CallOverrides): Promise<boolean>;

    profileId(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    profileExist(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    profileId(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    profileExist(
      _addr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    profileId(
      _addr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
