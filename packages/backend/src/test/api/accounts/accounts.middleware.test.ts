import { Response } from "express";
import {
  accountGuard,
  authenticateAccountRequest,
} from "../../../api/accounts/accounts.middleware";
import { UserType } from "../../../types/user.type";

const user: UserType = {
  email: "valid@mail.com",
  role: "admin",
  _id: "asdf",
  auth_provider: "account",
};

jest.mock("../../../lib/jwt-utils.ts", () => {
  return {
    extractToken: (token) => {
      if (token === "valid-token") return { email: user.email };
      throw new Error("invalid token");
    },
  };
});

jest.mock("../../../api/accounts/accounts.service.ts", () => {
  return {
    AccountsService: {
      findUserByEmail: async (email) => {
        if (email === user.email) return user;
        return null;
      },
    },
  };
});

describe("Account Middlewares", () => {
  describe("AuthenticateRequest", () => {
    describe("given req has no header", () => {
      it("it should call next", () => {
        const req = { headers: {} };
        const res = {} as Response;
        const next = jest.fn();
        authenticateAccountRequest(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe("given req is already authenticated", () => {
      it("should call next", () => {
        const req: any = {
          user,
          headers: {},
        };
        const res = {} as Response;
        const next = jest.fn();
        authenticateAccountRequest(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe("given the req header is invalid", () => {
      it("it should call next", () => {
        const req: any = {
          headers: {
            "x-account-token": "invalid-token",
          },
        };
        const res = {} as Response;
        const next = jest.fn();
        authenticateAccountRequest(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe("given the req has valid header", () => {
      it("should call next", async () => {
        const req: any = {
          headers: {
            "x-account-token": "valid-token",
          },
        };
        const res = {} as Response;
        const next = jest.fn();
        await authenticateAccountRequest(req, res, next);
        // expect(AccountsService.findUserByEmail).toBeCalledWith(user.email);
        expect(req.user).toEqual(user);
        expect(next).toHaveBeenCalled();
      });
    });
  }); // authentiate request
  describe("Guard", () => {
    describe("given requst is authenticated", () => {
      it("should call next", () => {
        const req = {
          user,
        };
        const res: any = {};
        const next = jest.fn();
        accountGuard(req, res, next);
        expect(next).toBeCalled();
      });
    });
    describe("given un-authenticated request", () => {
      it("should return 401", () => {
        const req = {};
        const send = jest.fn();
        const res: any = {
          status: jest.fn().mockImplementation(() => {
            return {
              send,
            };
          }),
        };
        const next = jest.fn();
        accountGuard(req, res, next);
        expect(res.status).toBeCalledWith(401);
        expect(send).toBeCalled();
      });
    });
    describe("given authenticated with another provide", () => {
      it("should return 401", () => {
        const req = {
          user: {
            ...user,
            auth_provider: `not${user.auth_provider}`,
          },
        };
        const send = jest.fn();
        const res: any = {
          status: jest.fn().mockImplementation(() => {
            return {
              send,
            };
          }),
        };
        const next = jest.fn();
        accountGuard(req, res, next);
        expect(res.status).toBeCalledWith(401);
        expect(send).toBeCalled();
      });
    });
  });
});
