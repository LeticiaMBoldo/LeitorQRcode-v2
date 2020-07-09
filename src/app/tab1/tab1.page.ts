import { Component, ChangeDetectorRef } from '@angular/core';

//importar o alert controller
import { AlertController, Platform } from '@ionic/angular';

//Exportar o qrcscanner para criar o qrcode.
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
//importar o screen orientation
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public leitorQrCode : any;

  public content: HTMLElement;
  public imgLogo: HTMLElement;
  public footer: HTMLElement;

  public leitura: string;
  public link = false;

  constructor(
    private qrScanner: QRScanner,
    public alertController: AlertController,
    public platform: Platform,
    private screenOrientation: ScreenOrientation,
    private cdRef: ChangeDetectorRef) 
    {
      
        // set to portrait
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

        this.platform.backButton.subscribeWithPriority(0, () => {

          this.content.style.opacity = '1';
          this.imgLogo.style.opacity = '1';
          this.footer.style.opacity = '1';

          this.leitura = null;
          this.link = false;

          this.qrScanner.hide(); //esconde a camera 
          this.leitorQrCode.unsubscribe(); //para o scanner
        });

    }


  public lerQRCode(){
    // Optionally request the permission early
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        // camera permission was granted
        this.content = document.getElementsByTagName('ion-content')[0] as HTMLElement;
        this.imgLogo = document.getElementById('logo') as HTMLElement;
        this.footer = document.getElementById('footer') as HTMLElement;

        //torna o fundo quase transparente
        this.content.style.opacity = '0';
        this.imgLogo.style.opacity = '0';
        this.footer.style.opacity = '0';
        //chamar a camera
        this.qrScanner.show();

        // start scanning
        this.leitorQrCode = this.qrScanner.scan().subscribe((text: string) => {
          
          this.leitura = (text['result']) ? text['result'] : text;

          //tornar a opacidade de volta ao normal
          this.content.style.opacity = '1';
          this.imgLogo.style.opacity = '1';
          this.footer.style.opacity = '1';

          this.qrScanner.hide(); // hide camera preview
          this.leitorQrCode.unsubscribe(); // stop scanning

          //this.presentAlert('LEITURA: ', this.leitura);
          this.verifivaLink(this.leitura);
          this.cdRef.detectChanges();
        });

      } else if (status.denied) {
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
      }
    })
    .catch((e: any) => console.log('Error is', e));
  }
  
  async presentAlert(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
     header: titulo,
     message: 'this is ana alert message',
     buttons: ['OK']
    });

    await alert.present();
  }

  public verifivaLink(texto: string) {
    const inicio = texto.substring(0, 4);

    if(inicio == 'www.' || inicio == "http"){
      this.link = true;
    } else{
      this.link = false;
    }
  }

}
