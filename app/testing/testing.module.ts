import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ContractStubBackendInterceptor } from './contract-stub-backend/contract-stub-backend.interceptor';
import { FilterPipeMock } from './pipe-mocks/filter';
import { TooltipDefaultPipeMock } from './pipe-mocks/tooltipDefault';
import { TranslatePipeMock } from './pipe-mocks/translate';

@NgModule({
  declarations: [FilterPipeMock, TranslatePipeMock, TooltipDefaultPipeMock],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ContractStubBackendInterceptor,
      multi: true
    }
  ],
  exports: [FilterPipeMock, TranslatePipeMock, TooltipDefaultPipeMock, HttpClientModule]
})
export class TestingModule {}
