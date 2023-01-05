import mongoose from "mongoose";
import { nextTick } from "process";
import { ProjectAuthRouter } from "../../../api/auth/auth.router";
import { AuthType } from "../../../types/user.type";
import { superRouter } from "../../test-utils";

const user = {
  email: "valid@email.com",
  password: "password",
  _id: new mongoose.Types.ObjectId(),
  role: "admin",
};

jest.mock("../../../api/auth/auth.service", () => {
  return {
    getAuthService: async () => {
      //
      return {
        login: async (email, password) => {
          if (email === user.email && password === user.password) return user;
          return null;
        },
        register: async (email, password) => {
          if (email === user.email) throw new Error("existing");
          return { ...user, email };
        },
        generateToken: (arg: { email: string }) => {
          if (arg.email) return "valid-token";
          return "invalid-token";
        },
      };
    },
  };
});

jest.mock("../../../api/auth/auth.middleware", () => {
  return {
    authenticateUserRequest: (req, res, next) => {
      const token = req.headers["x-auth-token"];
      if (!token) return next();
      if (token !== "valid-token") return next();
      req.user = user;
      req.user.authType = AuthType.User;
      return next();
    },
    authGuard: (req, res, next) => {
      if (req.user) return next();
      return res.status(401).send();
    },
  };
});

let app;

describe("Accounts Router", () => {
  beforeEach(() => {
    app = superRouter(ProjectAuthRouter);
  });

  describe("register", () => {
    describe("given new user with valid payload", () => {
      it("should create user and return token", async () => {
        const { email, password } = user;
        const res = await app
          .post("/register")
          .send({ email: `new${email}`, password });
        const { token } = res.body;
        expect(res.statusCode).toBe(200);
        expect(token).toBe("valid-token");
      });

      describe("given user already registered", () => {
        it("should return 422 error", async () => {
          const res = await app
            .post("/register")
            .send({ email: user.email, password: user.password });

          expect(res.statusCode).toBe(422);
        });
      });
    }); // valid payload

    describe("given no payload", () => {
      it("should return validation error", (done) => {
        app.post("/register").then((res) => {
          expect(res.statusCode).toBe(400);
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(Object.keys(res.body[0]).includes("message")).toBeTruthy();
          done();
        });
      });
    }); // no payload

    describe("given invalid payload", () => {
      it("should return validation error", (done) => {
        app
          .post("/register")
          .send({ email: "not_a_email", password: "short" })
          .then((res) => {
            expect(res.statusCode).toBe(400);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(Object.keys(res.body[0]).includes("message")).toBeTruthy();
            done();
          });
      });
    }); // invalid payload
  });

  describe("login", () => {
    describe("given valid credentials", () => {
      it("should return token", async () => {
        const { email, password } = user;
        const res = await app.post("/login").send({ email, password });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBe("valid-token");
      });
      describe("given non-existing email", () => {
        it("should return error 400", async () => {
          const res = await app.post("/login").send({
            email: "non.existing.user@mail.com",
            password: user.password,
          });

          expect(res.statusCode).toBe(400);
        });
      });
    });

    describe("given invalid credentials", () => {
      it("should return 400", async () => {
        const res = await app
          .post("/login")
          .send({ email: "invalid@mail.com", password: "invalidpass" });

        expect(res.statusCode).toBe(400);
      });
    });
  }); // login

  describe("Me", () => {
    describe("given valid jwt", () => {
      it("should return payload", async () => {
        const res = await app.get("/me").set("x-auth-token", "valid-token");
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeTruthy();
        expect(res.body.email).toBe(user.email);
      });
    });

    describe("given invalid jwt", () => {
      it("should return error 401", async () => {
        const res = await app.get("/me");
        expect(res.statusCode).toBe(401);
      });
    });
  });
});
