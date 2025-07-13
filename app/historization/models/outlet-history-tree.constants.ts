import {
  OutletHistoryDataCluster,
  OutletHistoryDataClusterFields,
  OutletHistoryNode
} from './outlet-history-tree.model';

export var outletHistoryNodes: OutletHistoryNode[] = [
  {
    dataCluster: OutletHistoryDataCluster.BASE_DATA
  },
  {
    dataCluster: OutletHistoryDataCluster.LEGAL_INFO
  },
  {
    dataCluster: OutletHistoryDataCluster.OFFERED_SERVICES
  },
  {
    dataCluster: OutletHistoryDataCluster.ASSIGNED_KEYS
  },
  {
    dataCluster: OutletHistoryDataCluster.ASSIGNED_LABELS
  },
  {
    dataCluster: OutletHistoryDataCluster.GENERAL_COMMUNICATIONS
  },
  {
    dataCluster: OutletHistoryDataCluster.OUTLET_RELATIONSHIP
  }
];

export const outletHistoryDataClusterFields: OutletHistoryDataClusterFields = {
  [OutletHistoryDataCluster.BASE_DATA]: {
    fields: [
      {
        fieldName: 'companyId',
        fieldLabel: 'COMPANY_ID',
        isExtendedData: true
      },
      {
        fieldName: 'defaultLanguageId',
        fieldLabel: 'DEFAULT_LANGUAGE',
        isExtendedData: true
      },
      {
        fieldName: 'active',
        fieldLabel: 'ACTIVE',
        isExtendedData: true
      },
      {
        fieldName: 'registeredOffice',
        fieldLabel: 'REGISTERED_OFFICE',
        isExtendedData: false
      },
      {
        fieldName: 'distributionLevels',
        fieldLabel: 'DISTRIBUTION_LEVELS',
        isExtendedData: true
      },
      {
        fieldName: 'affiliate',
        fieldLabel: 'AFFILIATE',
        isExtendedData: true
      },
      {
        fieldName: 'status',
        fieldLabel: 'STATUS',
        isExtendedData: true
      },
      {
        fieldName: 'startOperationDate',
        fieldLabel: 'START_OPERATION_DATE',
        isExtendedData: true
      },
      {
        fieldName: 'closeDownDate',
        fieldLabel: 'CLOSE_DOWN_DATE',
        isExtendedData: true
      },
      {
        fieldName: 'closeDownReason',
        children: [
          {
            fieldName: 'name',
            fieldLabel: 'CLOSE_DOWN_REASONS',
            isExtendedData: true
          },
          {
            fieldName: 'validity',
            fieldLabel: 'CLOSE_DOWN_REASONS_VALIDITY',
            isExtendedData: true
          }
        ],
        isExtendedData: true
      },
      {
        fieldName: 'predecessors',
        fieldLabel: 'PREDECESSOR',
        isExtendedData: true
      },
      {
        fieldName: 'successors',
        fieldLabel: 'SUCCESSOR',
        isExtendedData: true
      },
      {
        fieldName: 'legalName',
        fieldLabel: 'LEGAL_NAME',
        isExtendedData: true
      },
      {
        fieldName: 'nameAddition',
        fieldLabel: 'NAME_ADDITION',
        isExtendedData: true
      },
      {
        fieldName: 'address',
        children: [
          {
            fieldName: 'street',
            fieldLabel: 'STREET',
            isExtendedData: false
          },
          {
            fieldName: 'streetNumber',
            fieldLabel: 'STREET_NUMBER',
            isExtendedData: false
          },
          {
            fieldName: 'addressAddition',
            fieldLabel: 'ADDRESS_ADDITION',
            isExtendedData: false
          },
          {
            fieldName: 'zipCode',
            fieldLabel: 'ZIP_CODE',
            isExtendedData: false
          },
          {
            fieldName: 'city',
            fieldLabel: 'CITY',
            isExtendedData: false
          },
          {
            fieldName: 'district',
            fieldLabel: 'DISTRICT',
            isExtendedData: false
          }
        ],
        isExtendedData: false
      },
      {
        fieldName: 'state',
        fieldLabel: 'STATE',
        isExtendedData: true
      },
      {
        fieldName: 'province',
        fieldLabel: 'PROVINCE',
        isExtendedData: true
      },
      {
        fieldName: 'countryName',
        fieldLabel: 'COUNTRY',
        isExtendedData: true
      },
      {
        fieldName: 'additionalAddress',
        children: [
          {
            fieldName: 'street',
            fieldLabel: 'ADDITIONAL_ADDRESS_STREET',
            isExtendedData: false
          },
          {
            fieldName: 'streetNumber',
            fieldLabel: 'ADDITIONAL_ADDRESS_STREET_NUMBER',
            isExtendedData: false
          },
          {
            fieldName: 'addressAddition',
            fieldLabel: 'ADDITIONAL_ADDRESS_ADDRESS_ADDITION',
            isExtendedData: false
          },
          {
            fieldName: 'zipCode',
            fieldLabel: 'ADDITIONAL_ADDRESS_ZIP_CODE',
            isExtendedData: false
          },
          {
            fieldName: 'city',
            fieldLabel: 'ADDITIONAL_ADDRESS_CITY',
            isExtendedData: false
          },
          {
            fieldName: 'district',
            fieldLabel: 'ADDITIONAL_ADDRESS_DISTRICT',
            isExtendedData: false
          }
        ],
        isExtendedData: false
      },
      {
        fieldName: 'poBox',
        children: [
          {
            fieldName: 'number',
            fieldLabel: 'PO_BOX_NUMBER',
            isExtendedData: false
          },
          {
            fieldName: 'zipCode',
            fieldLabel: 'PO_BOX_ZIP_CODE',
            isExtendedData: false
          },
          {
            fieldName: 'city',
            fieldLabel: 'PO_BOX_CITY',
            isExtendedData: false
          }
        ],
        isExtendedData: false
      },
      {
        fieldName: 'gps',
        children: [
          {
            fieldName: 'latitude',
            fieldLabel: 'LATITUDE',
            isExtendedData: false
          },
          {
            fieldName: 'longitude',
            fieldLabel: 'LONGITUDE',
            isExtendedData: false
          }
        ],
        isExtendedData: false
      },
      {
        fieldName: 'businessNames',
        fieldLabel: 'BUSINESS_NAMES',
        isExtendedData: false
      },
      {
        fieldName: 'additionalTranslations',
        fieldLabel: 'ADDITIONAL_TRANSLATIONS',
        isExtendedData: false
      }
    ]
  },
  [OutletHistoryDataCluster.LEGAL_INFO]: {
    fields: [
      {
        fieldName: 'companyId',
        fieldLabel: 'COMPANY_ID',
        isExtendedData: true
      },
      {
        fieldName: 'companyLegalInfo',
        children: [
          {
            fieldName: 'vatNo',
            fieldLabel: 'LEGAL_VAT_NO',
            isExtendedData: false
          },
          {
            fieldName: 'legalFooter',
            fieldLabel: 'LEGAL_LEGAL_FOOTER',
            isExtendedData: false
          },
          {
            fieldName: 'legalFooterTranslation',
            fieldLabel: 'LEGAL_LEGAL_FOOTER_TRANSLATIONS',
            isExtendedData: false
          }
        ],
        isExtendedData: false
      },
      {
        fieldName: 'businessSiteLegalInfo',
        children: [
          {
            fieldName: 'taxNo',
            fieldLabel: 'LEGAL_TAX_NO',
            isExtendedData: false
          },
          {
            fieldName: 'taxNoIsDeleted',
            fieldLabel: 'LEGAL_TAX_NO_IS_DELETED',
            isExtendedData: false
          }
        ],
        isExtendedData: false
      },
      {
        fieldName: 'contractStatus',
        fieldLabel: 'LEGAL_CONTRACT_STATUS',
        isExtendedData: false
      }
    ]
  },
  [OutletHistoryDataCluster.OFFERED_SERVICES]: {
    fields: [
      {
        fieldName: 'offeredServices',
        fieldLabel: 'SERVICE_OFFERED_SERVICE',
        isExtendedData: false
      }
    ]
  },
  [OutletHistoryDataCluster.ASSIGNED_KEYS]: {
    fields: [
      {
        fieldName: 'assignedKeys',
        children: [
          {
            fieldName: 'alias',
            fieldLabel: 'ALIAS',
            isExtendedData: false
          },
          {
            fieldName: 'brandCodes',
            fieldLabel: 'BRAND_CODES',
            isExtendedData: false
          },
          {
            fieldName: 'externalKeys',
            fieldLabel: 'EXTERNAL_KEYS',
            isExtendedData: false
          },
          {
            fieldName: 'federalId',
            fieldLabel: 'FEDERAL_ID',
            isExtendedData: false
          },
          {
            fieldName: 'gssnClassicId',
            fieldLabel: 'GSSN_CLASSIC_ID',
            isExtendedData: false
          },
          {
            fieldName: 'isDeleted',
            fieldLabel: 'IS_DELETED',
            isExtendedData: false
          }
        ],
        isExtendedData: false
      }
    ]
  },
  [OutletHistoryDataCluster.ASSIGNED_LABELS]: {
    fields: [
      {
        fieldName: 'assignedLabels',
        children: [
          {
            fieldName: 'brandLabels',
            fieldLabel: 'BRAND_LABELS',
            isExtendedData: false
          }
          // {
          //   fieldName: 'isDeleted',
          //   fieldLabel: 'IS_DELETED',
          //   isExtendedData: false
          // }
        ],
        isExtendedData: false
      }
    ]
  },
  [OutletHistoryDataCluster.GENERAL_COMMUNICATIONS]: {
    fields: [
      {
        fieldName: 'generalCommunicationData',
        children: [
          {
            fieldName: 'communicationData',
            fieldLabel: 'COMMUNICATION_DATA',
            isExtendedData: false
          }
        ],
        isExtendedData: false
      }
    ]
  },
  [OutletHistoryDataCluster.OUTLET_RELATIONSHIP]: {
    fields: [
      {
        fieldName: 'outletRelationship',
        children: [
          {
            fieldName: 'outletRelationships',
            fieldLabel: 'RELATIONSHIPS',
            isExtendedData: false
          }
        ],
        isExtendedData: false
      }
    ]
  }
};
