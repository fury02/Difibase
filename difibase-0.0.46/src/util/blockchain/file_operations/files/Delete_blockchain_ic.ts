import {Actor_Service_Local} from "../../../actors/local/Actor_local";
import crc from 'crc';

var ac = new Actor_Service_Local();

export default class DeleteFileBlockchain{
    constructor() {};
    public async deleteFile(uuid:number[]) { // @ts-ignore
        var isDelete = await ac.actor_service_db_files.delete_file(uuid); }
}