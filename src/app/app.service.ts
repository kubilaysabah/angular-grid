import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import type Response from './app.interface'

@Injectable({
  providedIn: "root",
})
export class AppService {
  baseURL: string = 'http://localhost:3000/'

  constructor(
    private http: HttpClient
  ) {
  }

  customers(): Observable<Response['dataTable']> {
    return this.http.get<Response['dataTable']>(this.baseURL + "dataTable")
  }
}
