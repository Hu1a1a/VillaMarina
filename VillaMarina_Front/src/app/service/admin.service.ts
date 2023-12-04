import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlApi } from '../env/host.env';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) { }
  public auth_token = localStorage.getItem('Token') || '';
  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.auth_token,
  });

  setToken(Token: string) {
    this.auth_token = Token;
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": this.auth_token,
    });
  }
  resetToken() {
    localStorage.removeItem('Token')
  }

  async postToken(login: string, password: string): Promise<any> {
    const data = { login, password };
    const options = { headers: this.headers };
    return await firstValueFrom(
      this.http.post(`${UrlApi}Login/PostToken`, data, options)
    ).catch((err) => err);
  }
  async getData(): Promise<any> {
    const options = { headers: this.headers };
    return await firstValueFrom(
      this.http.get(`${UrlApi}Login/Data`, options)
    ).catch((err) => err);
  }
  async postConfig(data: any): Promise<any> {
    const options = { headers: this.headers };
    return await firstValueFrom(
      this.http.post(`${UrlApi}Config/Set`, data, options)
    ).catch((err) => err);
  }
}
