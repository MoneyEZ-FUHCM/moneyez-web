import { BaseEntity } from "./common.type";

export interface SpendingModel extends BaseEntity {
    name: string;
    description: string;
    isTemplate: boolean;
}