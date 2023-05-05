import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// import {NgbModule} from '@ng-bootstrap/ng-bootstrap'; 
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { AppRoutingModule } from './app-routing.module';
import { LoggerModule } from 'ngx-logger';
import { environment } from '../environments/environment';
import { ExcelToTableComponent } from './features/excel-to-table/excelToTable/excel-to-table.component';
import { MytemplatesComponent } from './features/mytemplates/mytemplates.component';
import { EditComponent } from './features/edit/edit/edit.component';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    CustomMaterialModule.forRoot(),
    AppRoutingModule,
    HttpClientModule ,
    LoggerModule.forRoot({
      serverLoggingUrl: `http://my-api/logs`,
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
