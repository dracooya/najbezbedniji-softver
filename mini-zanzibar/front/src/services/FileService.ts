import axios from "axios";
import {ShareAccess} from "../components/models/ShareAccess.ts";

export class FileService {

    private api_host = "http://localhost:8080";
    public addShareAccess(shareAccess: ShareAccess): Promise<string> {
        return axios({
            method: 'POST',
            url: `${this.api_host}/api/auth`,
            data: shareAccess
        }).then((response) => response.data).catch((err) => {
            throw err
        });
    }
}
