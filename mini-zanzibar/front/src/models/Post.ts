import {TagInfo} from "./TagInfo.ts";

export interface Post {
    id: number,
    filename: string,
    tags: TagInfo[]
}