export class Template {
    Templatename: string;
    Header: Header;
    textboxes: Textbox[]=[];
    tables: Table[]=[];
    sections: Section[]=[];
    date: boolean;
    digitalSignature: boolean;
    constructor() {
      this.Templatename="";
      this.date=false;
      this.digitalSignature=false;
        this.Header=new Header();
        this.textboxes.push(new Textbox());
        this.tables.push(new Table());
        this.sections.push(new Section());
    }
}

export class Header{
    companyName: string;
    address: string;
    businessUnit:string;
    logo: string;
    reportTitle: string; 
  }

export class Textbox{
    Title: string;
    Body:string;
  }


  export class Table {
    tableName: string;
    tableFields: TableField[] = [new TableField()];
    Details: string;
    constructor(tableName?: string, tableFields?: TableField[], details?: string) {
        this.tableName = tableName || '';
        this.tableFields = tableFields || [new TableField()];
        this.Details = details || '';
      }
  }
  export class TableField{
    fieldName: string = ''; // Add the fieldName property with a default value of ''
    field: string[] = [''];
}

export class Section{
  sectionName: string;
  sectionFields: sectionField[];
  
  constructor(sectionName?: string, sectionFields?: sectionField[]) {
    this.sectionName = sectionName || '';
    this.sectionFields = sectionFields || [];
  }
}



  export class sectionField{
    field: string=' ';
    fieldValue: string=' '; 
  }
