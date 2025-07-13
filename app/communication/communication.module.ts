import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { StructuresModule } from 'app/structures/structures.modules';

import { GeographyModule } from '../geography/geography.module';
import { LegalStructureModule } from '../legal-structure/legal-structure.module';
import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { ServicesSharedModule } from '../services/shared/services-shared.module';
import { SharedModule } from '../shared/shared.module';

import { CommunicationRoutingModule } from './communication-routing.module';
import { GeneralCommunicationComponent } from './container/general-communication/general-communication.component';
import { ServiceCommunicationComponent } from './container/service-communication/service-communication.component';
import { ServiceCommunicationMultiEditComponent } from './container/service-communication-multi-edit/service-communication-multi-edit.component';
import { SpokenLanguageComponent } from './container/spoken-language/spoken-language.component';
import { SocialMediaChannelsPipe } from './pipe/social-media-channels/social-media-channels.pipe';
import { StandardCommunicationChannelsPipe } from './pipe/standard-communication-channels/standard-communication-channels.pipe';
import { CommunicationChannelsComponent } from './presentational/communication-channels/communication-channels.component';
import { SocialMediaChannelsComponent } from './presentational/social-media-channels/social-media-channels.component';
import { SocialMediaIconComponent } from './presentational/social-media-icon/social-media-icon.component';
import { CommunicationConfirmationComponent } from './presentational/communication-confirmation/communication-confirmation.component';
import { CommunicationChannelsService } from './communication-channels.service';

@NgModule({
  declarations: [
    ServiceCommunicationComponent,
    ServiceCommunicationMultiEditComponent,
    CommunicationChannelsComponent,
    GeneralCommunicationComponent,
    SocialMediaChannelsComponent,
    SocialMediaIconComponent,
    SocialMediaChannelsPipe,
    StandardCommunicationChannelsPipe,
    SpokenLanguageComponent,
    CommunicationConfirmationComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    CommunicationRoutingModule,
    SharedModule,
    ServicesSharedModule,
    HeaderModule,
    LegalStructureModule,
    GeographyModule,
    StructuresModule
  ],
  providers: [
    CommunicationChannelsService
  ],
  exports: [
    CommunicationChannelsComponent
  ]
})
export class CommunicationModule {}
