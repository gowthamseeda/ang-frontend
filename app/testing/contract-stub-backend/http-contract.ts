export class HttpContract {
  request: {
    url: string;
    method: string;
    headers?: any;
  };
  response: {
    status: number;
    body?: string;
    headers?: any;
  };
  transformers?: Array<string>;
}
