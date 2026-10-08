export type CardType = "movie" | "series"

export interface CardInterface {
    id: number;
    type: CardType,
    title: string;
    thumbnail: string;
    description: string;
    rating: number;
    year: number;
    runTime: number;
    genres?: string[];
    lastRunTime?: number;
}