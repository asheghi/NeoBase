import Router from "koa-router"
import { Module } from "../../types/Module"
import { UserActions } from "./user.actions"
import { UserRepository } from "./user.repository"
import { createUserRouter } from "./user.router"
import { UserService } from "./user.service"

export const UserModule: Module = {
    name: 'User',
    async init({ container }) {
        const userRepository = await Promise.resolve(new UserRepository)
        const userService = new UserService(userRepository);
        const userActions = UserActions({ userService });
        const userRouter = await createUserRouter(userActions);

        // things we might want to inject later at other points!
        container.register('userRepository', userRepository);
        container.register('userService', userService);
        container.register('userRouter', userRouter);
    },
    mount({ container, router }) {
        const userRouter = container.resolve<Router>('userRouter');
        router.use('/users', userRouter.routes(), userRouter.allowedMethods());
    }
}