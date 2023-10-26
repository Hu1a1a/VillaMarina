import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { StripeService } from 'src/app/service/stripe.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css'],
})
export class ReservaComponent implements OnInit {
  Today = new Date();
  minDay = 0;
  maxDay = 99999;

  CalendarYear = this.Today.getFullYear();
  CalendarMonth = this.Today.getMonth();

  SelectedYear = this.Today.getFullYear();
  SelectedMonth = this.Today.getMonth();
  SelectedDay: number | null = null;
  SelectedYear2 = this.Today.getFullYear();
  SelectedMonth2 = this.Today.getMonth();
  SelectedDay2: number | null = null;

  payUrl!: string;
  config!: any;

  MonthNames = [
    'Ene.',
    'Feb.',
    'Mar.',
    'Abr.',
    'May.',
    'Jun.',
    'Jul.',
    'Ago.',
    'Sep.',
    'Oct.',
    'Nov.',
    'Dic.',
  ];
  MonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  CalendarDay: Array<Array<number>> = [];
  FirstClick = true;

  ReservadoDay: Array<number> = [];
  PayingDaiy: Array<number> = [];
  ReservadoMensaje = false;
  ReservadoMensaje30 = false;
  isLoading: boolean = false

  constructor(private api: ApiService, private pay: StripeService) { }

  async ngOnInit() {
    this.isLoading = true
    this.Calendar();
    this.payUrl = localStorage.getItem('payUrl');
    this.config = await this.api.getConfig();
    const nowDate = await this.api.getDate();
    if (nowDate) {
      this.Today = new Date(
        new Date(nowDate).getTime() +
        new Date(nowDate).getTimezoneOffset() * 60000
      );
      this.CalendarYear = this.Today.getFullYear();
      this.CalendarMonth = this.Today.getMonth();
      this.SelectedYear = this.Today.getFullYear();
      this.SelectedMonth = this.Today.getMonth();
      this.SelectedYear2 = this.Today.getFullYear();
      this.SelectedMonth2 = this.Today.getMonth();
      const Reserva = await this.api.getReserva();
      if (Reserva) {
        for (const item of Reserva) {
          this.ReservadoDay.push(parseFloat(item.Date));
        }
        this.minDay = this.GetDay(
          this.Today.getFullYear(),
          this.Today.getMonth(),
          this.Today.getDate()
        );
        this.maxDay = this.minDay + 180;
        let Paying = await this.pay.getPaying();
        if (Paying) {
          this.CheckPaying(Paying);
          setInterval(async () => {
            Paying = await this.pay.getPaying();
            this.CheckPaying(Paying);
          }, 5 * 60 * 1000);
        }
      }
    }
    this.isLoading = false
  }

  Calendar() {
    this.CalendarDay = [];
    let TotalLastMonthDay = new Date(
      this.CalendarYear,
      this.CalendarMonth,
      0
    ).getDate();
    let TotalThisMonthDay = new Date(
      this.CalendarYear,
      this.CalendarMonth + 1,
      0
    ).getDate();
    let StartWeek = new Date(this.CalendarYear, this.CalendarMonth, 1).getDay();
    let EndWeek = new Date(
      this.CalendarYear,
      this.CalendarMonth + 1,
      1
    ).getDay();
    for (
      var i = TotalLastMonthDay - StartWeek + 1;
      i <= TotalLastMonthDay;
      i++
    ) {
      this.CalendarDay.push([i, this.CalendarMonth - 1, this.CalendarYear]);
    }
    for (var i = 1; i <= TotalThisMonthDay; i++) {
      this.CalendarDay.push([i, this.CalendarMonth, this.CalendarYear]);
    }
    for (var i = 1; i <= 7 - EndWeek; i++) {
      this.CalendarDay.push([i, this.CalendarMonth + 1, this.CalendarYear]);
    }
  }

  SelectDay(item: Array<number>) {
    if (!this.SelectedDay) {
      this.SelectedYear = item[2];
      this.SelectedYear2 = item[2];
      this.SelectedMonth = item[1];
      this.SelectedMonth2 = item[1];
      this.SelectedDay = item[0];
      this.SelectedDay2 = item[0];
    }
    if (this.FirstClick) {
      this.SelectedDay = item[0];
      this.SelectedMonth = item[1];
      this.SelectedYear = item[2];
    } else {
      this.SelectedDay2 = item[0];
      this.SelectedMonth2 = item[1];
      this.SelectedYear2 = item[2];
    }
    const InitialDay = this.GetDay(
      this.SelectedYear,
      this.SelectedMonth,
      this.SelectedDay || 1
    );
    const FinalDay = this.GetDay(
      this.SelectedYear2,
      this.SelectedMonth2,
      this.SelectedDay2 || 1
    );
    this.ReservadoMensaje = false;
    this.ReservadoMensaje30 = false;
    for (const item of this.ReservadoDay) {
      if (
        (InitialDay <= item && FinalDay >= item) ||
        (InitialDay >= item && FinalDay <= item)
      ) {
        this.SelectedDay = null;
        this.SelectedDay2 = null;
        this.ReservadoMensaje = true;
        break;
      }
    }
    for (const item of this.PayingDaiy) {
      if (
        (InitialDay <= item && FinalDay >= item) ||
        (InitialDay >= item && FinalDay <= item)
      ) {
        this.SelectedDay = null;
        this.SelectedDay2 = null;
        this.ReservadoMensaje30 = true;
        break;
      }
    }
    if (
      InitialDay <= this.minDay ||
      FinalDay <= this.minDay ||
      InitialDay >= this.maxDay ||
      FinalDay >= this.maxDay
    ) {
      this.SelectedDay = null;
      this.SelectedDay2 = null;
      this.ReservadoMensaje = true;
    }

    if (
      this.SelectedYear < this.SelectedYear2 ||
      this.SelectedMonth < this.SelectedMonth2 ||
      (this.SelectedDay || 1) < (this.SelectedDay2 || 1)
    ) {
      const day = this.SelectedDay;
      const month = this.SelectedMonth;
      const year = this.SelectedYear;
      this.SelectedDay = this.SelectedDay2;
      this.SelectedMonth = this.SelectedMonth2;
      this.SelectedYear = this.SelectedYear2;
      this.SelectedDay2 = day;
      this.SelectedMonth2 = month;
      this.SelectedYear2 = year;
    } else {
      this.FirstClick = !this.FirstClick;
    }
  }

  GetDay(year: number, month: number, day: number | null): number {
    if (day) {
      for (var i = 0, monthday = 0; i < month; i++) {
        monthday = monthday + this.MonthDays[i];
      }
      return Math.round(
        (year - 1900) * 365 + (year - 1900) / 4 + monthday + day - 2
      );
    }
    return 0;
  }

  PayError = false;
  async CreatePay() {
    this.isLoading = true
    if (this.payUrl) {
      const Expire = await this.pay.getExpire(this.payUrl);
      if (Expire) {
        localStorage.removeItem('payUrl');
        this.payUrl = '';
        this.PayError = false;
      } else {
        this.PayError = true;
      }
    }
    const FinalDay = this.GetDay(
      this.SelectedYear,
      this.SelectedMonth,
      this.SelectedDay
    );
    const InicialDay = this.GetDay(
      this.SelectedYear2,
      this.SelectedMonth2,
      this.SelectedDay2
    );
    const PaySession = await this.pay.CreatePaySession(InicialDay, FinalDay);
    if (PaySession) {
      if (PaySession.url) {
        this.payUrl = PaySession.url;
        localStorage.setItem('payUrl', PaySession.url);
        window.location.href = PaySession.url;
      } else {
        this.PayError = true;
      }
      const Paying = await this.pay.getPaying();
      if (Paying) {
        this.CheckPaying(Paying);
      }
    } else {
      this.PayError = true;
    }
    this.isLoading = false
  }

  async CancelarPay() {
    this.isLoading = false
    const Expire = await this.pay.getExpire(this.payUrl);
    if (Expire) {
      localStorage.removeItem('payUrl');
      this.payUrl = '';
      window.location.reload();
    }
    this.isLoading = true
  }

  CheckPaying(res: any) {
    for (const item of res) {
      if (
        this.minDay * 24 * 60 +
        this.Today.getHours() * 60 +
        this.Today.getMinutes() <=
        item.ExpireDate * 24 * 60 + item.ExpireHour * 60 + item.ExpireMin
      ) {
        this.PayingDaiy.push(parseFloat(item.Date));
      }
    }
  }
}
