import {Favorite} from "./favorite";

export interface Profile {
    uid: string;
    username: string;
    theme: string;
    favorites?: Array<Favorite>;
    channel: string;
    photoUrl: string;
    favoriteRequests?: Array<Favorite>;
}
