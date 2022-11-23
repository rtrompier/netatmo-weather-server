export class AuthResponse {
    public access_token!: string;
    public refresh_token!: string;
    public scope!: string[];
    public expires_in!: number;
    public expire_in!: number;
}