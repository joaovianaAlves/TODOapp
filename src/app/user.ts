export class User{
    _id : string | undefined ;
	nome: string;
	senha: string;
	admLogado: boolean;

	constructor(_nome: string, senha: string, _admLogado: boolean) {
		this.nome = _nome;
		this.senha = senha;
		this.admLogado = _admLogado;
	}
}