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

  data(): Observable<Response> {
    return this.http.get<Response>(this.baseURL + "dataTable");
  }
}
