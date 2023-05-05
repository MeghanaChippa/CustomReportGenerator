import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MytemplatesComponent} from './mytemplates.component'
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: MytemplatesComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MytemplatesRoutingModule { }
