export class Brand {
  brandId: string;
  readonly = false;

  constructor(brandId: string, readonly?: boolean) {
    this.brandId = brandId;
    this.readonly = readonly || false;
  }
}
