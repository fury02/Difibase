import List "mo:base/List";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Char "mo:base/Char";

import Debug "mo:base/Debug";

module {
	public func textInNat(text_nat : Text) : Nat {
        let der = 10;
        var number = 0;
        var mult = 1;

        var char_iter = Text.toIter(text_nat);
        var char_list = List.nil<Char.Char>();
        for(ch in char_iter){ char_list := List.push(ch, char_list); };

        List.iterate(char_list, func(ch: Char:Char){
            var d = 0;
            switch(ch){
                case('0'){d := 0;};
                case('1'){d := 1;};
                case('2'){d := 2;};
                case('3'){d := 3;};
                case('4'){d := 4;};
                case('5'){d := 5;};
                case('6'){d := 6;};
                case('7'){d := 7;};
                case('8'){d := 8;};
                case('9'){d := 9;};
            };
            number += d*mult;
            mult *= der;
        });

	    return number;
	};
};
