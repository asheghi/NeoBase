import { getProjectsCollection } from "../../lib/db/connector.js";

export const projectOwnerGuard = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "unauthorized access" });
  const name = req.project;
  const Projects = await getProjectsCollection();
  const exists = await Projects.findOne({ name });
  if (!exists) return res.status(422).json({ msg: "project does not exists!" });
  if (exists.user_id.toString() !== req.user._id.toString())
    return res.status(422).json({ msg: "no access!" });
  next();
};
