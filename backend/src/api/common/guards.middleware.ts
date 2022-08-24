import { NextFunction, Response } from "express";
import { getProjectsCollection } from "../../lib/db/connector";

export const projectOwnerGuard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.status(401).json({ msg: "unauthorized access" });
  const name = req.project;
  const Projects = await getProjectsCollection();
  const exists = await Projects.findOne({ name });
  if (!exists) return res.status(404).json({ msg: "project does not exists!" });
  if (exists.user_id.toString() !== req.user._id.toString())
    return res.status(401).json({ msg: "no access!" });
  return next();
};
