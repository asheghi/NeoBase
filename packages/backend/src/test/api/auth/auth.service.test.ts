import mongoose from "mongoose";
import { getAuthService } from "../../../api/auth/auth.service";

const user = {
  email: "existingUser@mail.com",
  password: "password",
  hash: "hash_password",
  _id: new mongoose.Types.ObjectId(),
};

jest.mock("../../../lib/jwt-utils", () => {
  return {
    comparePassword: (hash, password) => {
      return password === user.password;
    },
    hashPassword: (password) => password,
    generateTokenForPayload: () => "token",
  };
});

jest.mock("../../../lib/db/connector", () => {
  return {
    getAuthCollection: async () => {
      return {
        findOne: async (query) => {
          if (query.email && query.email === user.email) {
            return user;
          }
          return null;
        },
        create: (arg) => {
          return { ...user, ...arg };
        },
      };
    },
  };
});

describe("AuthService", () => {
  describe("login method", () => {
    describe("given an existing email and valid password", () => {
      it("should return user from database", async () => {
        const AuthService = await getAuthService();
        const res = await AuthService.login(user.email, user.password);
        expect(res).toEqual(user);
      });
    });

    describe("given invalid password", () => {
      it("should return null", async () => {
        const AuthService = await getAuthService();
        const res = await AuthService.login(
          user.email,
          `${user.password}-invaliad`
        );
        expect(res).toEqual(null);
      });
    });

    describe("given non-existing email", () => {
      it("should return null", async () => {
        const AuthService = await getAuthService();
        const res = await AuthService.login(
          "not.existing@mail.com",
          user.password
        );
        expect(res).toEqual(null);
      });
    });
  }); // login

  describe("register", () => {
    describe("given valid, non-existing payload", () => {
      it("should return user", async () => {
        const AuthService = await getAuthService();
        const email = `new-${user.email}`;
        const res = await AuthService.register(email, user.password);
        expect(res.email).toBe(email);
        expect(res._id).toBeTruthy();
      });
    });

    describe("given existing payload", () => {
      it("should return user", async () => {
        const AuthService = await getAuthService();
        const failing = async () => {
          await AuthService.register(user.email, user.password);
        };
        await expect(failing).rejects.toThrow();
      });
    });

    describe("given invalid argument", () => {
      it("should throw error", async () => {
        const AuthService = await getAuthService();
        const failing = async () => {
          await AuthService.register("not-email", "");
        };
        await expect(failing).rejects.toThrow();
      });
    });
  }); // register

  describe("generateToken", () => {
    describe("given user", () => {
      it("should return jwt token", async () => {
        const AuthService = await getAuthService();
        const res = AuthService.generateToken(user);
        expect(res).toBe("token");
      });
    });
    describe("given invalid user", () => {
      it("should throw", async () => {
        const AuthService = await getAuthService();
        const failing = () => {
          AuthService.generateToken({ email: "" });
        };
        expect(failing).toThrow();
      });
    });
  });
});
