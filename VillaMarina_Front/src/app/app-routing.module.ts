import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanel } from './env/host.env';
import { ReservaComponent } from './app/reserva/reserva.component';
import { HomeComponent } from './app/home/home.component';
import { SuccessComponent } from './app/reserva/success/success.component';
import { CancelComponent } from './app/reserva/cancel/cancel.component';
import { DescripcionComponent } from './app/descripcion/descripcion.component';
import { CondicionComponent } from './app/condicion/condicion.component';
import { ContactoComponent } from './app/contacto/contacto.component';
import { AdminLoginComponent } from './adminpanel/login/admin-login.component';
import { AdminPanelComponent } from './adminpanel/panel/admin-panel.component';

const routes: Routes = [
  { path: 'Home', component: HomeComponent },
  { path: 'Reserva', component: ReservaComponent },
  { path: 'Descripcion', component: DescripcionComponent },
  { path: 'Pago/Success', component: SuccessComponent },
  { path: 'Pago/Cancel', component: CancelComponent },
  { path: 'Condicion', component: CondicionComponent },
  { path: 'Contacto', component: ContactoComponent },

  { path: 'Panel/' + AdminPanel + '/Login', component: AdminLoginComponent },
  { path: 'Panel/' + AdminPanel + '/Panel', component: AdminPanelComponent },
  {
    path: AdminPanel,
    redirectTo: 'Panel/' + AdminPanel + '/Login',
    pathMatch: 'full',
  },
  {
    path: 'Panel/' + AdminPanel,
    redirectTo: 'Panel/' + AdminPanel + '/Login',
    pathMatch: 'prefix',
  },

  { path: '**', redirectTo: 'Home', pathMatch: 'full' },
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
