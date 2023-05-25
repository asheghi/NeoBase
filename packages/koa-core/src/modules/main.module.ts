import { Context, Next } from "koa";
import { Module } from "../types/Module";
import { UserModule } from "./user";

export const mainModule: Module = {
    name: "Main",
    dependencies: [UserModule],
    mount({ app, container, router }) {
        router.get('/', (ctx: Context, next: Next) => {
            ctx.body = 'Hello, World!';
        });
    }
}
