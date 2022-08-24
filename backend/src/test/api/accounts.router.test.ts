import jwt from "jsonwebtoken";
import { AccountsService } from "../../api/accounts/accounts.service";
import { AccountsRouter } from "../../api/accounts/accounts.router";
import { getSupertestFromRoute } from "../test-utils";

jest.mock("../../api/accounts/accounts.middleware", () => {
  return {
    authenticateAccountRequest: jest
      .fn()
      .mockImplementation(async (req, res, next) => {
        const token = req.headers["x-account-token"];
        req.user = JSON.parse(token);
        if (!token) throw new Error(`no token passed`);
        req.user.auth_provider = "account";
        next();
      }),
    accountGuard: jest.fn().mockImplementation((req, res, next) => {
      next();
    }),
  };
});

describe("Accounts Router", () => {
  const app = getSupertestFromRoute(AccountsRouter);
  beforeEach(() => {
    jest
      .spyOn(AccountsService, "register")
      .mockImplementation(async (email: string, password: string) => {
        if (email === "existing@mail.com") return null;
        return { email };
      });
    jest
      .spyOn(AccountsService, "login")
      .mockImplementation(async (email: string, password: string) => {
        if (email === "existing@mail.com") return null;
        return { email };
      });

    jest
      .spyOn(AccountsService, "generateToken")
      .mockImplementation((user) => JSON.stringify(user));

    jest
      .spyOn(AccountsService, "findUserByEmail")
      .mockImplementation(async (email) => {
        if (email === "existing@mail.com") return { email };
        return null;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shout register new account", async () => {
    const payload = {
      email: "sample@email.com",
      password: "password",
    };
    const res = await app.post("/register").send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.token).toBeTruthy();
    expect(typeof res.body.token).toBe("string");

    expect(AccountsService.register).toBeCalledWith(
      payload.email,
      payload.password
    );
  });
  it("shoud validate register params", async () => {
    // todo
  });

  it("shoud login account", async () => {
    const payload = {
      email: "sample@email.com",
      password: "password",
    };
    const res = await app.post("/login").send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.token).toBeTruthy();
    expect(typeof res.body.token).toBe("string");

    expect(AccountsService.login).toBeCalledWith(
      payload.email,
      payload.password
    );
  });

  it("should authenticate user by token", async () => {
    const user = { email: "existing@mail.com" };
    const token = AccountsService.generateToken(user);
    const res = await app.get("/me").set("x-account-token", token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.email).toBe(user.email);
  });
});
