import { Component, OnInit } from '@angular/core';
import { StripeService } from 'src/app/service/stripe.service';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css'],
})
export class CancelComponent implements OnInit {
  constructor(private pay: StripeService) { }
  payUrl = '';
  async ngOnInit() {
    this.payUrl = localStorage.getItem('payUrl');
    const Expire = await this.pay.getExpire(this.payUrl)
    if (Expire) localStorage.removeItem('payUrl')
  }
}
