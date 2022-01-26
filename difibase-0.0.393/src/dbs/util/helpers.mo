import Text "mo:base/Text";
module { 
    public func text_concat(v1: Text, v2: Text, separator: Text): Text{
        var v = Text.concat(v1, separator);
        v := Text.concat(v, v2);
        return v;  
    };
}