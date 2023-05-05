import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JsonserverService {

  private apiUrl = 'http://localhost:4000/templates';
  private URL=' http://localhost:4000/templateObjects';

  constructor(private http: HttpClient) { }

  

  getTemplateByReportName(reportName: string): Observable<any> {
    const url = `${this.URL}?Templatename=${reportName}`;
    return this.http.get(url);
  }
  
  getAllReportNames(): Observable<string[]> {
    return this.http.get<any[]>(this.URL).pipe(
      map(data => data.map(item => item.Header.reportTitle))
    );
  }
  
 
  addTemplateObject(template: any){
    console.log("Template added at Json Server");
    return this.http.post(this.URL,template)
  }

  getTemplateObject(reportName: string): Observable<any> {
    const url = `${this.URL}`;
    return this.http.get(url).pipe(
      tap((templateObjects: any[]) => console.log(templateObjects)), // add this line to log the response
      map((templateObjects: any[]) => {
        // Find the template object with the matching reportTitle field
        return templateObjects.find(obj => obj.Header.reportTitle === reportName);
      })
    );
  }

  updateTemplateObject(templateId: number, template: any): Observable<any> {
    const url = `${this.URL}/${templateId}`;
    return this.http.put(url, template);
  }

  deleteTemplateObject(templateId: number): Observable<any> {
    const url = `${this.URL}/${templateId}`;
    return this.http.delete(url);
  }
  

}
