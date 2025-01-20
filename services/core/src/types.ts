export interface MulterBlobFile extends Express.Multer.File {
  key: string;
  location: string;
}
