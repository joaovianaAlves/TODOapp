export class User{
    _id : string | undefined ;
	username: string;
	password: string;
	admLogado: boolean;

	constructor(_username: string, _password: string, _admLogado: boolean) {
		this.username = _username;
		this.password = _password;
		this.admLogado = _admLogado;
	}
}