import { BaseEntity } from "./common.type";

export interface User extends BaseEntity {
  email: string;
  confirmEmail: string | null;
  avatar: string | null;
  fullName: string;
  unsignFullName: string | null;
  address: string | null;
  phoneNumber: string;
  dob: string | null;
  gender: number;
  role: "ADMIN" | "USER" | "OTHER";
}
