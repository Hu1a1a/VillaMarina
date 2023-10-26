import { Component } from '@angular/core';
import { StripeService } from 'src/app/service/stripe.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent {
  constructor(private pay: StripeService) { }
  payUrl = '';
  payStatus: any = { mensaje: 'erronea!' };
  loading = true;
  initialDay: Date;
  finalDay: Date;
  async ngOnInit() {
    this.payUrl = localStorage.getItem('payUrl');
    this.payStatus = await this.pay.getCheck(this.payUrl)
    console.log(this.payStatus)
    if (this.payStatus.date) {
      this.initialDay = new Date(
        new Date(
          Date.UTC(1900, 0, 1) +
          this.payStatus.date[0] * 24 * 60 * 60 * 1000
        )
      );
      this.finalDay = new Date(
        new Date(
          Date.UTC(1900, 0, 1) +
          this.payStatus.date[this.payStatus.date.length - 1] * 24 * 60 * 60 * 1000
        )
      );
      if (this.payStatus.mensaje === 'realizado!') {
        localStorage.removeItem('payUrl');
      }
    }
    this.loading = false;
  }
}
