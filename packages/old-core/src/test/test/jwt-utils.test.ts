import {
  comparePassword,
  extractToken,
  hashPassword,
} from "../../lib/jwt-utils";

const validPassword = "valid-password";
const payload = {
  email: "user@mail.com",
  role: "admin",
};
const token = JSON.stringify(payload);

jest.mock("jsonwebtoken", () => {
  return {
    verify(arg: string) {
      return JSON.stringify(arg);
    },
    decode(arg) {
      return JSON.parse(arg);
    },
  };
});

jest.mock("bcryptjs", () => {
  return {
    genSaltSync: () => {
      return "salt";
    },
    hashSync: () => {
      return "hash";
    },
    compareSync: (password, hash) => {
      return hash === "hash" && password === validPassword;
    },
  };
});

describe("JWT Utils", () => {
  describe("hash password function", () => {
    describe("given a valid password", () => {
      it("should return a hash", () => {
        const res = hashPassword(validPassword);
        expect(res).toBe("hash");
      });
    });
    describe("given a invalid password", () => {
      it("should throw error", () => {
        expect(() => {
          hashPassword("");
        }).toThrow();
      });
    });
  });
  describe("compare password function", () => {
    describe("given valid password for hash", () => {
      it("should return true", () => {
        const res = comparePassword("hash", validPassword);
        expect(res).toBe(true);
      });
    });
    describe("given in-valid arguments", () => {
      describe("given password is invalid", () => {
        it("should return false", () => {
          const res = comparePassword("hash", "invalid-passsword");
          expect(res).toBe(false);
        });
      });
      describe("given hash is undefined", () => {
        it("should return false", () => {
          const res = comparePassword(undefined, "invalid-passsword");
          expect(res).toBe(false);
        });
      });
    });
  });

  describe(`extractToken()`, () => {
    describe("given valid token", () => {
      //
      it("should return payload", () => {
        const res = extractToken(token);
        expect(res).toEqual(payload);
      });
    });
  });
});
