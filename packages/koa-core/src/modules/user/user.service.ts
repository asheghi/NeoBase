import { UserRepository } from "./user.repository";

export class UserService{
    repository: UserRepository;

    constructor(repository: UserRepository){
        this.repository = repository;
    }

    getUsers(){
        return  this.repository.getUsers();
    }
}