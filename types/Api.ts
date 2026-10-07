import type { CardInterface } from "./Card";

export interface PageResult {
    success: boolean;
    items: CardInterface[];
    page: number;
    totalPages: number;
}