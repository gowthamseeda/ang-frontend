export interface ContractStatusResponse {
  items: Array<{
    brandId: string;
    companyRelationId?: string;
    required: boolean;
    languageId?: string;
    status?: string;
    disclosures?: string;
  }>;
}

export interface ContractStatus {
  items: Array<{
    brandId: string;
    required: boolean;
    languageId?: string;
    disclosures?: string;
    status?: string;
  }>;
}
