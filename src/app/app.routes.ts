import { Routes } from '@angular/router';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'scanner?type=entrada',
    pathMatch: 'full',
  },
  {
    path: 'scanner',
    component: QrScannerComponent,
  },
  {
    path: '**',
    redirectTo: 'scanner?type=entrada',
  },
];
