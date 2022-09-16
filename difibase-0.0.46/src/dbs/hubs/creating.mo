import Array "mo:base/Array";
import List "mo:base/List";
import Blob  "mo:base/Blob";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Nat  "mo:base/Nat";
import Nat8  "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Prim "mo:⛔";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";
import TrieSet "mo:base/TrieSet";
import Debug "mo:base/Debug";

import Helpers "../lib/util/helpers";
import UserIdentifiers "identifiers";
import Types "../types";
import Interfaces "../interfaces";
import Const "../const";
import Financing "../financing";
import Tools "../lib/tools/tools";

// import Identifiers "identifiers";
// import IdentifiersChunk "identifiers-chunk";

import CryptoUtilities "mo:crypto/Utilities";
import SHA256 "mo:crypto/SHA/SHA256";
import SHA224 "mo:crypto/SHA/SHA224";
import SHA2 "mo:crypto/SHA/SHA2";
import Hex "mo:encoding/Hex";
import Base32 "mo:encoding/Base32";

shared({caller = owner}) actor class Creating(benefit : shared () -> async ()) = thisCreating{
    private let cyclesCapacity: Nat = 10_000_000_000_000;
    var cyclesSavings: Nat = 0;
    public func deposit() : async() {
      let amount = ExperimentalCycles.available();
      let limit : Nat = cyclesCapacity - cyclesSavings;
      let acceptable =
          if (amount <= limit) amount
          else limit;     
      let accepted = ExperimentalCycles.accept(acceptable);
      assert (accepted == acceptable);
      cyclesSavings += acceptable;
    };
    public shared(msg) func withdraw(amount : Nat) : async () {
      assert (msg.caller == owner);
      assert (amount <= cyclesSavings);
      ExperimentalCycles.add(amount);
      await benefit();
      let refund = ExperimentalCycles.refunded();
      cyclesSavings -= amount - refund;
    };
};