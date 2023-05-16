import { Component } from '@angular/core';
import { Tarefa } from './tarefa';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	title = 'TODOapp';

	arrayDeTarefas: Tarefa[] = [];
	arrayDeUsers: User[] = [];
	apiURL : string;
	usuarioLogado = false;
	admLogado = false;
	Usuarios = false
	Editando = false
	tokenJWT = '{ "token":"", "admLogado": false}';

	constructor(private http: HttpClient) {
		this.apiURL = 'https://todoapp-api-nine.vercel.app';
		//this.apiURL = 'http://localhost:3000';
	}

	/************
    *  Tarefas  *
    *************/

	CREATE_tarefa(_descricaoNovaTarefa: string) {
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var novaTarefa = new Tarefa(_descricaoNovaTarefa, false);
		this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa, { 'headers': idToken }).subscribe(
			resultado => { console.log(resultado); this.READ_tarefas(); this.usuarioLogado = true },
			(error) => { this.usuarioLogado = false, this.admLogado=false });
	}

	READ_tarefas() {
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`, { 'headers': idToken }).subscribe(
		(resultado) => { this.arrayDeTarefas = resultado; this.usuarioLogado = true; if (this.admLogado) this.READ_USERS },
		(error) => { this.usuarioLogado = false, this.admLogado=false }
		)
	   }
	   

	UPDATE_tarefa(tarefaAserModificada: Tarefa) {
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var indice = this.arrayDeTarefas.indexOf(tarefaAserModificada);
		var id = this.arrayDeTarefas[indice]._id;
		this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`,
		tarefaAserModificada, { 'headers': idToken }).subscribe(
		resultado => { console.log(resultado); this.READ_tarefas();  this.usuarioLogado = true },
		(error) => { this.usuarioLogado = false, this.admLogado=false });
	}

	DELETE_tarefa(tarefaAserRemovida: Tarefa){
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var indice = this.arrayDeTarefas.indexOf(tarefaAserRemovida);
 		var id = this.arrayDeTarefas[indice]._id;
 		this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`, { 'headers': idToken }).subscribe(
 		resultado => { console.log(resultado); this.READ_tarefas(); this.usuarioLogado = true },
		 (error) => { this.usuarioLogado = false, this.admLogado=false });

	}

	/***********
    *  Admin  *
    ***********/

	 CREATE_USER(nome: string, senha: string) {
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var novaTarefa = new User(nome, senha, false);
		this.http.post<User>(`${this.apiURL}/api/postUser`, novaTarefa, { 'headers': idToken }).subscribe(
			resultado => { console.log(resultado); this.READ_USERS(); this.usuarioLogado = true },
			(error) => { this.usuarioLogado = false, this.admLogado=false });
	}

	READ_USERS(){
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		this.http.get<User[]>(`${this.apiURL}/api/getAllUsers`, { 'headers': idToken}).subscribe(
		(resultado) => { this.arrayDeUsers=resultado; this.Usuarios=true; this.usuarioLogado = true;},
		(error) => { this.usuarioLogado = false, this.admLogado=false }
		)
	}

	UPDATE_USER(userToChange: User) {
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var indice = this.arrayDeUsers.indexOf(userToChange);
		var id = this.arrayDeUsers[indice]._id;
		this.http.patch<User>(`${this.apiURL}/api/updateUser/${id}`,
		userToChange, { 'headers': idToken }).subscribe(
		resultado => { console.log(resultado); this.READ_USERS();  this.usuarioLogado = true },
		(error) => { this.usuarioLogado = false, this.admLogado=false });
	} 

	DELETE_USER(userToRemove: User){
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var indice = this.arrayDeUsers.indexOf(userToRemove);
 		var id = this.arrayDeUsers[indice]._id;
		if (!this.arrayDeUsers[indice].admLogado)
 		this.http.delete<User>(`${this.apiURL}/api/deleteUser/${id}`, { 'headers': idToken }).subscribe(
 		resultado => { console.log(resultado); this.READ_USERS(); this.usuarioLogado = true },
		 (error) => { this.usuarioLogado = false, this.admLogado=false });

	} 

	/************
    *   Login   *
    *************/
	
	login(nome: string, senha: string) {
		const CORS = new HttpHeaders().set("Access-Control-Allow-Origin", "*")
		var credenciais = { "nome": nome, "senha": senha }
		this.http.post(`${this.apiURL}/api/login`, credenciais).subscribe(resultado => {
		this.tokenJWT = JSON.stringify(resultado);
		this.READ_tarefas();
		if (JSON.parse(this.tokenJWT).admLogado){
			this.admLogado = true;
		}
		});
	}

}
