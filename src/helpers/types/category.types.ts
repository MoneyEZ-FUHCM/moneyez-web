import { BaseEntity } from "./common.type";

export interface Category extends BaseEntity {
  isTemplate: boolean;
  id: string;
  name: string;
  nameUnsign: string;
  isSaving: boolean;
  description: string;
  subcategories?: SubCategory[];
  code: string;
  icon: string;
  type: "EXPENSE" | "INCOME";
}

export interface SubCategory extends Category {}
