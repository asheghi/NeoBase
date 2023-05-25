import express from "express";
import { makeRolesService } from "../../access-control/RolesService";
import bodyParser from "body-parser";
import { Permissions } from "../../access-control/Permissions";
const app = express.Router();

app.use(bodyParser.json());

makeRolesService().then((Service) => {
  app.get("/roles", async (req, res) => {
    const roles = await Service.getRoles();
    res.json(roles);
  });

  app.post("/roles", async (req, res) => {
    const { name, sources } = req.body;
    try {
      const doc = await Service.createRole(name, sources);
      res.json(doc);
    } catch (e: any) {
      res.status(400).json({ msg: e?.message ?? e });
    }
  });

  app.delete("/roles/:role_name", async (req, res) => {
    const result = await Service.deleteRole(req.params.role_name);
    if (!result?.deletedCount) {
      return res.status(404).json(result);
    }
    res.json(result);
  });

  app.post("/roles/:role_id/permissions", async (req, res) => {
    const { role_id } = req.params;
    const { action, resource, filter } = req.body;
    const role = await Service.onRole(role_id).addPermission(
      action,
      resource,
      filter
    );

    return res.json(role);
  });

  app.post("/roles/:role_id/permissions/delete", async (req, res) => {
    const { role_id } = req.params;
    const { action, resource } = req.body;
    const role = await Service.onRole(role_id).removePermission(
      action,
      resource
    );

    return res.json(role);
  });

  app.post("/roles/:role_id/permissions/enable", async (req, res) => {
    const { role_id } = req.params;
    const { action, resource } = req.body;
    const role = await Service.onRole(role_id).enablePermission(
      action,
      resource
    );

    return res.json(role);
  });

  app.post("/roles/:role_id/permissions/disable", async (req, res) => {
    const { role_id } = req.params;
    const { action, resource } = req.body;
    const role = await Service.onRole(role_id).disablePermission(
      action,
      resource
    );

    return res.json(role);
  });

  app.get("/permissions", (req, res) => {
    res.json(
      Object.values(Permissions)
        .reduce((arr: string[], cur) => {
          const object = cur as any;
          const values = Object.values(object) as string[];
          arr.push(...values);
          return arr;
        }, [])
        .map((it) => {
          const [resource, action] = it.split("/");
          return { resource, action };
        })
    );
  });
});

export const AccessControlApiRouter = app;
