export class User{
    _id : string | undefined ;
	username: string;
	password: string;
	isAdmin: boolean;

	constructor(_username: string, _password: string, _isAdmin: boolean) {
		this.username = _username;
		this.password = _password;
		this.isAdmin = _isAdmin;
	}
}