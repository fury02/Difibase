import Text "mo:base/Text";

actor class WasmActor() = this{
    public query func query_get_version(): async Text {
        return "Wasm installing version: 0.0.1";
    };
    public func get_version(): async Text {
        return "Wasm installing version: 0.0.1";
    };
};

 
