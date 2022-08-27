import mongoose from "mongoose";
import { AccountsService } from "../../api/accounts/accounts.service";

const user = {
  email: "existingUser@mail.com",
  password: "password",
  hash: "hash_password",
  _id: new mongoose.Types.ObjectId(),
};

jest.mock("../../lib/jwt-utils", () => {
  return {
    comparePassword: (hash, password) => {
      return password === user.password;
    },
    hashPassword: (password) => password,
    generateTokenForPayload: () => "token",
  };
});

jest.mock("../../lib/db/connector", () => {
  return {
    getAccountCollection: async () => {
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

describe("AccountService", () => {
  describe("login method", () => {
    describe("given an existing email and valid password", () => {
      it("should return user from database", async () => {
        const res = await AccountsService.login(user.email, user.password);
        expect(res).toEqual(user);
      });
    });

    describe("given and invalid password", () => {
      it("should return null", async () => {
        const res = await AccountsService.login(
          user.email,
          `${user.password}-invaliad`
        );
        expect(res).toEqual(null);
      });
    });

    describe("given non-existing email", () => {
      it("should return null", async () => {
        const res = await AccountsService.login(
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
        const email = `new-${user.email}`;
        const res = await AccountsService.register(email, user.password);
        expect(res.email).toBe(email);
        expect(res._id).toBeTruthy();
      });
    });

    describe("given existing payload", () => {
      it("should return user", async () => {
        const failing = async () => {
          await AccountsService.register(user.email, user.password);
        };
        await expect(failing).rejects.toThrow();
      });
    });

    describe("given invalid argument", () => {
      it("should throw error", async () => {
        const failing = async () => {
          await AccountsService.register("not-email", "");
        };
        await expect(failing).rejects.toThrow();
      });
    });
  }); // register

  describe("find user by email", () => {
    describe("given valid email address", () => {
      it("should return user", async () => {
        const res = await AccountsService.findUserByEmail(user.email);
        expect(res).toEqual(user);
      });
    });

    describe("given non-existent email address", () => {
      it("should return null", async () => {
        const res = await AccountsService.findUserByEmail(`not.${user.email}`);
        expect(res).toBe(null);
      });
    });

    describe("given invalid email", () => {
      it("should throw error", async () => {
        const failing = async () => {
          await AccountsService.findUserByEmail("invalid-email");
        };
        await expect(failing).rejects.toThrow();
      });
    });
  }); // find by email
  describe("generateToken", () => {
    describe("given user", () => {
      it("should return jwt token", () => {
        const res = AccountsService.generateToken(user);
        expect(res).toBe("token");
      });
    });
    describe("given invalid user", () => {
      it("should throw", () => {
        const failing = () => {
          AccountsService.generateToken({ email: "" });
        };
        expect(failing).toThrow();
      });
    });
  });
});
