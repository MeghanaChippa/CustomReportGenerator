import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MytemplatesComponent } from './features/mytemplates/mytemplates.component';
import { CreateComponent } from './features/template/create/create.component';

const appRoutes: Routes = [
  { path: 'editTemplate/:reportName', 
  loadChildren: () => import('./features/edit/edit.module').then(m => m.EditModule),
   },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'mytemplates',
    loadChildren: () => import('./features/mytemplates/mytemplates.module').then(m => m.MytemplatesModule),
  },
 
  {
    path: 'create',
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
  },
  {
    path: 'createTemplate',
    loadChildren: () => import('./features/template/template.module').then(m => m.TemplateModule),
  },
  
  {
    path: 'generatePDF',
    loadChildren: () => import('./features/excel-to-table/excel-to-table.module').then(m => m.ExcelToTableModule),
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
