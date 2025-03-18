import { Routes } from '@angular/router';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';

// export const routes: Routes = [
//   { path: '', redirectTo: '/scanner', pathMatch: 'full' },
//   { path: 'scanner', component: QrScannerComponent },
// ];

export const routes: Routes = [
  // Redirigir la ruta raíz a /scanner?type=entrada
  {
    path: '',
    redirectTo: 'scanner?type=entrada',
    pathMatch: 'full',
  },
  // Ruta para el scanner
  {
    path: 'scanner',
    component: QrScannerComponent,
  },
  // Ruta comodín para manejar rutas no encontradas
  {
    path: '**',
    redirectTo: 'scanner?type=entrada',
  },
];
