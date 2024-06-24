export class UserService {

    private api_host = "http://localhost:8080";
    public loginUser(username: string): void {
        sessionStorage.setItem('username', username);
    }

    public getUser(): string {
        return sessionStorage.getItem('username');
    }

    public signOut(): void {
        sessionStorage.removeItem('username');
    }
}
