export interface FileProps {
  id?: number;
  ownerId?: number;
  fileCategory?: string;
  fileName?: string;
  fileServerName?: string;
  publicId?: string;
  fileData?: File;
  signToken?: string;
  signStatus?: string;
}
