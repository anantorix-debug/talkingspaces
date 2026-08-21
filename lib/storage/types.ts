export interface StoredFile {
  url: string;
  path: string;
  size: number;
}

export interface StorageProvider {
  save(buffer: Buffer, filename: string, mimeType: string): Promise<StoredFile>;
  delete(path: string): Promise<void>;
}
