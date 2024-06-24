import axios from "axios";
import {ShareAccess} from "../models/ShareAccess.ts";
import {Post} from "../models/Post.ts";

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

    public addNewPost(post: Post): Promise<string> {
        return axios({
            method: 'POST',
            url: `${this.api_host}/api/post`,
            data: post
        }).then((response) => response.data).catch((err) => {
            throw err
        });
    }

    public modifyPost(post: Post): Promise<string> {
        return axios({
            method: 'PUT',
            url: `${this.api_host}/api/post`,
            data: post
        }).then((response) => response.data).catch((err) => {
            throw err
        });
    }
}
