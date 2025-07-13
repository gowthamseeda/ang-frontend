import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ViewProfileComponent } from './containers/view-profile/view-profile.component';
import { viewProfilePath } from './outlet-routing-paths';
import { OutletStoreInitializer } from './outlet-store.guard';
import { StructuresStoreInitializer } from '../structures/structures-store.guard';

const routes: Routes = [
  {
    path: viewProfilePath,
    component: ViewProfileComponent,
    canActivate: [OutletStoreInitializer, StructuresStoreInitializer]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutletRoutingModule {}
