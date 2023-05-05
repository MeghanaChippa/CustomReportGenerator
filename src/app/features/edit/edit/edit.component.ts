import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import { ExportDataService } from 'src/app/services/export-data.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { JsonserverService } from 'src/app/services/jsonserver.service';
import { PdfgeneratorService } from 'src/app/services/pdfgenerator.service';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import{Template,Header,Table,TableField,Textbox,Section, sectionField} from '../../models/template'
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
name:string;
  template= new Template()
  header=new Header()
  templateId: number
  form!: UntypedFormGroup;
  data: any;
  isReportTitleDisabled = false;

  constructor(private exportDataService :ExportDataService,private http: HttpClient, private _snackBar: MatSnackBar,
    private jsonServerService: JsonserverService,private pdfGenerator:PdfgeneratorService,private route: ActivatedRoute ) { 
    this.data = this.exportDataService.userData;
    if (!this.template.sections || this.template.sections.length === 0) {
      this.template.sections = [];
      this.template.sections.push(new Section());
    }
    if (!this.template.tables || this.template.tables.length === 0) {
      this.template.tables = [];
      this.template.tables.push(new Table());
    }
    if (!this.template.textboxes || this.template.textboxes.length === 0) {
      this.template.textboxes = [];
      this.template.textboxes.push(new Textbox());
    }

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const reportName = String(params.get('reportName'));
      if (reportName && reportName !== "") {
        console.log(reportName);
        this.name=reportName;
        this.jsonServerService.getTemplateObject(reportName).subscribe((template: any) => {
          this.template = template;
          this.templateId = template.id;
        });
      }
      this.isReportTitleDisabled = true;
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
    handleCheckboxClick() {
    console.log("Date: ", this.template.date);
    console.log("Digital Signature: ", this.template.digitalSignature);
  }

  addTable(){
    this.template.tables.push(new Table());
    this.addNewTableField(this.template.tables[this.template.tables.length-1]);
  }
  addNewTableField(table: Table) {
    table.tableFields.push(new TableField());
    console.log(this.template.tables);
  }

  addTextbox(){
    this.template.textboxes.push(new Textbox())
    console.log(this.template.textboxes)
  }

  addSetion(){
    this.template.sections.push(new Section());
    this.addNewSectionField(this.template.sections[this.template.sections.length-1])
  }
  addNewSectionField(section: Section){
      section.sectionFields.push(new sectionField());
      console.log(this.template.sections);
  }
  generatePDF(action = 'open') {
      console.log(this.template);
      const docDefinition=this.pdfGenerator.generatePdfDocDefinition(this.template);

    if(action==='download'){
      pdfMake.createPdf(docDefinition).download();
    }else if(action === 'print'){
      pdfMake.createPdf(docDefinition).print();  

    }else if(action === 'save'){
    
     const docDefinitionJson = JSON.stringify(docDefinition);
     console.log(docDefinitionJson)
     if (this.templateId) {
      this.jsonServerService.updateTemplateObject(this.templateId, this.template).subscribe(() => {
        console.log('Template updated!');
        this.openSnackBar("Edits saved!","Close");
      });
    } else {
      this.jsonServerService.addTemplateObject(this.template).subscribe(() => {
        console.log('Template added!');
        this.openSnackBar("Template saved!","Close");
      });
    }
    }
    else{
      pdfMake.createPdf(docDefinition).open();   

    }

  }
  fileChanged(e) {
    const file = e.target.files[0];
    this.getBase64(file);
  }

  getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      this.template.Header.logo = reader.result as string;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }
  

 
}
