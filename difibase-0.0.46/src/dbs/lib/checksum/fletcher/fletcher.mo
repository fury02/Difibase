import Array "mo:base/Array";
import Blob  "mo:base/Blob";
import Nat  "mo:base/Nat";
import Nat8  "mo:base/Nat8";
import Nat16  "mo:base/Nat16";
import Nat32  "mo:base/Nat32";
import Nat64  "mo:base/Nat64";
import Text  "mo:base/Text";
 
import Debug "mo:base/Debug";

module {

    public func fletcher8(blob: Blob): async Nat8{      
        var sum : Nat = 0;
        var sum2 : Nat = 0;
        var bytes: [Nat8] = Blob.toArray(blob);
        for(i in bytes.vals()){
            sum +=  sum + Nat8.toNat(i);
            sum2 +=  sum2 + sum;
        };
        var _sum2 = Nat8.fromNat(sum2);
        var _sum = Nat8.fromNat(sum);

        return (_sum2 << 8) | _sum;        
    };

    //optimized
    public func fletcher16(blob: Blob) : async Nat16{
        var s : Nat = 0xff;
        var s2 : Nat = 0xff;
        var size = blob.size();
        var bytes: [Nat8] = Blob.toArray(blob);
        var i = 0;
        while(size > 0){ 
            var len = 
                if(size > 20){20}
                else{size};   
            size := size - len;
            while(len > 0){
                var byte = bytes[i];
                s += Nat8.toNat(byte);
                s2 += s;
                len := len - 1;
                i := i + 1;
            };

            var sum = Nat16.fromNat(s);
            s += Nat16.toNat((sum & 0xff) + sum >> 8);
            var sum2 = Nat16.fromNat(s2);
            s2 += Nat16.toNat((sum2 & 0xff) + sum2 >> 8);
        };

        var sum = Nat16.fromNat(s);
        s += Nat16.toNat((sum & 0xff) + sum >> 8);
        var sum2 = Nat16.fromNat(s2);
        s2 += Nat16.toNat((sum2 & 0xff) + sum2 >> 8);

        return (sum2 << 8) | sum;
    };

    //optimized
     public func fletcher32(blob: Blob) : async Nat32{
        var s : Nat = 0xff;
        var s2 : Nat = 0xff;
        var size = blob.size();
        var bytes: [Nat8] = Blob.toArray(blob);
        var i = 0;
        while(size > 0){ 
            var len = 
                if(size > 20){20}
                else{size};   
            size := size - len;
            while(len > 0){
                var byte = bytes[i];
                s += Nat8.toNat(byte);
                s2 += s;
                len := len - 1;
                i := i + 1;
            };

            var sum = Nat32.fromNat(s);
            s += Nat32.toNat((sum & 0xff) + sum >> 8);
            var sum2 = Nat32.fromNat(s2);
            s2 += Nat32.toNat((sum2 & 0xff) + sum2 >> 8);
        };

        var sum = Nat32.fromNat(s);
        s += Nat32.toNat((sum & 0xff) + sum >> 8);
        var sum2 = Nat32.fromNat(s2);
        s2 += Nat32.toNat((sum2 & 0xff) + sum2 >> 8);

        return (sum2 << 8) | sum;
    };
    
    //optimized
     public func fletcher64(blob: Blob) : async Nat64{
        var s : Nat = 0xff;
        var s2 : Nat = 0xff;
        var size = blob.size();
        var bytes: [Nat8] = Blob.toArray(blob);
        var i = 0;
        while(size > 0){ 
            var len = 
                if(size > 20){20}
                else{size};   
            size := size - len;
            while(len > 0){
                var byte = bytes[i];
                s += Nat8.toNat(byte);
                s2 += s;
                len := len - 1;
                i := i + 1;
            };
            var sum = Nat64.fromNat(s);
            s += Nat64.toNat((sum & 0xff) + sum >> 8);
            var sum2 = Nat64.fromNat(s2);
            s2 += Nat64.toNat((sum2 & 0xff) + sum2 >> 8);
        };

        var sum = Nat64.fromNat(s);
        s += Nat64.toNat((sum & 0xff) + sum >> 8);
        var sum2 = Nat64.fromNat(s2);
        s2 += Nat64.toNat((sum2 & 0xff) + sum2 >> 8);

        return (sum2 << 8) | sum;
    };
};