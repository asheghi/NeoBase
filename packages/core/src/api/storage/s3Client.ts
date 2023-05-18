import { config } from "../../config";
import * as Minio from "minio";

// todo validate options
const options: Minio.ClientOptions = {
  endPoint: config.s3_endpoint!,
  port: config.s3_port ? +config.s3_port : undefined ?? undefined,
  useSSL: !!config.s3_ssl,
  accessKey: config.s3_access_key!,
  secretKey: config.s3_secret_key!,
};

// todo add validation
export const s3Client = config.s3_access_key
  ? new Minio.Client(options as any)
  : undefined;
