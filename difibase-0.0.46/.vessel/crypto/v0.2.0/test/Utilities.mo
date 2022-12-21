import Array "mo:base/Array";
import Iter "mo:base/Iter";

import Util "../src/Utilities";

let fifty   = Iter.toArray(Iter.range(0, 49));
let hundred = Iter.toArray(Iter.range(0, 99));

// Remove the first 50.
assert(Util.removeN(50, hundred) == Iter.toArray(Iter.range(50, 99)));

// Take the first 50.
assert(Util.takeN(50, hundred) == fifty);

// Copy the first 50 starting at position 50.
let copyTo = Array.thaw<Nat>(hundred);
assert(Util.copy(50, copyTo, Util.takeN(50, hundred)) == 50);
assert(Array.freeze(copyTo) == Array.append(fifty, fifty));

// Copy more that you can take.
let overflow = Array.init<Nat>(10, 0);
assert(Util.copy(0, overflow, Util.takeN(50, hundred)) == 10);

// Provide less that cap.
let underflow = Array.init<Nat>(10, 0);
assert(Util.copy(5, overflow, Util.takeN(3, hundred)) == 3);
