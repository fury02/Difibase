import Principal "../src/Principal/lib";

let p = Principal.fromText("em77e-bvlzu-aq");
let b = Principal.toBlob(p);
assert(p == Principal.fromBlob(b));
