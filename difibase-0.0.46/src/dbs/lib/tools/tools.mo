/**
 * Module     : Tools.mo v 1.0
 * Author     : Modified by Difibase (https://github.com/fury02)
 * Stability  : Experimental
 * Description: Convert subaccount to principal; Convert principal to accoundId.
 * Refers     : https://github.com/stephenandrews/motoko-accountid
 *              https://github.com/flyq/ic_codec
 *              https://github.com/iclighthouse/Cycles.Finance
 */
 
import Prim "mo:⛔";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Char "mo:base/Char";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Blob "mo:base/Blob";
import Iter "mo:base/Iter";
import P "mo:base/Prelude";
import Nat16 "mo:base/Nat16";
import Nat64 "mo:base/Nat64";
import Buffer    "mo:base/Buffer";

import CryptoUtilities "mo:crypto/Utilities";
import SHA256 "mo:crypto/SHA/SHA256";
import SHA224 "../checksum/sha/sha224";
import SHA2 "mo:crypto/SHA/SHA2";
import CRC32 "../checksum/crc/crc32";

import BASE32 "base32";
import BASE64 "mo:encoding/Base64";
import Binary "mo:encoding/Binary";
import Hex "mo:encoding/Hex";

import Debug "mo:base/Debug";

//for test
import Time "mo:base/Time";
import Int "mo:base/Int";

import Types "../../types";

module {
    private let ads : [Nat8] = [10, 97, 99, 99, 111, 117, 110, 116, 45, 105, 100]; //default
    private let sa_zero : [Nat8] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    public func slice<T>(a: [T], from: Nat, to: ?Nat): [T]{
        let len = a.size();
        if (len == 0) { return []; };
        var to_: Nat = Option.get(to, Nat.sub(len, 1));
        if (len <= to_){ to_ := len - 1; };
        var na: [T] = [];
        var i: Nat = from;
        while ( i <= to_ ){
            na := Array.append(na, Array.make(a[i]));
            i += 1;
        };
        return na;
    };
    // principalArr to principalText
    public func principalArrToText(pa: [Nat8]) : Text{
        var res: [Nat8] = [];
        res := Array.append(res, CRC32.crc32(pa));
        res := Array.append(res, pa);
        let s = BASE32.encode(#RFC4648 {padding=false}, res);
        let lowercase_s = Text.map(s , Prim.charToLower);
        let len = lowercase_s.size();
        let s_slice = Iter.toArray(Text.toIter(lowercase_s));
        var ret = "";
        var i:Nat = 1;
        for (v in s_slice.vals()){
            ret := ret # Char.toText(v);
            if (i % 5 == 0 and i != len){
                ret := ret # "-";
            };
            i += 1;
        };
        return ret;
    };
    // principalBlob to principal
    public func principalBlobToPrincipal(pb: Blob) : Principal{
        let pa = Blob.toArray(pb);
        let text = principalArrToText(pa);
        return Principal.fromText(text);
    };
    // Generate SubAccount  
    public func getSubAccount(p: Principal, subIndex: Nat64) : [Nat8]{
        let pa = Blob.toArray(Principal.toBlob(p));
        return subAccount(pa, subIndex: Nat64);
    };
    public func subAccount(pa: [Nat8], val: Nat64) : [Nat8]{
        let len = pa.size();
        var res = Array.append([Nat8.fromNat(len)], pa);
        let subLength = Nat.sub(31, len);
        assert(subLength >= 2);
        var suba = Array.init<Nat8>(subLength, 0);
        if (subLength < 8){
            let suba16 = Binary.BigEndian.fromNat16(Nat16.fromNat(Nat64.toNat(val)));
            for (k in suba.keys()){
                if (k >= Nat.sub(subLength, suba16.size())){
                    suba[k] := suba16[k - Nat.sub(subLength, suba16.size())];
                }else{
                    suba[k] := 0;
                };
            };
        } else{
            let suba64 = Binary.BigEndian.fromNat64(val);
            for (k in suba.keys()){
                if (k >= Nat.sub(subLength, suba64.size())){
                    suba[k] := suba64[k - Nat.sub(subLength, suba64.size())];
                }else{
                    suba[k] := 0;
                };
            };
        };
        res := Array.append(res, Array.freeze(suba));
        assert(res.size() == 32);
        return res;
    };
    //Convert subaccount to principal
    public func subToPrincipal(a: [Nat8]) : Principal {
        let length : Nat = Nat.min(Nat8.toNat(a[0]), a.size()-1);
        var bytes : [var Nat8] = Array.init<Nat8>(length, 0);
        for (i in Iter.range(1, length)) {
            bytes[i-1] := a[i];
        };
        return Principal.fromText(principalArrToText(Array.freeze(bytes)));
    };
    //Convert subaccount to text principal
    public func subToPrincipalText(a: [Nat8]) : Text {
        let length : Nat = Nat.min(Nat8.toNat(a[0]), a.size()-1);
        var bytes : [var Nat8] = Array.init<Nat8>(length, 0);
        for (i in Iter.range(1, length)) {
            bytes[i-1] := a[i];
        };
        return principalArrToText(Array.freeze(bytes));
    };
    public func subHexToPrincipal(h: Hex.Hex) : Principal {
        switch(Hex.decode(h)){
            case (#ok(a)) subToPrincipal(a);
            case (#err(e)) P.unreachable();
        }
    };
    public func principalTextToAccount(t : Text, sa : ?[Nat8]) : [Nat8] {
        return principalToAccount(Principal.fromText(t), sa);
    };
    public func principalToAccount(p : Principal, sa : ?[Nat8]) : [Nat8] {
        return principalBlobToAccount(Principal.toBlob(p), sa);
    };
    public func principalBlobToAccount(b : Blob, sa : ?[Nat8]) : [Nat8] { //Blob & [Nat8]
        return generate(Blob.toArray(b), sa);
    };
    private func generate(data : [Nat8], sa : ?[Nat8]) : [Nat8] {
        var _sa : [Nat8] = sa_zero;
        if (Option.isSome(sa)) {
            _sa := Option.get(sa, _sa);
            while (_sa.size() < 32){
                _sa := Array.append([0:Nat8], _sa);
            };
        };
        var hash : [Nat8] = SHA224.sha224(Array.append(Array.append(ads, data), _sa));
        var crc : [Nat8] = CRC32.crc32(hash);
        return Array.append(crc, hash);                     
    };
    // To Account Blob
    public func principalTextToAccountBlob(t : Text, sa : ?[Nat8]) : Blob {
        return Blob.fromArray(principalTextToAccount(t, sa));
    };
    public func principalToAccountBlob(p : Principal, sa : ?[Nat8]) : Blob {
        return Blob.fromArray(principalToAccount(p, sa));
    };
    public func principalBlobToAccountBlob(b : Blob, sa : ?[Nat8]) : Blob {
        return Blob.fromArray(principalBlobToAccount(b, sa));
    };
    // To Account Hex
    public func principalTextToAccountHex(t : Text, sa : ?[Nat8]) : Hex.Hex {
        return Hex.encode(principalTextToAccount(t, sa));
    };
    public func principalToAccountHex(p : Principal, sa : ?[Nat8]) : Hex.Hex {
        return Hex.encode(principalToAccount(p, sa));
    };
    public func principalBlobToAccountHex(b : Blob, sa : ?[Nat8]) : Hex.Hex {
        return Hex.encode(principalBlobToAccount(b, sa));
    };
    // Account Hex to Account blob
    public func accountHexToAccountBlob(h: Hex.Hex) : ?Blob {
        let a = Hex.decode(h);
        switch (a){
            case (#ok(account:[Nat8])){
                if (isValidAccount(account)){
                    return ?(Blob.fromArray(account));
                } else { 
                    return null; 
                };
            };
            case(#err(_)){
                return null;
            }
        };
    };

    // principalBlobToPrincipal
    public func isValidAccount(account: [Nat8]): Bool{
        if (account.size() == 32){
            let checksum = slice(account, 0, ?3);
            let hash = slice(account, 4, ?31);
            if (Array.equal(CRC32.crc32(hash), checksum, Nat8.equal)){
                return true;
            };
        };
        return false;
    };






    // 32-byte array.
    type AccountIdentifier = Types.AccountIdentifier;
    // 32-byte array.
    type Subaccount = Types.SubAccount;
    func beBytes(n: Nat32) : [Nat8] {
        func byte(n: Nat32) : Nat8 {
        Nat8.fromNat(Nat32.toNat(n & 0xff))
        };
        [byte(n >> 24), byte(n >> 16), byte(n >> 8), byte(n)]
    };
    public func defaultSubaccount() : Subaccount {
        Array.freeze<Nat8>(Array.init(32, 0 : Nat8)); 
    };
    public func accountIdentifier(principal: Principal, subaccount: Subaccount) : AccountIdentifier {
        let hash = SHA224.Digest();
        hash.write([0x0A]);
        hash.write(Blob.toArray(Text.encodeUtf8("account-id")));
        hash.write(Blob.toArray(Principal.toBlob(principal)));
        hash.write(subaccount);
        let hashSum = hash.sum();
        let crc32Bytes = beBytes(CRC32.ofArray(hashSum));
        let arr: [Nat8] = Array.append(crc32Bytes, hashSum);
        return arr ;
    };
    public func validateAccountIdentifier(accountIdentifier : AccountIdentifier) : Bool {
        if (accountIdentifier.size() != 32) {
        return false;
        };
        let a = accountIdentifier;
        let accIdPart    = Array.tabulate(28, func(i: Nat): Nat8 { a[i + 4] });
        let checksumPart = Array.tabulate(4,  func(i: Nat): Nat8 { a[i] });
        let crc32 = CRC32.ofArray(accIdPart);
        Array.equal(beBytes(crc32), checksumPart, Nat8.equal)
    };
    //SubAccount for(Principal) coinage cycles
    public func principalToSubAccount(id: Principal) : [Nat8] {
        let p = Blob.toArray(Principal.toBlob(id));
        Array.tabulate(32, func(i : Nat) : Nat8 {
            if (i >= p.size() + 1) 0
            else if (i == 0) (Nat8.fromNat(p.size()))
            else (p[i - 1])
        })
    };
     //SubAccount for(Text principal) coinage cycles
    public func principalTextToSubAccount(id: Text) : [Nat8] {
        let p = Blob.toArray(Principal.toBlob(Principal.fromText(id)));
        Array.tabulate(32, func(i : Nat) : Nat8 {
            if (i >= p.size() + 1) 0
            else if (i == 0) (Nat8.fromNat(p.size()))
            else (p[i - 1])
        })
    };
};