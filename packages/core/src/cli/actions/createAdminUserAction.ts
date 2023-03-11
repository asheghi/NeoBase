import { getAuthCollection } from "../../lib/db-connector";
import { getAuthService } from "../../features/user/apis/auth/auth.service";
import { getLogger } from "../../lib";

const log = getLogger("create-admin");
interface ICreateAdminUserArg {
  username: string;
  password: string;
}
export const createAdminUserAction = async ({
  username,
  password,
}: ICreateAdminUserArg) => {
  const service = await getAuthService();
  const role = "admin";
  try {
    await service.createUser(username, password, role);
    console.log("Successfully created Admin user".toUpperCase());
    console.log("username:", username);
    console.log("password:", password);
    console.log("role:", role);
  } catch (e) {
    log.error("failed to create admin user");
    log.error("username:", username, "password:", password);
    log.error(e);
  }
};
