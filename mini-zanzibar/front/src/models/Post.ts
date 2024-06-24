import {TagInfo} from "./TagInfo.ts";

export interface Post {
    filename: string,
    tags: TagInfo[]
}