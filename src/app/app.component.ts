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
	arrayDeUsers: User[] = []
	apiURL : string;
	usuarioLogado = false;
	isAdmin = false;
	showingUsers = false
	isEditing = false
	tokenJWT = '{ "token":"", "isAdmin": false}';

	constructor(private http: HttpClient) {
		this.apiURL = 'https://paginas-nao-encontradas.vercel.app/';
		//this.apiURL = 'http://localhost:3000';
	}

	CREATE_tarefa(_descricaoNovaTarefa: string) {
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var novaTarefa = new Tarefa(_descricaoNovaTarefa, false);
		this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa, { 'headers': idToken }).subscribe(
			resultado => { console.log(resultado); this.READ_tarefas(); this.usuarioLogado = true },
			(error) => { this.usuarioLogado = false, this.isAdmin=false });
	}

	DELETE_tarefa(tarefaAserRemovida: Tarefa){
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var indice = this.arrayDeTarefas.indexOf(tarefaAserRemovida);
 		var id = this.arrayDeTarefas[indice]._id;
 		this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`, { 'headers': idToken }).subscribe(
 		resultado => { console.log(resultado); this.READ_tarefas(); this.usuarioLogado = true },
		 (error) => { this.usuarioLogado = false, this.isAdmin=false });

	}

	READ_tarefas() {
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`, { 'headers': idToken }).subscribe(
		(resultado) => { this.arrayDeTarefas = resultado; this.usuarioLogado = true; if (this.isAdmin) this.READ_USERS },
		(error) => { this.usuarioLogado = false, this.isAdmin=false }
		)
	   }
	   

	UPDATE_tarefa(tarefaAserModificada: Tarefa) {
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var indice = this.arrayDeTarefas.indexOf(tarefaAserModificada);
		var id = this.arrayDeTarefas[indice]._id;
		this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`,
		tarefaAserModificada, { 'headers': idToken }).subscribe(
		resultado => { console.log(resultado); this.READ_tarefas();  this.usuarioLogado = true },
		(error) => { this.usuarioLogado = false, this.isAdmin=false });
	}

	login(username: string, password: string) {
		const CORS = new HttpHeaders().set("Access-Control-Allow-Origin", "*")
		var credenciais = { "username": username, "password": password }
		this.http.post(`${this.apiURL}/api/login`, credenciais).subscribe(resultado => {
		this.tokenJWT = JSON.stringify(resultado);
		this.READ_tarefas();
		if (JSON.parse(this.tokenJWT).isAdmin){
			this.isAdmin = true;
		}
		});
	}

	READ_USERS(){
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		this.http.get<User[]>(`${this.apiURL}/api/getAllUsers`, { 'headers': idToken}).subscribe(
		(resultado) => { this.arrayDeUsers=resultado; this.showingUsers=true; this.usuarioLogado = true },
		(error) => { this.usuarioLogado = false, this.isAdmin=false }
		)
	}

	DELETE_USER(userToRemove: User){
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var indice = this.arrayDeUsers.indexOf(userToRemove);
 		var id = this.arrayDeUsers[indice]._id;
		if (!this.arrayDeUsers[indice].isAdmin)
 		this.http.delete<User>(`${this.apiURL}/api/deleteUser/${id}`, { 'headers': idToken }).subscribe(
 		resultado => { console.log(resultado); this.READ_USERS(); this.usuarioLogado = true },
		 (error) => { this.usuarioLogado = false, this.isAdmin=false });

	}

	CREATE_USER(username: string, password: string) {
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var novaTarefa = new User(username, password, false);
		this.http.post<User>(`${this.apiURL}/api/postUser`, novaTarefa, { 'headers': idToken }).subscribe(
			resultado => { console.log(resultado); this.READ_USERS(); this.usuarioLogado = true },
			(error) => { this.usuarioLogado = false, this.isAdmin=false });
	}

	UPDATE_USER(userToChange: User) {
		const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
		var indice = this.arrayDeUsers.indexOf(userToChange);
		var id = this.arrayDeUsers[indice]._id;
		this.http.patch<User>(`${this.apiURL}/api/updateUser/${id}`,
		userToChange, { 'headers': idToken }).subscribe(
		resultado => { console.log(resultado); this.READ_USERS();  this.usuarioLogado = true },
		(error) => { this.usuarioLogado = false, this.isAdmin=false });
	}

	HIDE_USERS(){
		this.arrayDeUsers = [];
		this.showingUsers = false
	}
	   
	   
}