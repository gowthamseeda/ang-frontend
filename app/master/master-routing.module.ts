import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from '../authorization.guard';

import { BrandPriorityComponent } from './brand/brand-priority/brand-priority.component';
import { CreateBrandComponent } from './brand/create-brand/create-brand.component';
import { UpdateBrandComponent } from './brand/update-brand/update-brand.component';
import { CreateCloseDownReasonComponent } from './close-down-reason/create-close-down-reason/create-close-down-reason.component';
import { UpdateCloseDownReasonComponent } from './close-down-reason/update-close-down-reason/update-close-down-reason.component';
import { CreateCountryGroupComponent } from './country-group/create-country-group/create-country-group.component';
import { UpdateCountryGroupComponent } from './country-group/update-country-group/update-country-group.component';
import { CreateCountryComponent } from './country/create-country/create-country.component';
import { UpdateCountryComponent } from './country/update-country/update-country.component';
import { CreateKeyTypeComponent } from './key-type/create-key-type/create-key-type.component';
import { UpdateKeyTypeComponent } from './key-type/update-key-type/update-key-type.component';
import { CreateLabelComponent } from './label/create-label/create-label.component';
import { UpdateLabelComponent } from './label/update-label/update-label.component';
import { CreateLanguageComponent } from './language/create-language/create-language.component';
import { UpdateLanguageComponent } from './language/update-language/update-language.component';
import { MasterComponent } from './master.component';
import { CreateProductGroupComponent } from './product-group/create-product-group/create-product-group.component';
import { UpdateProductGroupComponent } from './product-group/update-product-group/update-product-group.component';
import { CreateServiceComponent } from './service/create-service/create-service.component';
import { ServicePriorityComponent } from './service/service-priority/service-priority.component';
import { ConfigureServiceVariantComponent } from './service/service-variants/containers/configure-service-variant/configure-service-variant.component';
import { ServiceVariantComponent } from './service/service-variants/containers/service-variants/service-variant.component';
import { UpdateServiceComponent } from './service/update-service/update-service.component';
import { CreateOutletRelationshipComponent } from './outlet-relationship/create-outlet-relationship/create-outlet-relationship.component';
import { UpdateOutletRelationshipComponent } from './outlet-relationship/update-outlet-relationship/update-outlet-relationship.component';
import { CreateRetailCountryComponent } from './retail-country/create-retail-country/create-retail-country.component';
import { UpdateRetailCountryComponent } from './retail-country/update-retail-country/update-retail-country.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: [
        'geography.country.create',
        'geography.country.update',
        'geography.country.delete',
        'services.brand.create',
        'services.brand.update',
        'services.brand.delete',
        'geography.language.create',
        'geography.language.update',
        'geography.language.delete',
        'services.productgroup.create',
        'services.productgroup.update',
        'services.productgroup.delete',
        'services.service.create',
        'services.service.update',
        'services.service.delete',
        'legalstructure.closedownreason.create',
        'legalstructure.closedownreason.update',
        'legalstructure.closedownreason.delete',
        'traits.keytype.create',
        'traits.keytype.update',
        'traits.keytype.delete',
        'traits.label.create',
        'traits.label.update',
        'traits.label.delete',
        'geography.countrygroup.create',
        'geography.countrygroup.update',
        'geography.countrygroup.delete',
        'structures.outletrelationships.create',
        'structures.outletrelationships.update',
        'structures.outletrelationships.delete',
        'geography.retailcountry.create',
        'geography.retailcountry.update'
      ]
    }
  },
  {
    path: 'country',
    component: CreateCountryComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['geography.country.create']
    }
  },
  {
    path: 'country/:id',
    component: UpdateCountryComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['geography.country.update']
    }
  },
  {
    path: 'brand',
    component: CreateBrandComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['services.brand.create']
    }
  },
  {
    path: 'brand/priority',
    component: BrandPriorityComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['services.brand.update']
    }
  },
  {
    path: 'brand/:id',
    component: UpdateBrandComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['services.brand.update']
    }
  },
  {
    path: 'language',
    component: CreateLanguageComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['geography.language.create']
    }
  },
  {
    path: 'language/:id',
    component: UpdateLanguageComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['geography.language.update']
    }
  },
  {
    path: 'productGroup',
    component: CreateProductGroupComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['services.productgroup.create']
    }
  },
  {
    path: 'productGroup/:id',
    component: UpdateProductGroupComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['services.productgroup.update']
    }
  },
  {
    path: 'service',
    component: CreateServiceComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['services.service.create']
    }
  },
  {
    path: 'service/priority',
    component: ServicePriorityComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['services.service.update']
    }
  },
  {
    path: 'service/service-variant',
    component: ServiceVariantComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: [
        'services.servicevariant.configuration.read',
        'services.servicevariant.configuration.delete'
      ]
    }
  },
  {
    path: 'service/service-variant/configure',
    component: ConfigureServiceVariantComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['services.servicevariant.configuration.create']
    }
  },
  {
    path: 'service/:id',
    component: UpdateServiceComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['services.service.update']
    }
  },
  {
    path: 'closeDownReason',
    component: CreateCloseDownReasonComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['legalstructure.closedownreason.create']
    }
  },
  {
    path: 'closeDownReason/:id',
    component: UpdateCloseDownReasonComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['legalstructure.closedownreason.update']
    }
  },
  {
    path: 'label',
    component: CreateLabelComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['traits.label.create']
    }
  },
  {
    path: 'label/:id',
    component: UpdateLabelComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['traits.label.update']
    }
  },
  {
    path: 'countryGroup',
    component: CreateCountryGroupComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['geography.countrygroup.create']
    }
  },
  {
    path: 'countryGroup/:id',
    component: UpdateCountryGroupComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['geography.countrygroup.update']
    }
  },
  {
    path: 'keyType',
    component: CreateKeyTypeComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['traits.keytype.create']
    }
  },
  {
    path: 'keyType/:id',
    component: UpdateKeyTypeComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['traits.keytype.update']
    }
  },
  {
    path: 'outletRelationship',
    component: CreateOutletRelationshipComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['structures.outletrelationships.create']
    }
  },
  {
    path: 'outletRelationship/:id',
    component: UpdateOutletRelationshipComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['structures.outletrelationships.update']
    }
  },
  {
    path: 'retailCountry',
    component: CreateRetailCountryComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['geography.retailcountry.create']
    }
  },
  {
    path: 'retailCountry/:id',
    component: UpdateRetailCountryComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['geography.retailcountry.update']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule {}
