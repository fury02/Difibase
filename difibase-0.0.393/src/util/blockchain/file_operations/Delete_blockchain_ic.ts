import {Actor_Service_Local} from "../../actors/local/Agent_local";
import crc from 'crc';

var ac = new Actor_Service_Local();

export default class DeleteFileBlockchain{
    constructor() {};
    public async deleteFile(uuid:number[]) { var isDelete = await ac.actor_service_dbs.delete_file(uuid); }
}