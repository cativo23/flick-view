import type { ImageSize } from './ImageSize';
import type {  Url } from './Url';
import type { Tag } from './Tag';

export type Image = {
    id: string;
    title: {
        _content: string;
    };
    owner: {
        realname: string;
        username: string;
    };
    dates: {
        taken: string;
        posted: number;
        lastupdate: number;
    };
    description: {
        _content: string;
    };
    urls: {
        url: Url[];
    };
    images: ImageSize[];
    tags: {
        tag: Tag[];
    };
}