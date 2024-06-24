import axios from "axios";
import {ShareAccess} from "../models/ShareAccess.ts";
import {Post} from "../models/Post.ts";
import {PostDTO} from "../models/PostDTO.ts";

export class FileService {

    private api_host = "http://localhost:8080";
    public addShareAccess(shareAccess: ShareAccess): Promise<string> {
        return axios({
            method: 'POST',
            url: `${this.api_host}/api/post/share`,
            data: shareAccess
        }).then((response) => response.data).catch((err) => {
            throw err
        });
    }

    public addNewPost(post: PostDTO, user: String): Promise<string> {
        return axios({
            method: 'POST',
            url: `${this.api_host}/api/post/${user}`,
            data: post
        }).then((response) => response.data).catch((err) => {
            throw err
        });
    }

    public modifyPost(post: PostDTO, user: String, id: number): Promise<string> {
        return axios({
            method: 'PUT',
            url: `${this.api_host}/api/post/${user}/${id}`,
            data: post
        }).then((response) => response.data).catch((err) => {
            throw err
        });
    }

    public getUserPosts(user: String): Promise<Post[]> {
        return axios({
            method: 'GET',
            url: `${this.api_host}/api/post/${user}`,
        }).then((response) => response.data).catch((err) => {
            throw err
        });
    }

    public getUserSharedPosts(user: String): Promise<Post[]> {
        return axios({
            method: 'GET',
            url: `${this.api_host}/api/post/shared/${user}`,
        }).then((response) => response.data).catch((err) => {
            throw err
        });
    }
}
