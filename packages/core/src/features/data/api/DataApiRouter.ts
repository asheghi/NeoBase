import express from "express";
import { CollectionsApiRouter } from "./collections/collections.router.js";
import { DocumentsApiRouter } from "./documents/documents.router.js";

const app = express.Router();
app.use("/collections", CollectionsApiRouter);
app.use("/documents", DocumentsApiRouter);

export const DataApiRouter = app;
