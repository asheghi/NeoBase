import { getLogger } from "../../lib/getLogger";
import { getAuthService } from "../../api/user/auth/auth.service";

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
