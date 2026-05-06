export interface GenreData {
    id: number;
    name: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    type: string;
}

export interface Genres {
    data: GenreData[];
}

