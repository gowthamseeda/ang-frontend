export class ExternalKey {
  keyType: string;
  value: string;
  brandId?: string;
  productGroupId?: string;
  readonly?: boolean;

  constructor(
    keyType: string = '',
    value: string = '',
    brandId?: string | undefined,
    productGroupId?: string | undefined,
    readonly?: boolean
  ) {
    this.keyType = keyType;
    this.value = value;
    this.brandId = brandId;
    this.productGroupId = productGroupId;
    this.readonly = readonly || false;
  }
}
