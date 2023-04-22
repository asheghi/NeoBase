import express from "express";
import { AuthApiRouter, ManageUsersApiRouter } from "./auth";

const app = express.Router();

app.use("/auth", AuthApiRouter);
app.use("/manage", ManageUsersApiRouter);
export const UserApiRouter = app;
