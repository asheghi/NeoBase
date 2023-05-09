import express, { NextFunction, Response } from "express";
import multer from "multer";
import { config } from "../../config";
import { s3Client } from "./s3Client";
import fs from "node:fs";
import path from "node:path";
import { getUserFilter } from "../data/documents/access-control";
import { Services } from "../../lib/services";

import { nanoid } from "nanoid";

const uploadDir = path.resolve(config.upload_path);
const upload = multer({ dest: uploadDir });
const app = express.Router();

const canUserDo =
  (operation: string) =>
  async (req: any, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
      req.access_filter = {};
      return next();
    }
    const filter = await getUserFilter({
      req,
      collection: "files",
      operation,
    });

    if (filter) {
      req.access_filter = filter;
      return next();
    }
    return res.status(403).json();
  };

const ensureBucketExists = async (bucketName: string) => {
  const exists = await new Promise((resolve, reject) => {
    s3Client.bucketExists(bucketName, (err, exists) => {
      if (err) {
        reject(err);
      } else {
        resolve(exists);
      }
    });
  });
  if (!exists) {
    await new Promise((resolve, reject) => {
      s3Client.makeBucket(bucketName, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
};
// app.get("/download", (req, res, next) => { });

// todo auth guard

app.get("/download/:objectName", canUserDo("read"), async (req: any, res) => {
  // todo verify id
  if (!req.params.objectName) {
    return res.status(400).json({ msg: "invalid document id" });
  }

  const filter = {
    objectName: req.params.objectName,
    ...(req.access_filter ?? {}),
  };

  const Files = await Services.getFilesCollection();
  const file = await Files.findOne(filter);
  if (!file) {
    return res.status(404).json({
      msg: "not found or you don't have permission to access this file",
    });
  }
  const downloadStream = await s3Client.getObject(
    file.bucketName,
    file.objectName
  );
  res.set("Content-Type", file.mimetype);
  res.set("Content-Length", file.size);

  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });
  downloadStream.on("error", (err) => {
    console.log(err);
    res.sendStatus(500);
  });
  downloadStream.on("end", () => {
    res.end();
  });
});

app.post(
  "/upload/:bucktName?",
  canUserDo("create"),
  upload.any(),
  async (req, res) => {
    if (!req.files) {
      return res.json({ msg: "no files" });
    }

    const bucketName =
      req.params?.bucketName ?? config.s3_bucket_name ?? "main";
    await ensureBucketExists(bucketName);

    const results: { etag: string; versionId: string }[] = await Promise.all(
      (req.files as Express.Multer.File[]).map((file: Express.Multer.File) => {
        return new Promise((resoleve, reject) => {
          const fileStream = fs.createReadStream(
            path.join(uploadDir, file.filename)
          );
          const filename = file.originalname ?? file.fieldname;
          const dotIndex = filename.lastIndexOf(".");
          const objectName =
            filename.substring(0, dotIndex) +
            "-" +
            nanoid() +
            "." +
            filename.substring(dotIndex + 1);

          console.log("objectName", objectName);

          s3Client.putObject(
            bucketName,
            objectName,
            fileStream,
            file.size,
            file,
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resoleve({ ...result, ...file, objectName });
              }
            }
          );
        });
      })
    );

    const Files = await Services.getFilesCollection();

    const documents = await Promise.all(
      results.map(async (result) => {
        const {
          fieldname,
          originalname,
          encoding,
          mimetype,
          filename,
          size,
          etag,
          versionId,
          objectName,
        } = result as any;

        const doc = await Files.create({
          createdBy: (req?.user as any)?.id,
          fieldname,
          originalname,
          encoding,
          mimetype,
          filename,
          size,
          etag,
          versionId,
          bucketName,
          objectName,
        });
        return doc.toObject();
      })
    );

    res.json(documents);

    //delete temp files after upload finished
    ((req?.files ?? []) as Express.Multer.File[]).forEach((file) => {
      fs.unlinkSync(path.join(uploadDir, file.filename));
    });
  }
);

export const StorageApiRouter = app;
