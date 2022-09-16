import Text "mo:base/Text";
import AsyncSource "../uuid/async/SourceV4";
import UUID "../uuid/UUID";
import GUID "../uuid/GUID";

module { 
    public func text_concat(v1: Text, v2: Text, separator: Text): Text{
        var v = Text.concat(v1, separator);
        v := Text.concat(v, v2);
        return v;  
    };
    private type UUID = UUID.UUID;
    private type GUID = GUID.GUID;
    public func random_id32(): async (UUID, GUID){
        let ASS = AsyncSource.Source();
        let uuid = await ASS.new32();
        let guid = UUID.toGUID(uuid);
        return (uuid, guid);
    };
    public func random_id16(): async (UUID, GUID){
        let ASS = AsyncSource.Source();
        let uuid = await ASS.new();
        let guid = UUID.toGUID(uuid);
        return (uuid, guid);
    };
}