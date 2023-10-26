import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlApi } from '../env/host.env';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class StripeService {
  constructor(private http: HttpClient) { }
  headers = new HttpHeaders().append('Content-Type', 'application/json');
  async CreatePaySession(InicialDay: number, FinalDay: number): Promise<any> {
    return await firstValueFrom(this.http.post<any>(`${UrlApi}Pago/PaySession`, { Inicial: InicialDay, Final: FinalDay, }, { headers: this.headers })).catch((err) => err);
  }
  async getPaying(): Promise<any> {
    return await firstValueFrom(this.http.get<any>(`${UrlApi}Pago/Paying`)).catch((err) => err);
  }
  async getExpire(pay: any): Promise<any> {
    return await firstValueFrom(this.http.post<any>(`${UrlApi}Pago/Expire`, { Url: pay, }, { headers: this.headers })).catch((err) => err);
  }
  async getCheck(pay: any): Promise<any> {
    return await firstValueFrom(this.http.post<any>(`${UrlApi}Pago/Check`, { Url: pay, }, { headers: this.headers })).catch((err) => err);
  }
}
