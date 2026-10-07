export type CardType = "movie" | "series"

export interface CardInterface {
    type: CardType,
    title: string;
    thumbnail: string;
    description: string;
    rating: number;
    year: number;
    runTime: number;
    lastRunTime?: number;
}