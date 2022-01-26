import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Bool "mo:base/Bool";
import Char "mo:base/Char";
import Debug "mo:base/Debug";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import None "mo:base/None";
import Principal "mo:base/Principal";
import Random "mo:base/Random";
import Text "mo:base/Text";

import AsyncSource "mo:uuid/async/SourceV4";
import Hex "mo:encoding/Hex";
import JSON "mo:json/JSON";
import SHA256 "mo:crypto/SHA/SHA256";
import Source "mo:uuid/Source";
import UUID "mo:uuid/UUID";
import XorShift "mo:rand/XorShift";

import CONV "../common/conv/type-conversion";
import F "../db-files/files-storage";
import FUID "../common/uuid/FUID";
import GUID "../common/uuid/GUID";
import H "../util/helpers";
import S "../db-structure/tables-storage";
import SN "../db-structure/tables-storage";
import T "../db-structure/tree";
import TN "../db-structure/tree";
import Types "../db-structure/types";
import UUID "../common/uuid/UUID";
shared({caller = owner}) actor class mytest() = this {
    let STR = SN.TablesStorage();

    type UUID = UUID.UUID;
    type GUID = GUID.GUID;
    type FUID = FUID.FUID;

    public func test(): async ?None{
        let h = HashMap.HashMap<Text, JSON.JSON>(3, Text.equal, Text.hash);
        return null;
    };
};
