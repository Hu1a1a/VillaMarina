import { Component } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-150%)' }),
        animate('1000ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('1000ms ease-in', style({ transform: 'translateX(150%)' })),
      ]),
    ]),
  ],
})
export class HomeComponent {
  pictureNum = 2;
  pictureSlider = 0;
  Dir = true;
}
