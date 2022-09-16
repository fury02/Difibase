// @ts-ignore
import CryptoJS from 'crypto-js';
import {CountedSha224, CountedSha256, CountedSha384, CountedSha512} from "../../../../common/interfaces/interfaces";

var SHA512 = require("crypto-js/sha512");
var SHA384 = require("crypto-js/sha384");
var SHA256 = require("crypto-js/sha256");
var SHA224 = require("crypto-js/sha224");
var SHA1 = require("crypto-js/sha1");
var SHA3 = require("crypto-js/sha3");

export class Array_hash {
    public async sha256(array: Array<number>): Promise<CountedSha256>{
        var text_value: string;
        var array_value: Uint8Array;
        var result: CountedSha256

        let wa = CryptoJS.lib.WordArray.create(array);
        let calculated = CryptoJS.SHA256(wa);
        text_value = calculated.toString();
        let arr = Buffer.from(calculated.toString(CryptoJS.enc.Hex), 'hex');
        array_value  = new Uint8Array(arr);

        result = {text_value : text_value, array_value: array_value};

        return result;
    };

}
export default Array_hash;