import { BaseEntity } from "./common.type";

export interface Group extends BaseEntity {
  id: string;
  name: string;
  nameUnsign: string;
  description: string | null;
  currentBalance: number;
  status: "ACTIVE" | "INACTIVE";
  visibility: "PUBLIC" | "PRIVATE";
  imageUrl: string | null;
  groupMembers: any[]; // Update this with proper member type if available
}
