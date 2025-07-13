export type OutletInformationSection = { [key in OutletInformation]?: OutletInformationDetails };

export class OutletInformationDetails {
  value: boolean;
  disabled: boolean;
  label: string;
  outletInformation?: OutletInformationSection;
}

export enum OutletInformation {
  ADDRESS = 'ADDRESS',
  DISTRIBUTION_LEVEL = 'DISTRIBUTION_LEVEL',
  PREDECESSOR_SUCCESSOR = 'PREDECESSOR_SUCCESSOR',
  ADDITIONAL_ADDRESS = 'ADDITIONAL_ADDRESS',
  PO_BOX = 'PO_BOX',
  GPS = 'GPS',
  BUSINESS_NAMES = 'BUSINESS_NAMES',
  ADDITIONAL_TRANSLATIONS = 'ADDITIONAL_TRANSLATIONS',
  GENERAL_COMMUNICATION = 'GENERAL_COMMUNICATION',
  SPOKEN_LANGUAGE = 'SPOKEN_LANGUAGE',
  BRAND_CODES = 'BRAND_CODES',
  ALIAS = 'ALIAS',
  ADAM_ID = 'ADAM_ID',
  FEDERAL_ID = 'FEDERAL_ID',
  EXTERNAL_KEY = 'EXTERNAL_KEY',
  BRAND_LABEL = 'BRAND_LABEL',
  TAX_ID = 'TAX_ID',
  CONTRACT_STATUS = 'CONTRACT_STATUS',
  SERVICE_OFFER_AND_VALIDITY = 'SERVICE_OFFER_AND_VALIDITY',
  OPENING_HOUR = 'OPENING_HOUR',
  SPECIAL_OPENING_HOUR = 'SPECIAL_OPENING_HOUR',
  CONTRACT_PARTNER = 'CONTRACT_PARTNER',
  COMMUNICATION = 'COMMUNICATION',
  INVESTOR = 'INVESTOR',
  BUSINESS_SITE_STREET_3 = 'BUSINESS_SITE_STREET_3',
  OUTLET_RELATIONSHIP = 'OUTLET_RELATIONSHIP'
}

export const outletInformationBaseData = {
  [OutletInformation.ADDRESS]: { disabled: true, value: true, label: 'BASE_DATA_ADDRESS' },
  [OutletInformation.DISTRIBUTION_LEVEL]: {
    disabled: true,
    value: true,
    label: 'ADMIN_OUTLET_INFORMATION_DISTRIBUTION_LEVEL'
  },
  [OutletInformation.PREDECESSOR_SUCCESSOR]: {
    disabled: true,
    value: true,
    label: 'ADMIN_OUTLET_INFORMATION_PREDECESSOR_SUCCESSOR'
  },
  [OutletInformation.ADDITIONAL_ADDRESS]: {
    disabled: true,
    value: true,
    label: 'BASE_DATA_ADDITIONAL_ADDRESS'
  },
  [OutletInformation.PO_BOX]: { disabled: true, value: true, label: 'BASE_DATA_PO_BOX' },
  [OutletInformation.GPS]: { disabled: true, value: true, label: 'BASE_DATA_GPS' },
  [OutletInformation.BUSINESS_NAMES]: {
    disabled: false,
    value: true,
    label: 'BASE_DATA_BUSINESS_NAME'
  },
  [OutletInformation.ADDITIONAL_TRANSLATIONS]: {
    disabled: false,
    value: true,
    label: 'BASE_DATA_ADDITIONAL_TRANSLATIONS'
  }
};

export const outletInformationGeneralCommunication = {
  [OutletInformation.GENERAL_COMMUNICATION]: {
    disabled: true,
    value: true,
    label: 'ADMIN_OUTLET_INFORMATION_GENERAL_COMMUNICATION'
  },
  [OutletInformation.SPOKEN_LANGUAGE]: { disabled: true, value: true, label: 'SPOKEN_LANGUAGE' }
};

export const outletInformationKeys = {
  [OutletInformation.BRAND_CODES]: { disabled: true, value: true, label: 'BRAND_CODES' },
  [OutletInformation.ALIAS]: { disabled: false, value: true, label: 'ALIAS' },
  [OutletInformation.ADAM_ID]: { disabled: false, value: true, label: 'ADAM_ID' },
  [OutletInformation.FEDERAL_ID]: { disabled: true, value: true, label: 'FEDERAL_ID' },
  [OutletInformation.EXTERNAL_KEY]: { disabled: false, value: true, label: 'EXTERNAL_KEYS' }
};

export const outletInformationLabels = {
  [OutletInformation.BRAND_LABEL]: {
    disabled: false,
    value: true,
    label: 'ADMIN_OUTLET_INFORMATION_INFORMATION_BRAND_LABELS'
  }
};

export const outletInformationLegalInformation = {
  [OutletInformation.TAX_ID]: { disabled: false, value: true, label: 'LEGAL_TAX_ID' },
  [OutletInformation.CONTRACT_STATUS]: {
    disabled: false,
    value: true,
    label: 'LEGAL_CONTRACT_STATUS'
  }
};

export const outletInformationServices = {
  [OutletInformation.SERVICE_OFFER_AND_VALIDITY]: {
    disabled: false,
    value: true,
    label: 'ADMIN_OUTLET_INFORMATION_SERVICE_OFFERINGS_VALIDITY',
    outletInformation: {
      [OutletInformation.OPENING_HOUR]: {
        disabled: false,
        value: true,
        label: 'OPENING_HOURS',
        outletInformation: {
          [OutletInformation.SPECIAL_OPENING_HOUR]: {
            disabled: false,
            value: true,
            label: 'SPECIAL_OPENING_HOURS'
          }
        }
      },
      [OutletInformation.CONTRACT_PARTNER]: {
        disabled: false,
        value: true,
        label: 'ADMIN_OUTLET_INFORMATION_CONTRACT_PARTNER'
      },
      [OutletInformation.COMMUNICATION]: { disabled: false, value: true, label: 'COMMUNICATION' }
    }
  }
};

export const outletInformationInvestors = {
  [OutletInformation.INVESTOR]: {
    disabled: true,
    value: true,
    label: 'ADMIN_OUTLET_INFORMATION_INVESTORS'
  }
};

export const outletInformationOthers = {
  [OutletInformation.BUSINESS_SITE_STREET_3]: {
    disabled: true,
    value: true,
    label: 'ADMIN_OUTLET_INFORMATION_STREET3'
  },
  [OutletInformation.OUTLET_RELATIONSHIP]: {
    disabled: true,
    value: true,
    label: 'ADMIN_OUTLET_INFORMATION_RELATIONSHIP'
  }
};

export const outletInformationDefaultValue = {
  ...outletInformationBaseData,
  ...outletInformationGeneralCommunication,
  ...outletInformationKeys,
  ...outletInformationLabels,
  ...outletInformationLegalInformation,
  ...outletInformationServices,
  ...outletInformationInvestors,
  ...outletInformationOthers
};
