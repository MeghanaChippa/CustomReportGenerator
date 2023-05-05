import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateRoutingModule } from './template-routing.module';
import { CreateComponent } from './create/create.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    CreateComponent,
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class TemplateModule { }
