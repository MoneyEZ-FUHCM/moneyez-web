export interface User {
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
  id: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string | null;
  isDeleted: boolean;
}
