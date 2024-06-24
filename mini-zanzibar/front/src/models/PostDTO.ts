import {TagInfo} from "./TagInfo.ts";

export interface PostDTO {
    filename: string,
    tags: TagInfo[]
}