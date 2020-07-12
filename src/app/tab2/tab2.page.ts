import { Component } from '@angular/core';
import { HistoricoService } from '../servicos/historico.service';
import { Historico } from '../models/historico';

import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public listaHistoricos: Historico[] = [];

  constructor(private historicoService: HistoricoService) {
    registerLocaleData(localePtBr);
  }

  public buscarHistorico(){
    this.listaHistoricos = [];

    this.historicoService.getAll().subscribe(dados => {
      this.listaHistoricos = dados.map(registro => {
        return{
          $key: registro.payload.doc.id,
          leitura: registro.payload.doc.data()['leitura'],
          dataHora: new Date(registro.payload.doc.data()['dataHora']['seconds']*1000)
        }as Historico;
      });
    });    
  }
  //atualizar os historicos da busca, assim sempre vai estar atualizada
  async ionViewWillEnter() {
    await this.buscarHistorico();
  }

  //deletar um evento
  public deletar(key:string){
    this.historicoService.delete(key);
    this.buscarHistorico();
  }

}
