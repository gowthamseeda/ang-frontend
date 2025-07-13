import {
  AdditionalTranslationCheck,
  OutletTranslation,
  SnapshotChanges
} from './outlet-history-snapshot.model';

export const currentTranslationSnapshotMock: { [key: string]: OutletTranslation } = {
  'ja-JP': {
    address: {
      street: 'Test JP Street Curr',
      streetNumber: 'Test JP Street Number Curr',
      city: 'Test JP City Curr',
      district: 'Test JP District',
      addressAddition: 'Test JP Address Addition Curr'
    },
    legalName: 'Test JP Legal Name Curr',
    nameAddition: 'Test JP Name Addition',
    poBox: {
      city: 'Test JP PO Box City'
    },
    province: 'Test JP Province Curr',
    state: 'Test JP State',
    businessNames: [{ businessName: 'Test Business Name Curr', brandId: 'SMT', isDeleted: false }]
  }
};

export const comparingTranslationSnapshotMock: { [key: string]: OutletTranslation } = {
  'ja-JP': {
    address: {
      street: 'Test JP Street Prev',
      streetNumber: 'Test JP Street Number Prev',
      city: 'Test JP City Prev',
      district: 'Test JP District',
      addressAddition: 'Test JP Address Addition Prev'
    },
    legalName: 'Test JP Legal Name Prev',
    nameAddition: 'Test JP Name Addition',
    poBox: {
      city: 'Test JP PO Box City'
    },
    province: 'Test JP Province Prev',
    state: 'Test JP State',
    businessNames: [{ businessName: 'Test Business Name Prev', brandId: 'SMT', isDeleted: false }]
  }
};

export const translationChangesMock: SnapshotChanges[] = [
  { id: '1', changedField: 'additionalTranslations.ja-JP.address.street', userId: 'USER 1' },
  { id: '2', changedField: 'additionalTranslations.ja-JP.address.streetNumber', userId: 'USER 2' },
  { id: '3', changedField: 'additionalTranslations.ja-JP.address.city', userId: 'USER 3' },
  {
    id: '4',
    changedField: 'additionalTranslations.ja-JP.address.addressAddition',
    userId: 'USER 4'
  },
  { id: '6', changedField: 'additionalTranslations.ja-JP.legalName', userId: 'USER 2' },
  { id: '7', changedField: 'additionalTranslations.ja-JP.province', userId: 'USER 1' },
  { id: '8', changedField: 'businessNames.translations.ja-JP', userId: 'USER 4' }
];

export const additionalTranslationsChangedMock: AdditionalTranslationCheck = {
  isLegalNameFieldChanged: true,
  isNameAdditionFieldChanged: false,
  isAddressStreetFieldChanged: true,
  isAddressStreetNumberFieldChanged: false,
  isAddressCityFieldChanged: true,
  isAddressDistrictFieldChanged: false,
  isAddressAdditionFieldChanged: false,
  isPoBoxCityFieldChanged: true,
  isProvinceFieldChanged: false,
  isStateFieldChanged: true,
  isBusinessNamesFieldChanged: true
};

export const additionalTranslationsNotChangedMock: AdditionalTranslationCheck = {
  isLegalNameFieldChanged: false,
  isNameAdditionFieldChanged: false,
  isAddressStreetFieldChanged: false,
  isAddressStreetNumberFieldChanged: false,
  isAddressCityFieldChanged: false,
  isAddressDistrictFieldChanged: false,
  isAddressAdditionFieldChanged: false,
  isPoBoxCityFieldChanged: false,
  isProvinceFieldChanged: false,
  isStateFieldChanged: false,
  isBusinessNamesFieldChanged: false
};
