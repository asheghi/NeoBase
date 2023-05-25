import Application from "koa";
import { Container } from "../container"
import Router from "koa-router";

export type ModuleCallback = (params: { app: Application, container: Container, router: Router}) => (Promise<void> | void);

export type Module = {
    name: string;
    dependencies?: Module[];
    init?: ModuleCallback;
    mount?: ModuleCallback;
}