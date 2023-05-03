import { Component } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';



@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.css']
})

export class AppComponent {
 title = 'TODOapp';
 arrayDeTarefas: Tarefa[] = [];
 apiURL : string;
 usuarioLogado = false;
 tokenJWT = '{ "token":""}';
 constructor(private http: HttpClient) {
 this.apiURL = 'https://todoapp-api-nine.vercel.app';
 this.READ_tarefas();
 }

 CREATE_tarefa(descricaoNovaTarefa: string) {
  const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
  var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
  this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa, { 'headers': idToken }).subscribe(
  resultado => { console.log(resultado); this.READ_tarefas(); this.usuarioLogado = true },
  (error) => { this.usuarioLogado = false });
 }

 READ_tarefas() {
  const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
  this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`, { 'headers': idToken }).subscribe(
  (resultado) => { this.arrayDeTarefas = resultado; this.usuarioLogado = true },
  (error) => { this.usuarioLogado = false }
  )
 }
 

 UPDATE_tarefa(tarefaAserModificada: Tarefa) {
  const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
  var indice = this.arrayDeTarefas.indexOf(tarefaAserModificada);
  var id = this.arrayDeTarefas[indice]._id;
  this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`,
  { 'headers': idToken }).subscribe(
  resultado => { console.log(resultado); this.READ_tarefas(); this.usuarioLogado = true },
  (error) => { this.usuarioLogado = false }
  )
}
 

 DELETE_tarefa(tarefaAserRemovida: Tarefa) {
  const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
  var indice = this.arrayDeTarefas.indexOf(tarefaAserRemovida);
  var id = this.arrayDeTarefas[indice]._id;
  this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`,{ 'headers': idToken }).subscribe(
  resultado => { console.log(resultado); this.READ_tarefas(); this.usuarioLogado = true },
  (error) => { this.usuarioLogado = false }
  )
}
 
  login(username: string, password: string) {
    console.log("a")
    var credenciais = { "nome": username, "senha": password }
    this.http.post(`${this.apiURL}/api/login`, credenciais).subscribe(resultado => {
    this.tokenJWT = JSON.stringify(resultado);
    this.READ_tarefas();;
    });
   }

}

 
 



