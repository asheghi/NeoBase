import express from "express";
import { CollectionsApiRouter } from "./collections/collections.router";
import { DocumentsApiRouter } from "./documents/documents.router";

const app = express.Router();
app.use("/collections", CollectionsApiRouter);
app.use("/documents", DocumentsApiRouter);

export const DataApiRouter = app;
