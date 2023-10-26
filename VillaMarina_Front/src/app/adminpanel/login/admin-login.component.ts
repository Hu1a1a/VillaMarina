import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import { Router } from '@angular/router';
import { AdminPanel } from 'src/app/env/host.env';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  constructor(
    private Admin: AdminService,
    private router: Router,
  ) { }
  login: string = ''
  password: string = ''
  error: boolean = false
  isLoading: boolean = false
  ngOnInit(): void {
    this.Admin.resetToken()

  }
  async Submit() {
    this.error = false
    this.isLoading = true
    const Token = await this.Admin.postToken(this.login, this.password)
    if (Token.Token) {
      this.Admin.setToken(Token.Token)
      localStorage.setItem("Token", this.Admin.auth_token)
      this.router.navigate(["Panel/" + AdminPanel + '/Panel']);
    } else {
      this.error = true
    }
    this.isLoading = false
  }
}
