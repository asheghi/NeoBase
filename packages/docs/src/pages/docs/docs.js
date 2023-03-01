import { ApiDocuments } from "./apis/apis";
import { ClientJavaScript } from "./clients/javascript/client-docs";
import GetStarted from "./get-started";
export const Docs = [...GetStarted, ...ClientJavaScript, ...ApiDocuments];
