enum UpdateMode { Upgrade, Reinstall, Install, Unknown}
declare const enum EnumTypeHashValue { none,unknown,sha224, sha256, sha384, sha512, kessak};
export type TypeHashValue =
    { 'sha224' : null } |
    { 'sha256' : null } |
    { 'sha384' : null } |
    { 'sha512' : null } |
    { 'kessak' : null } |
    { 'none' : null } |
    { 'unknown' : null };

