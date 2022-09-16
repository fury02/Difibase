import {FileError} from "react-dropzone";
import {TypeHashValue} from "../types/types-enum";
import {string} from "yup";
import {Principal} from "@dfinity/principal";
import {CurrentStatusCluster, CurrentStatusInstance} from "../../idls/admin/interface/admin.did";

export interface Balance {
    value: string;
    decimals: number;
}

export interface UploadProgress {
    percent: number;
    step: number;
}

export interface UploadErrorProps {
    file: File;
    onDelete: (file: File) => void;
    errors: FileError[];
}

export interface SingleFileUploadWithProgressProps {
    file: File;
    onDelete: (file: File) => void;
    loadProgress: number
}

export interface FileHeaderProps {
    file: File;
    onDelete: (file: File) => void;
}
export interface UploadableFile {
    id: number;
    file: File;
    errors: FileError[];
    url?: string;
}

export interface AlertProgressInstalling {
    isShow: boolean;
}

export interface WasmDescription {
    version: number;
    description: string;
}

export interface CountedHash {
    text_value: String;
    array_value: Uint8Array;
}

export interface CombinedWasmInfo{
    name: String;
    description: String;
    version:  BigInt;
    uuid: number[];
    guid: String;
    updated: boolean;
    value_hash: number[];
    text_hash: String;
    type_hash: TypeHashValue;
}

export interface SelectedClusterValues {
    name: string;
    canister_id: string;
    principal: Principal;
};

export interface SelectedClusterInstanceValues extends SelectedClusterValues {
    wasm_version: string;
    wasm_name: string;
    key: number;
    // description: string;
};

export interface Canister {
    'value_hash' : [] | [string],
    'name' : string,
    'canister_id' : Principal,
    'wasm' : [] | [Array<number>],
    'description' : string,
    'wasm_hash' : [] | [Array<number>],
}

export interface UserIdentity {
    'user_principal' : Principal,
    'instance_id' : string,
    'consecutive_number' : bigint,
}

export interface UserInstance {
    'value_hash' : [] | [string],
    'user_principal' : Principal,
    'instance_id' : string,
    'canister_id' : Principal,
    'consecutive_number' : bigint,
}

export interface Cluster {
    name: string;
    canister_id: string;
    cluster_principal : Principal; //ClusterIdentifier (canister_id)
    user_principal : Principal;
    wasm_name: string;
    wasm_version: number;
    status: CurrentStatusCluster;
    description : string;
};

export interface Instance {
    number_key: number;
    instance_principal : Principal; //(canister_id)
    wasm_name: string;
    wasm_version: number;
    status : CurrentStatusInstance;
    description : string;
};

//CMC
export interface IcpXdrConversionRate {
    xdr_permyriad_per_icp: bigint;
    timestamp_seconds: bigint;
}
export interface IcpXdrConversionRateCertifiedResponse {
    certificate: Array<number>;
    data: IcpXdrConversionRate;
    hash_tree: Array<number>;
}

export interface CyclesMarketConversionInfo{
    cycles_conversion_info: string;
    cycles_amount: BigInt;
    cycles_value: string;
}

export interface CountedSha256 extends CountedHash{}
export interface CountedSha224 extends CountedHash{}
export interface CountedSha384 extends CountedHash{}
export interface CountedSha512 extends CountedHash{}
export interface CountedKessak extends CountedHash{}