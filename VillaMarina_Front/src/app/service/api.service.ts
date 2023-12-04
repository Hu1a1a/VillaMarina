import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UrlApi } from '../env/host.env';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }
  private auth_token = JSON.parse(localStorage.getItem('user') || '{}');
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.auth_token?.authorisation?.token}`,
    "referrerPolicy": "unsafe_url"
  });

  async getReserva(): Promise<any> {
    const options = {
      headers: this.headers,
    };
    return await firstValueFrom(this.http.get(`${UrlApi}Reserva/`, options)).catch((err) => null);
  }
  async getDate(): Promise<any> {
    const options = {
      headers: this.headers,
    };
    return await firstValueFrom(this.http.get(`${UrlApi}Reserva/Now`, options)).catch((err) => null);
  }
  async postToken(login: string, password: string): Promise<any> {
    const data = {
      login,
      password,
    };
    const options = {
      headers: this.headers,
    };
    return await firstValueFrom(this.http.post(`${UrlApi}Login/postToken`, data, options)).catch((err) => null);
  }
  async getConfig(): Promise<any> {
    const options = {
      headers: this.headers,
    };
    return await firstValueFrom(this.http.get(`${UrlApi}Config/Get`, options)).catch((err) => null);
  }
}
