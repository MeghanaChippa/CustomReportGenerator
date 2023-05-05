import { Component, OnInit } from '@angular/core';
import { AngleUnits } from 'aws-sdk/clients/groundstation';
import { JsonserverService } from 'src/app/services/jsonserver.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import { ExportDataService } from 'src/app/services/export-data.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { PdfgeneratorService } from 'src/app/services/pdfgenerator.service';
import{Template,Header,Table,TableField,Textbox,Section, sectionField} from '../../models/template'
import { CreateComponent } from '../../template/create/create.component';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

const routes: Routes = [
  { path: 'createTemplate', component: CreateComponent },
  { path: 'createTemplate/:reportName', component: CreateComponent} // route for editing
];
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  currentUser: any;

  constructor(private router: Router,private _snackBar: MatSnackBar,private jsonServerService: JsonserverService ,private pdfGenerator:PdfgeneratorService) {
  }

  public reportNames:string[];
  public selectedReportName: string;
  public selectedObject: any;
  ngOnInit() {
    this.jsonServerService.getAllReportNames()
    .subscribe((reportNames: string[]) => {
      this.reportNames = reportNames;
      console.log(this.reportNames)
    });
    
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  deleteTemplate(reportName:string) {
    if (confirm("Are you sure you want to delete this template?")) {
      this.jsonServerService.getTemplateObject(reportName).subscribe((templateObject) => {
        this.jsonServerService.deleteTemplateObject(templateObject.id).subscribe(() => {
          console.log("Template Deleted");
          // Remove the deleted template from the list of templates
          this.openSnackBar("Template Deleted","Close");
          this.reportNames = this.reportNames.filter(name => name !== reportName);
        });
      });
    }
  }
  
  generatePDF(action = 'open',reportName) {
    this.jsonServerService.getTemplateObject(reportName).subscribe((template:any)=>{
      this.selectedObject=template;
      const docDefinition=this.pdfGenerator.generatePdfDocDefinition(template);

      if(action==='download'){
        pdfMake.createPdf(docDefinition).download();
      }else if(action === 'print'){
        pdfMake.createPdf(docDefinition).print();
      }else if(action === 'edit'){
        this.router.navigate(['/editTemplate', reportName]);
      }
      else{
        pdfMake.createPdf(docDefinition).open();   
      }

    }
    );
  
   

}


}
