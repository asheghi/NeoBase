export class UserRepository{
    constructor(){
        
    }

    getUsers(){
        return [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
        ]
    }
}