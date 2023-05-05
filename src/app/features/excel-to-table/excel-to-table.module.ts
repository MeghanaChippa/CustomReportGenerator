import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExcelToTableComponent } from './excelToTable/excel-to-table.component';
import { SharedModule } from '../../shared/shared.module';

import { ExcelToTableRoutingModule } from './excel-to-table-routing.module';


@NgModule({
  declarations: [ExcelToTableComponent],
  imports: [
    CommonModule,
    SharedModule,

    ExcelToTableRoutingModule
  ]
})
export class ExcelToTableModule { }



