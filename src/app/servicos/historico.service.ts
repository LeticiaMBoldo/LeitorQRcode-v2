import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore'

import { Historico } from '../models/historico';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  constructor(private afs: AngularFirestore) { }

  //Create
  public create(historico: Historico){
    return this.afs.collection('historicos').add({...historico});
  }

  public getAll(){
    return this.afs.collection('historicos').snapshotChanges();
  }

  //atualizar
  public update(key: string, historico: Historico){
    return this.afs.doc('historico/${key}').update(historico);
  }

  //deletar
  public delete(key:string){
    return this.afs.doc('historicos/${key}').delete();
  }
}
