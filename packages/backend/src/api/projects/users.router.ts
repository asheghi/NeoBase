import bodyParser from "body-parser";
import Express from "express";
import Mongoose from "mongoose";
import { getAuthCollection } from "../../lib/db/connector";
import { hashPassword } from "../../lib/jwt-utils";

import { authenticateUserRequest, authGuard } from "../auth/auth.middleware";

const app = Express.Router();

// todo add super admin guard
app.use(authenticateUserRequest, authGuard);

app.use(bodyParser.json());

app.get("/", async (req: any, res) => {
  const Users = await getAuthCollection();
  res.json(await Users.find({}, "-password"));
});

app.get("/:uid", async (req: any, res) => {
  const Users = await getAuthCollection();
  const { uid } = req.params;
  if (!uid) return res.status(422).json({ msg: "bad request!" });
  return res.json(
    await Users.findOne({ _id: new Mongoose.Types.ObjectId(uid) }, "-password")
  );
});

app.post("/", async (req: any, res) => {
  const { email, password, ...rest } = req.body;
  const Users = await getAuthCollection();
  const exists = await Users.findOne({ email });
  if (exists) return res.status(422).json({ msg: "user already exists!" });
  const result = await Users.create({
    email,
    ...rest,
    password: hashPassword(password),
  });
  return res.json(result);
});

app.delete("/:uid", async (req: any, res) => {
  const Users = await getAuthCollection();
  const { uid } = req.params;
  const result = await Users.deleteOne({
    _id: new Mongoose.Types.ObjectId(uid),
  });
  res.json(result);
});

app.put("/:uid", async (req: any, res) => {
  const Users = await getAuthCollection();
  const { uid } = req.params;
  const payload = req.body;
  delete payload.password;
  delete payload._id;
  const result = await Users.updateOne(
    { _id: new Mongoose.Types.ObjectId(uid) },
    { $set: payload }
  );
  res.json(result);
});

export const UsersApiRouter = app;
