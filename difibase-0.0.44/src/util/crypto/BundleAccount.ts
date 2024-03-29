import { Principal } from "@dfinity/principal";
// @ts-ignore
import CryptoJS from 'crypto-js';
import {crc32} from "crc";

const byteArrayToWordArray = (byteArray: Uint8Array) => {
    const wordArray = [] as any;
    let i;
    for (i = 0; i < byteArray.length; i += 1) {
        wordArray[(i / 4) | 0] |= byteArray[i] << (24 - 8 * i);
    }
    // eslint-disable-next-line
    const result = CryptoJS.lib.WordArray.create(
        wordArray,
        byteArray.length
    );
    return result;
};

// @ts-ignore
const wordToByteArray = (word, length): number[] => {
    const byteArray: number[] = [];
    const xFF = 0xff;
    if (length > 0) byteArray.push(word >>> 24);
    if (length > 1) byteArray.push((word >>> 16) & xFF);
    if (length > 2) byteArray.push((word >>> 8) & xFF);
    if (length > 3) byteArray.push(word & xFF);

    return byteArray;
};

const wordArrayToByteArray = (wordArray: any[], length: number) => {
    if (
        wordArray.hasOwnProperty('sigBytes') &&
        wordArray.hasOwnProperty('words')
    ) {
        // @ts-ignore
        length = wordArray.sigBytes;
        // @ts-ignore
        wordArray = wordArray.words;
    }

    let result: number[] = [];
    let bytes;
    let i = 0;
    while (length > 0) {
        bytes = wordToByteArray(wordArray[i], Math.min(4, length));
        length -= bytes.length;
        // @ts-ignore
        result = [...result, bytes];
        i++;
    }
    // @ts-ignore
    return [].concat.apply([], result);
};

const intToHex = (val: number) =>
    val < 0 ? (Number(val) >>> 0).toString(16) : Number(val).toString(16);

// // We generate a CRC32 checksum, and trnasform it into a hexString
const generateChecksum = (hash: Uint8Array) => {
    const crc = crc32.unsigned(Buffer.from(hash));
    const hex = intToHex(crc);
    return hex.padStart(8, '0');
};

const SUB_ACCOUNT_ZERO = Buffer.alloc(32);
const ACCOUNT_DOMAIN_SEPERATOR = '\x0Aaccount-id';

export const getAccountIdAddress = (principal: Principal, subAccount?: number ) => {
    const sha = CryptoJS.algo.SHA224.create();
    sha.update(ACCOUNT_DOMAIN_SEPERATOR); // Internally parsed with UTF-8, like go does
    sha.update(byteArrayToWordArray(principal.toUint8Array()));
    const subBuffer = Buffer.from(SUB_ACCOUNT_ZERO);
    if (subAccount) {
        subBuffer.writeUInt32BE(subAccount);
    }
    sha.update(byteArrayToWordArray(subBuffer));
    const hash = sha.finalize();
    const byteArray = wordArrayToByteArray(hash, 28);
    // @ts-ignore
    const checksum = generateChecksum(byteArray);
    const val = checksum + hash.toString();
    return val;
}