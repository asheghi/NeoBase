import { UserService } from "./user.service";

export const UserActions = ({ userService }: { userService: UserService }) => ({
    async getUsers() {
        const users = userService.getUsers();
        return users;
    }
});

export type UserActions = ReturnType<typeof UserActions>;