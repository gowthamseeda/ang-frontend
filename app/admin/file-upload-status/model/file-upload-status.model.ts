export class FileUploadStatusDetail {
  id?: string;
  name: string;
  status: string;
  fileName: string;
  errorMsg?: string | null;
  createTimestamp: Date;
  updateTimestamp: Date;
}

export class FileUploadStatusDetails {
  fileUploadStatusDetails: FileUploadStatusDetail[];
}