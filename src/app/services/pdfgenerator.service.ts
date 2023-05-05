import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import { ExportDataService } from 'src/app/services/export-data.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { JsonserverService } from 'src/app/services/jsonserver.service';
import { WithId} from '../features/template/create/id';
import{Template,Header,Table,TableField,Textbox,Section, sectionField} from '../features/models/template';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root'
})
export class PdfgeneratorService {

  constructor() { }
  //template= new Template()
  generatePdfDocDefinition(template: any): TDocumentDefinitions {

    var docDefinition: WithId<TDocumentDefinitions> = {
      id: Date.now() + "",
      reportName: template.Header.reportTitle,
      content: [],
      styles: {},
      pageMargins: [40, 60, 40, 60]
    };
  
    docDefinition.content = [] as Content[];
    docDefinition.content.push({
      canvas: [{
        type: 'rect',
        x: 10,
        y: 10,
        w: 575.28, // A4 paper width
        h: 821.89, // A4 paper height
        lineWidth: 2,
        lineColor: '#000',
      }],
      absolutePosition: { x: 0, y: 0 }
    });
    
    if (template.hasOwnProperty('date') && template.date) {
      const date = new Date().toISOString();
      docDefinition.content.push({
        text: date,
        fontSize: 12,
        alignment: 'right',
        absolutePosition: { x: 0, y:150},
        color: 'black'
      });
    }
    
    if (template.hasOwnProperty('digitalSignature') && template.digitalSignature) {
      docDefinition.content.push({
        text: 'Digital Signature',
        fontSize: 12,
        alignment: 'right',
        absolutePosition: { x: 0, y: 700 },
        color: 'black'
      });
    }
    const pageSize = 'A4';
    const pageWidth = 595.28; // A4 page width in pdfmake units (1/72 inch)
    const pageHeight = 841.89; // A4 page height in pdfmake units (1/72 inch)

    if (template.hasOwnProperty('Header')) {
      const header = template['Header'];
      docDefinition.content.push({
        absolutePosition: { x: 10, y: 10 },
        
        table: {
          widths: [150, 407], 
          heights: [80],
          body: [
            [
              {
                image: header.logo,
                width: 100,
                margin: [10, 5, 0, 30]
              },
              {
                stack: [
                  {
                    text: header.companyName,
                    fontSize: 16,
                    alignment: 'center',
                    absolutePosition: { x: 120, y: 20 },
                    margin: [0, 5, 0, 10]
                  },
                  {
                    text: [
                      { text: 'Office Address: ', bold: true },
                      header.address
                    ],
                    fontSize: 9,
                    alignment: 'center',
                    margin: [0, 0, 0, 10],
                    absolutePosition: { x: 190, y: 45 },
                  },
                ],
                margin: [0, 5, 0, 5]
              }
            ]
          ],
          // Subtracting 575.28 from the page width and dividing by 2 gives the position of the left edge of the table.
        },
        
        margin: [0, 0, 0, 10]
      });
      docDefinition.content.push({
        style: 'tableExample',
        alignment: 'center',
        absolutePosition: { x: 10, y: 95 },
        table: {
          widths: [565],
          body: [
            [header['reportTitle'],
            ]
          ]
        },
        margin: [0, 10, 0, 0] // Add a margin of 100 units to the top of the table
      });
    }
    
    if (template.hasOwnProperty('sections')) {
      const sections = template['sections'];
      const sectionContents: Content[] = [];
      docDefinition.content.push({ text: '\n\n\n', margin: [20, 30, 0, 10] });
      sections.forEach((section: any) => {
        const sectionItems: any[] = [];
        section['sectionFields'].forEach((sectionField: any) => {
          sectionItems.push({ text: sectionField['field'] + ":    ", bold: true }, sectionField['fieldValue'] + "\n");
        });
  
        sectionContents.push({
          text: section['sectionName'],
          style: 'header'
        });
  
        sectionContents.push({
          text: sectionItems,
          style: 'body'
        });
      });
  
      docDefinition.content = [...docDefinition.content, ...sectionContents];
      docDefinition.content.push({ text: '\n', margin: [0, 10, 0, 10] });
  
    }
  
    if (template.hasOwnProperty('tables')) {
      const tables = template['tables'];
      const tableContents: Content[] = [];
      tables.forEach((table: any) => {
        const tableBody: any[] = [];
        table['tableFields'].forEach((tableField: any) => {
          const fieldArray = [tableField['fieldName']];
          fieldArray.push(...tableField['field']);
          tableBody.push(fieldArray);
        });
  
        tableContents.push({
          text: table['tableName'],
          style: 'header'
        });
  
        tableContents.push({
          
          table: {
            widths: [150, 357],
            body: tableBody,
            
          },
          layout: {
            hLineWidth: function(i: any, node: any) {
              return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
            },
            vLineWidth: function(i: any, node: any) {
              return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
            },
            hLineColor: function(i: any, node: any) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function(i: any, node: any) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            }
          },          style: 'tableExample',
      
        });
      });
  
      docDefinition.content = [...docDefinition.content, ...tableContents];
      docDefinition.content.push({ text: '\n', margin: [0, 10, 0, 10] });
  
    }
  
    if (template.hasOwnProperty('textboxes')) {
      const textboxes: any[] = template['textboxes'];
      const contentArray: Content[] = [];
  
      textboxes.forEach((textbox: any) => {
        const title: Content = { text: textbox['Title'], style: 'header' };
        const body: Content = { text: textbox['Body'], style: 'body' };
        const combinedContent: Content[] = contentArray.concat(title, body);
        contentArray.push(...combinedContent);
      });
  
      docDefinition.content = [...docDefinition.content, ...contentArray];
      docDefinition.content.push({ text: '\n', margin: [0, 10, 0, 10] });
  
    }
  
    // Add styles
    docDefinition.styles = {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      body: {
        fontSize: 12,
        margin: [0, 0, 0, 10]
      },
      table: {
        margin: [0, 10, 0, 10]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
    };
  
    return docDefinition;
    
    }

    generateDocDefinition(template: any): TDocumentDefinitions {

     var docDefinition: WithId<TDocumentDefinitions> = {
      id: Date.now() + "",
      reportName: template.Header.reportTitle,
      content: [],
      styles: {},
      pageMargins: [40, 60, 40, 60]
    };
  
    docDefinition.content = [] as Content[];
    docDefinition.content.push({
      canvas: [{
        type: 'rect',
        x: 10,
        y: 10,
        w: 575.28, // A4 paper width
        h: 821.89, // A4 paper height
        lineWidth: 2,
        lineColor: '#000',
      }],
      absolutePosition: { x: 0, y: 0 }
    });
    
    if (template.hasOwnProperty('date') && template.date) {
      const date = new Date().toISOString();
      docDefinition.content.push({
        text: date,
        fontSize: 12,
        alignment: 'right',
        absolutePosition: { x: 0, y:150},
        color: 'black'
      });
    }
    
    if (template.hasOwnProperty('digitalSignature') && template.digitalSignature) {
      docDefinition.content.push({
        text: 'Digital Signature',
        fontSize: 12,
        alignment: 'right',
        absolutePosition: { x: 0, y: 700 },
        color: 'black'
      });
    }
    const pageSize = 'A4';
    const pageWidth = 595.28; // A4 page width in pdfmake units (1/72 inch)
    const pageHeight = 841.89; // A4 page height in pdfmake units (1/72 inch)

    if (template.hasOwnProperty('Header')) {
      const header = template['Header'];
      docDefinition.content.push({
        absolutePosition: { x: 10, y: 10 },
        
        table: {
          widths: [150, 407], 
          heights: [80],
          body: [
            [
              {
                image: header.logo,
                width: 100,
                margin: [10, 5, 0, 30]
              },
              {
                stack: [
                  {
                    text: header.companyName,
                    fontSize: 16,
                    alignment: 'center',
                    absolutePosition: { x: 120, y: 20 },
                    margin: [0, 5, 0, 10]
                  },
                  {
                    text: [
                      { text: 'Office Address: ', bold: true },
                      header.address
                    ],
                    fontSize: 9,
                    alignment: 'center',
                    margin: [0, 0, 0, 10],
                    absolutePosition: { x: 190, y: 45 },
                  },
                ],
                margin: [0, 5, 0, 5]
              }
            ]
          ],
          // Subtracting 575.28 from the page width and dividing by 2 gives the position of the left edge of the table.
        },
        
        margin: [0, 0, 0, 10]
      });
      docDefinition.content.push({
        style: 'tableExample',
        alignment: 'center',
        absolutePosition: { x: 10, y: 95 },
        table: {
          widths: [565],
          body: [
            [header['reportTitle'],
            ]
          ]
        },
        margin: [0, 10, 0, 0] // Add a margin of 100 units to the top of the table
      });
    }
    
    if (template.hasOwnProperty('sections')) {
      const sections = template['sections'];
      const tableData = [];
      sections.forEach((section: any) => {
        const sectionItems = [];
        section['sectionFields'].forEach((sectionField: any) => {
          sectionItems.push(sectionField['field'] + ":    " + sectionField['fieldValue'] + "\n");
        });
        tableData.push({
          sectionName: section['sectionName'],
          sectionFields: sectionItems.join('')
        });
      });
      
      docDefinition.content.push({ text: '\n\n\n', margin: [20, 30, 0, 10] });
      docDefinition.content.push({
        table: {
          headerRows: 1,
          widths: [150, 357],
          body: 
            [tableData.map(data => [data.sectionName]),
            ...tableData.map(data => [data.sectionFields])
          ]
        },
        layout: {
          hLineWidth: function(i: any, node: any) {
            return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
          },
          vLineWidth: function(i: any, node: any) {
            return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
          },
          hLineColor: function(i: any, node: any) {
            return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
          },
          vLineColor: function(i: any, node: any) {
            return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
          }
        },          style: 'tableExample',
      });
      

    }
    
  
    if (template.hasOwnProperty('tables')) {
      const tables = template['tables'];
      const tableContents: Content[] = [];
      tables.forEach((table: any) => {
        const tableBody: any[] = [];
        table['tableFields'].forEach((tableField: any) => {
          const fieldArray = [tableField['fieldName']];
          fieldArray.push(...tableField['field']);
          tableBody.push(fieldArray);
        });
  
        tableContents.push({
          text: table['tableName'],
          style: 'header'
        });
  
        tableContents.push({
          
          table: {
            widths: [150, 357],
            body: tableBody,
            
          },
          layout: {
            hLineWidth: function(i: any, node: any) {
              return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
            },
            vLineWidth: function(i: any, node: any) {
              return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
            },
            hLineColor: function(i: any, node: any) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function(i: any, node: any) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            }
          },          style: 'tableExample',
      
        });
      });
  
      docDefinition.content = [...docDefinition.content, ...tableContents];
      docDefinition.content.push({ text: '\n', margin: [0, 10, 0, 10] });
  
    }
  
    if (template.hasOwnProperty('textboxes')) {
      const textboxes: any[] = template['textboxes'];
      const contentArray: Content[] = [];
  
      textboxes.forEach((textbox: any) => {
        const title: Content = { text: textbox['Title'], style: 'header' };
        const body: Content = { text: textbox['Body'], style: 'body' };
        const combinedContent: Content[] = contentArray.concat(title, body);
        contentArray.push(...combinedContent);
      });
  
      docDefinition.content = [...docDefinition.content, ...contentArray];
      docDefinition.content.push({ text: '\n', margin: [0, 10, 0, 10] });
  
    }
  
    // Add styles
    docDefinition.styles = {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      body: {
        fontSize: 12,
        margin: [0, 0, 0, 10]
      },
      table: {
        margin: [0, 10, 0, 10]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
    };
  
    return docDefinition;
    
  
}
}
