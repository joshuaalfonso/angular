

export class User {
    constructor(
        public user_id: string,
        public username: string, 
        private _token: string, 
        private _tokenExpirationDate: Date,
        public usl: string
    ) {}

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}



