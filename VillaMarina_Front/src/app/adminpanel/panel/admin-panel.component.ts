import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
import { AdminPanel } from 'src/app/env/host.env';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  constructor(
    private Admin: AdminService,
    private router: Router,
    private api: ApiService
  ) { }

  token: string = localStorage.getItem('Token') || '';
  msg: string = '';
  Reserva = [];
  Paying = [];
  config: { id: number; Price: number; minDay: number } = { id: null, Price: null, minDay: null, };
  isLoading: boolean = false

  async ngOnInit() {
    this.isLoading = true
    if (this.token) {
      const data = await this.Admin.getData();
      if (data) {
        if (data.msg) this.msg = data.msg;
        else {
          this.Reserva = data.Reserva
            .sort((a: any, b: any) => a.Striper >= b.Striper ? 1 : -1)
            .sort((a: any, b: any) => (a.Date >= b.Date ? 1 : -1));
          this.Paying = data.Paying
            .sort((a: any, b: any) => a.Striper >= b.Striper ? 1 : -1)
            .sort((a: any, b: any) => (a.ExpireMin >= b.ExpireMin ? 1 : -1))
            .sort((a: any, b: any) => (a.ExpireHour >= b.ExpireHour ? 1 : -1))
            .sort((a: any, b: any) => (a.ExpireDate >= b.ExpireDate ? 1 : -1));
          this.config = await this.api.getConfig();
        }
      }
    } else this.router.navigate(['Panel/' + AdminPanel + '/Login']);
    this.isLoading = false
  }

  getDate(day: number) {
    const dt = new Date(1900, 1, 1);
    const dt2 = new Date(dt.setDate(dt.getDate() + day - 31)).toDateString();
    return dt2;
  }

  getDateHour(day: number, hour: number, min: number) {
    const dt = new Date(1900, 1, 1);
    const dt2 = new Date(dt.setDate(dt.getDate() + day - 31)).toDateString();
    return dt2 + ' - ' + hour + ' : ' + min;
  }

  async setConfig() {
    this.isLoading = false
    await this.Admin.postConfig(this.config);
    this.isLoading = true
  }
}
