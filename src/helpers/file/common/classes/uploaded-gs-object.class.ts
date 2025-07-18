export class UploadedGSObject {
  fileName: string;
  contentType: string;
  size: number;
  publicURL: string;
  createdAt: string;

  constructor(bucketName: string, destinationPath: string, file: Express.Multer.File) {
    this.fileName = file.originalname;
    this.contentType = file.mimetype;
    this.size = file.size;
    this.publicURL = `https://storage.googleapis.com/${bucketName}/${destinationPath}`;
    this.createdAt = new Date().toISOString();
  }
}
