import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, ZXingScannerModule, DatePipe],
  templateUrl: './qr-scanner.component.html', //  './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.css',
})
export class QrScannerComponent implements OnInit {
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | undefined;
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  qrResultString: string = '';
  scannerEnabled: boolean = true;
  lastScannedCode: string = '';
  scanHistory: { code: string; timestamp: Date }[] = [];
  isBrowser: boolean;

  showToast = false;
  toastMessage = '';
  scanType: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.router.url === '/' || this.router.url === '') {
      this.router.navigate(['/scanner'], {
        queryParams: { type: 'entrada' },
      });
    }

    this.route.queryParams.subscribe((params) => {
      this.scanType = params['type'] || '';
      console.log('Tipo de escaneo:', this.scanType);

      // Opcional: Puedes mostrar un toast con el tipo recibido
      if (this.scanType) {
        this.showToastMessage(`Modo de escaneo: ${this.scanType}`);
      }
    });
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    // Selecciona automáticamente la primera cámara disponible
    if (devices && devices.length > 0) {
      this.currentDevice = devices[0];
    }
  }

  onCodeResult(resultString: string): void {
    if (this.lastScannedCode !== resultString) {
      this.qrResultString = resultString;
      this.lastScannedCode = resultString;
      this.scanHistory.push({
        code: resultString,
        timestamp: new Date(),
      });
    }
  }

  onDeviceSelectChange(selectedValue: string): void {
    const device = this.availableDevices.find(
      (device) => device.deviceId === selectedValue
    );
    if (device) {
      this.currentDevice = device;
    }
  }

  toggleScanner(): void {
    this.scannerEnabled = !this.scannerEnabled;
  }

  clearHistory(): void {
    this.scanHistory = [];
  }

  lugarSeleccionado: string = 'PRINCIPAL';

  // Método para manejar el cambio de lugar
  onLugarChange(lugar: string): void {
    this.lugarSeleccionado = lugar;
    console.log('Lugar seleccionado:', lugar);
    // Aquí puedes agregar lógica adicional según el lugar seleccionado
  }

  regresar(): void {
    // Aquí puedes añadir la lógica para volver a la pantalla anterior
    console.log('Regresando a la pantalla anterior');
    // Si estás usando Router, puedes navegar a otra página:
    // this.router.navigate(['/home']);
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  hideToast() {
    this.showToast = false;
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.hideToast();
    }, 3000);
  }
}
