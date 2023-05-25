import { Context, Next } from 'koa';
import Router from 'koa-router';
import { UserActions } from './user.actions';

export const createUserRouter = async (actions: UserActions) => {
    const router = new Router();

    router.get('/', async (ctx: Context) => {
        const result = await actions.getUsers();
        ctx.body = result;
    });

    return router;
};