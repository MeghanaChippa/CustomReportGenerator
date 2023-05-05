import { Injectable } from '@angular/core';
import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MongodbService{
 
  constructor() { }

  public connect() {
   
  }

  public getDocumentDefinition(id:string)
  {
    let stringified=localStorage.getItem(id);
    let document=JSON.parse(stringified) as any;
    return document;

  }
  public saveDocumentDefinition(document:any)
  {
    let id=Date.now()+"";
    localStorage.setItem(id,JSON.stringify(document));

  }
}
