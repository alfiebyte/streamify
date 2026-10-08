import type { CardInterface } from "./Card.js";

export interface PageResult {
    success: boolean;
    items: CardInterface[];
    page: number;
    totalPages: number;
}