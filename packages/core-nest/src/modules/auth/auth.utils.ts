import bcrypt from "bcryptjs";

export class AuthUtils {
  hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  comparePassword(hash: string, password: string) {
    if (!hash) return false;
    return bcrypt.compareSync(password, hash);
  }
}
