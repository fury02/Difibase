import { Principal } from '@dfinity/principal';
import { sha224 } from "js-sha256";
import crc from "crc";
import CryptoJS from 'crypto-js';
import crc32 from 'buffer-crc32';


// Dfinity Account separator
export const ACCOUNT_DOMAIN_SEPERATOR = '\x0Aaccount-id';
// Subaccounts are arbitrary 32-byte values.
export const SUB_ACCOUNT_ZERO = Buffer.alloc(32);

export const wordToByteArray = (word, length) => {
    const byteArray = [];
    const xFF = 0xff;
    if (length > 0) byteArray.push(word >>> 24);
    if (length > 1) byteArray.push((word >>> 16) & xFF);
    if (length > 2) byteArray.push((word >>> 8) & xFF);
    if (length > 3) byteArray.push(word & xFF);

    return byteArray;
};

export const wordArrayToByteArray = (wordArray, length) => {
    if (
        wordArray.hasOwnProperty('sigBytes') &&
        wordArray.hasOwnProperty('words')
    ) {
        length = wordArray.sigBytes;
        wordArray = wordArray.words;
    }

    let result = [];
    let bytes;
    let i = 0;
    while (length > 0) {
        bytes = wordToByteArray(wordArray[i], Math.min(4, length));
        length -= bytes.length;
        result = [...result, bytes];
        i++;
    }
    return [].concat.apply([], result);
};

export const intToHex = (val) =>
    val < 0 ? (Number(val) >>> 0).toString(16) : Number(val).toString(16);

// We generate a CRC32 checksum, and trnasform it into a hexString
export const generateChecksum = (hash) => {
    const crc = crc32.unsigned(Buffer.from(hash));
    const hex = intToHex(crc);
    return hex.padStart(8, '0');
};


export const byteArrayToWordArray = (byteArray) => {
    const wordArray = [];
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

export const to32bits = (num) => {
    const b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, num);
    return Array.from(new Uint8Array(b));
};

export const getAccountId = (
    principal,
    subAccount
) => {
    const sha = CryptoJS.algo.SHA224.create();
    sha.update(ACCOUNT_DOMAIN_SEPERATOR); // Internally parsed with UTF-8, like go does
    sha.update(byteArrayToWordArray(principal.toUint8Array()));
    const subBuffer = Buffer.from(SUB_ACCOUNT_ZERO);
    if (subAccount) {
        subBuffer.writeUInt32BE(subAccount);
    }
    sha.update(byteArrayToWordArray(subBuffer));
    const hash = sha.finalize();

    /// While this is backed by an array of length 28, it's canonical representation
    /// is a hex string of length 64. The first 8 characters are the CRC-32 encoded
    /// hash of the following 56 characters of hex. Both, upper and lower case
    /// characters are valid in the input string and can even be mixed.
    /// [ic/rs/rosetta-api/ledger_canister/src/account_identifier.rs]
    const byteArray = wordArrayToByteArray(hash, 28);
    const checksum = generateChecksum(byteArray);
    const val = checksum + hash.toString();

    return val;
};
export const getTokenIdentifier = (canister, index) => {
    const padding = Buffer.from('\x0Atid');
    const array = new Uint8Array([
        ...padding,
        ...Principal.fromText(canister).toUint8Array(),
        ...to32bits(index),
    ]);
    return Principal.fromUint8Array(array).toText();
};
export const toHexString = (byteArray) => {
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('').toUpperCase();
};
export const hexToBytes = (hex) => {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
};
export const uint8ArrayToBigInt = (array) => {
    const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    if (typeof view.getBigUint64 === "function") {
        return view.getBigUint64(0);
    } else {
        // eslint-disable-next-line no-undef
        const high = BigInt(view.getUint32(0));
        // eslint-disable-next-line no-undef
        const low = BigInt(view.getUint32(4));
        // eslint-disable-next-line no-undef
        return (high << BigInt(32)) + low;
    }
};
// eslint-disable-next-line no-undef
const TWO_TO_THE_32 = BigInt(1) << BigInt(32);
export const bigIntToUint8Array = (value) => {
    const array = new Uint8Array(8);
    const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    if (typeof view.setBigUint64 === "function") {
        view.setBigUint64(0, value);
    } else {
        // eslint-disable-next-line no-undef
        view.setUint32(0, Number(value >> BigInt(32)));
        view.setUint32(4, Number(value % TWO_TO_THE_32));
    }

    return array;
};
export const arrayBufferToArrayOfNumber = (
    buffer
)=> {
    const typedArray = new Uint8Array(buffer);
    return Array.from(typedArray);
};
export const arrayOfNumberToUint8Array = (
    numbers
) => {
    return new Uint8Array(numbers);
};
export const arrayOfNumberToArrayBuffer = (
    numbers
) => {
    return arrayOfNumberToUint8Array(numbers).buffer;
};
export const arrayBufferToNumber = (buffer) => {
    const view = new DataView(buffer);
    return view.getUint32(view.byteLength - 4);
};
export const numberToArrayBuffer = (
    value,
    byteLength
) => {
    const buffer = new ArrayBuffer(byteLength);
    new DataView(buffer).setUint32(byteLength - 4, value);
    return buffer;
};
export const asciiStringToByteArray = (text)=> {
    return Array.from(text).map((c) => c.charCodeAt(0));
};
export const toSubAccountId = (subAccount) => {
    const bytes = arrayOfNumberToArrayBuffer(subAccount);
    return arrayBufferToNumber(bytes);
};
export const accountIdentifierToBytes = (
    accountIdentifier
) => {
    return Uint8Array.from(Buffer.from(accountIdentifier, "hex")).subarray(4);
};
export const accountIdentifierFromBytes = (
    accountIdentifier
) => {
    return Buffer.from(accountIdentifier).toString("hex");
};
export const principalToAccountDefaultIdentifier = (
    principal,
) => {
    // Hash (sha224) the principal, the subAccount and some padding
    const padding = asciiStringToByteArray("\x0Aaccount-id");
    const shaObj = sha224.create();
    shaObj.update([
        ...padding,
        ...principal.toUint8Array(),
        ...(Array(32).fill(0)),
    ]);
    const hash = new Uint8Array(shaObj.array());
    // Prepend the checksum of the hash and convert to a hex string
    const checksum = calculateCrc32(hash);
    const bytes = new Uint8Array([...checksum, ...hash]);
    return toHexString(bytes);
};

export const principalToSubAccount = (principal) => {
    const bytes = principal.toUint8Array();
    const subAccount = new Uint8Array(32);
    subAccount[0] = bytes.length;
    subAccount.set(bytes, 1);
    return subAccount;
};
// 4 bytes
export const calculateCrc32 = (bytes) => {
    const checksumArrayBuf = new ArrayBuffer(4);
    const view = new DataView(checksumArrayBuf);
    view.setUint32(0, crc.crc32(Buffer.from(bytes)), false);
    return Buffer.from(checksumArrayBuf);
};
export const principalToBytesAccountDefaultIdentifier = (
    principal,
) => {
    // Hash (sha224) the principal, the subAccount and some padding
    const padding = asciiStringToByteArray("\x0Aaccount-id");

    const shaObj = sha224.create();
    shaObj.update([
        ...padding,
        ...principal.toUint8Array(),
        ...(Array(32).fill(0)),
    ]);
    const hash = new Uint8Array(shaObj.array());

    // Prepend the checksum of the hash and convert to a hex string
    const checksum = calculateCrc32(hash);
    const bytes = new Uint8Array([...checksum, ...hash]);
    return bytes;
};
export const getAccountIdentifier = ( principal,  subAccount) => {
    const sha224 = CryptoJS.algo.SHA224.create();
    const sa = Buffer.from(SUB_ACCOUNT_ZERO);
    let d = principal.toUint8Array();
    let a  = new Uint8Array([10, 97, 99, 99, 111, 117, 110, 116, 45, 105, 100]); //default
    var ad = [...a].concat([...d]);
    var adsa = ad.concat([...sa]);
    let h = sha224.update(adsa);
    let c = crc32(h);
    return 0;
};