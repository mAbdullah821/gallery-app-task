import { Image } from '@prisma/client';

export interface IMultipleImageUploadResponse {
  success: boolean;
  message: string;
  data: Image[];
  count: number;
}
