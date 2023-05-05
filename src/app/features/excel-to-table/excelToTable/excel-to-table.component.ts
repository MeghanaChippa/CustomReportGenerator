// @ts-ignore
import {MatTableDataSource} from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx';
import { ExportDataService } from 'src/app/services/export-data.service';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { JsonserverService } from 'src/app/services/jsonserver.service';
import { MatSelectChange } from '@angular/material/select';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import{Template,Header,Table,TableField,Textbox,Section, sectionField} from '../../models/template'
import { PdfgeneratorService } from 'src/app/services/pdfgenerator.service';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-excel-to-table',
  templateUrl: './excel-to-table.component.html',
  styleUrls: ['./excel-to-table.component.css']
})


export class ExcelToTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterValue: string;

  constructor(private exportDataService :ExportDataService, private jsonServerService: JsonserverService,private pdfGenerator:PdfgeneratorService ) { }

  ngOnInit(): void {
    this.jsonServerService.getAllReportNames()
    .subscribe((reportNames: string[]) => {
      this.reportNames = reportNames;
      console.log(this.reportNames)
    });
  }
  selectedReportName: string | null = null;
  selectedTemplate: any | null = null;
  updatedTemplate: any | null = null;
  selectedObject: any | null = null;
  sectionFields: string[]=[];
  tableFields: string[]=[];
  tableData: any[] = [];
  public sheetName: string;
  public tableTitle: string[]=[];
  public customPagination = 1;
  public recordsPerPage = 10;
  public tableRecords : string[];
  public pageStartCount = 0;
  public pageEndCount = 10;
  public totalPageCount = 0;
  public currentPage = 0;
  public reportNames: string[];
  dataSource = new MatTableDataSource<any>([]);
  attributes = new FormControl();
  public AttributeList:string[] = [];
  public selectedAttributes:string[] = [];
  display: FormControl = new FormControl();
  file_store: FileList;
  file_list: Array<string> = [];

  public uploadData(event: Event) {
    const target: DataTransfer = <DataTransfer>(<unknown>event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
     // console.log(data); // Data will be logged in array format containing objects
      

      this.exportDataService.userData=data;
      this.tableData = data;
      this.tableTitle = Object.keys(this.tableData[0]);
      this.AttributeList=Object.keys(this.tableData[0]);

      this.sheetName = wb.SheetNames[0];
      this.dataSource = new MatTableDataSource(this.tableData);
      console.log(this.tableTitle)

     

      this.tableRecords = this.tableData.slice(
        this.pageStartCount,
        this.pageEndCount
      );

      
      this.totalPageCount = this.tableData.length / this.recordsPerPage;
    };
  }
  
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.paginator.pageIndex = this.currentPage;
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.tableRecords = this.tableData.slice(startIndex, endIndex);
  }
  
  applyFilter(filterValue: string) {
    this.tableRecords = this.tableData.filter((record) =>
      record.name.trim().toLowerCase().includes(filterValue.trim().toLowerCase())
    );
  }
  
  filterTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.applyFilter(filterValue);
  }
  

  onReportNameSelection(event: MatSelectChange) {
    const reportName = event.value;
    if (reportName) {
      this.jsonServerService.getTemplateObject(reportName).subscribe((template:any)=>{
        this.selectedReportName = reportName;
        this.selectedObject=template;
        this.tableFields=this.selectedObject.tables[0].tableFields;
        this.sectionFields=this.selectedObject.sections[0].sectionFields;
        console.log(`Selected report name: ${this.selectedReportName}`);
        console.log(`Selected template: `,this.selectedObject);
        if (this.selectedObject.tables) {
          console.log(`Available Table list in selected template:`);
          this.selectedObject.tables.forEach(table => {
            console.log(`Table: ${table.tableName}`);
            table.tableFields.forEach(field => {
              console.log(`${field.fieldName}: ${field.field[0]}`);
            });
          });
        }
      
        if (this.selectedObject.sections) {
          console.log(`Available Section list in selected template:`);
          this.selectedObject.sections.forEach(section => {
            console.log(`Section: ${section.sectionName}`);
            section.sectionFields.forEach(field => {
              console.log(`${field.field}`);
            });
          });
        }
      // const updatedTemplate = this.createUpdatedTemplateObject(this.selectedObject, this.tableData);
      // console.log(`Updated template: `, updatedTemplate);
      // this.tableData.forEach((rowData) => {
      //   var template=this.selectedObject;
      //   this.updatedTemplate=this.updateTemplate(template,rowData)
      //   console.log(this.updatedTemplate);
      //   this.generatePDF(this.updatedTemplate);
      // });
  
      });
    } else {
      this.selectedReportName = null;
      this.selectedTemplate = null;
    }
  }

  generatePDF(rowData: any) {
    console.log(rowData);
    const template = this.selectedObject;
    const updatedTemplate = this.updateTemplate(template, rowData);
    console.log(updatedTemplate)
    const docDefinition = this.pdfGenerator.generatePdfDocDefinition(updatedTemplate);
    pdfMake.createPdf(docDefinition).open();   
  }
  
  

  


  createUpdatedTemplateObject(selectedObject, tableData) {
    console.log("Table data is",tableData);
    const updatedTemplate = JSON.parse(JSON.stringify(selectedObject)); // create a deep copy of the template object
    if (updatedTemplate.tables) {
      updatedTemplate.tables.forEach(table => {
        table.tableFields.forEach(field => {
          field.field[0] = tableData[field.columnIndex]; // update the field value in the template object
        });
      });
    }
    if (updatedTemplate.sections) {
      updatedTemplate.sections.forEach(section => {
        section.sectionFields.forEach(field => {
          field.field = tableData[field.columnIndex]; // update the field value in the template object
        });
      });
    }
    return updatedTemplate;
  }
  
  updateTemplate(templateObject, attributeList) {
    console.log(attributeList);
    templateObject.sections.forEach(section => {
      section.sectionFields.forEach(field => {
        if (attributeList.hasOwnProperty(field.field)) {
          field.fieldValue= `${attributeList[field.field]}`;
        }
      });
    });
  
    // Update table
    templateObject.tables.forEach(table => {
      table.tableFields.forEach(field => {
        //const attributeKey = field.fieldName.toLowerCase().replace(/\s+/g, ''); // Normalize attribute key
        if (attributeList.hasOwnProperty(field.fieldName)) {
          field.field[0] = attributeList[field.fieldName];
        }
      });
    });
  
    return templateObject;
  }
  
  
}
