import { AccountsService } from "../../api/accounts/accounts.service";
import { AccountsRouter } from "../../api/accounts/accounts.router";
import { superRouter } from "../test-utils";

jest.mock("../../api/accounts/accounts.middleware", () => {
  return {
    authenticateAccountRequest: (req, res, next) => {
      const token = req.headers["x-account-token"];
      if (!token) return next();
      req.user = JSON.parse(token);
      req.user.auth_provider = "account";
      return next();
    },
    accountGuard: (req, res, next) => {
      if (req.user) return next();
      return res.status(401).send();
    },
  };
});

describe("Accounts Router", () => {
  let app;
  beforeEach(() => {
    app = superRouter(AccountsRouter);
    jest
      .spyOn(AccountsService, "register")
      .mockImplementation(async (email: string, password: string) => {
        if (email === "existing@mail.com") throw new Error("existng");
        return { email };
      });
    jest
      .spyOn(AccountsService, "login")
      .mockImplementation(async (email: string, password: string) => {
        if (email !== "valid@email.com") return null;
        return { email };
      });

    jest.spyOn(AccountsService, "generateToken").mockImplementation((user) => {
      return JSON.stringify(user);
    });

    jest
      .spyOn(AccountsService, "findUserByEmail")
      .mockImplementation(async (email) => {
        if (email === "valid@email.com") return { email };
        return null;
      });
  });

  afterAll(async () => {
    await new Promise((resolve: any) => {
      setTimeout(() => {
        return resolve();
      }, 500);
    }); // avoid jest open handle error
  });

  const reqBody = {
    email: "valid@email.com",
    password: "password",
  };

  describe("register", () => {
    describe("given new user with valid params", () => {
      it("should create user and return token", async () => {
        const res = await app.post("/register").send(reqBody);
        const { token } = res.body;
        expect(res.statusCode).toBe(200);
        expect(token).toBeTruthy();
        expect(typeof token).toBe("string");

        expect(AccountsService.register).toBeCalledWith(
          reqBody.email,
          reqBody.password
        );
      });
    });

    describe("given user already registered", () => {
      it("should return 422 error", async () => {
        const res = await app
          .post("/register")
          .send({ ...reqBody, email: "existing@mail.com" });

        expect(res.statusCode).toBe(422);

        expect(AccountsService.register).toBeCalledWith(
          "existing@mail.com",
          reqBody.password
        );
      });
    });

    describe("given invalid request", () => {
      it("should return status 400 with validation errors", (done) => {
        app.post("/register").then((res) => {
          expect(res.statusCode).toBe(400);
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(Object.keys(res.body[0])).toEqual([
            "code",
            "expected",
            "received",
            "path",
            "message",
          ]);
          done();
        });
      });
    });
  });

  describe("login", () => {
    describe("given valid credentials", () => {
      it("should return token", async () => {
        const res = await app.post("/login").send(reqBody);

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toEqual(expect.any(String));

        expect(AccountsService.login).toBeCalledWith(
          reqBody.email,
          reqBody.password
        );
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
  });

  describe("Me", () => {
    describe("given valid jwt", () => {
      it("should return payload", async () => {
        const user = { email: "existing@mail.com" };
        const token = AccountsService.generateToken(user);
        const res = await app.get("/me").set("x-account-token", token);
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
