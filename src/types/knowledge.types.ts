export interface Knowledge {
  name: string;
  size: number;
  contentType: string;
  id: string;
  createdDate: string;
  createdBy: string | null;
  updatedDate: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}
