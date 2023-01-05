import { Response } from "express";
import {
  authenticateUserRequest,
  authGuard,
} from "../../../api/auth/auth.middleware";
import { AuthType, UserType } from "../../../types/user.type";

const user: UserType = {
  email: "valid@mail.com",
  role: "admin",
  _id: "asdf",
  authType: AuthType.User,
};

jest.mock("../../../lib/jwt-utils.ts", () => {
  return {
    extractToken: (token) => {
      if (token === "valid-token") return { email: user.email };
      throw new Error("invalid token");
    },
  };
});

jest.mock("../../../lib/db/connector", () => {
  return {
    getAuthCollection: async () => {
      return {
        findOne: async (filter) => {
          if (filter.email && filter.email === user.email) return user;
          return null;
        },
      };
    },
  };
});

describe("Auth Middlewares", () => {
  describe("AuthenticateRequest", () => {
    describe("given req has no header", () => {
      it("it should call next", () => {
        const req: any = { headers: {}, project: "test" };
        const res = {} as Response;
        const next = jest.fn();
        authenticateUserRequest(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe("given req is already authenticated", () => {
      it("should call next", () => {
        const req: any = {
          user,
          headers: {},
          project: "test",
        };
        const res = {} as Response;
        const next = jest.fn();
        authenticateUserRequest(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe("given the req header is invalid", () => {
      it("it should call next", () => {
        const req: any = {
          headers: {
            "x-auth-token": "invalid-token",
          },
          project: "test",
        };
        const res = {} as Response;
        const next = jest.fn();
        authenticateUserRequest(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe("given the req has valid header", () => {
      it("should call next", async () => {
        const req: any = {
          headers: {
            "x-auth-token": "valid-token",
          },
          project: "test",
        };
        const res = {} as Response;
        const next = jest.fn();
        await authenticateUserRequest(req, res, next);
        // expect(AccountsService.findUserByEmail).toBeCalledWith(user.email);
        expect(req.user).toEqual(user);
        expect(next).toHaveBeenCalled();
      });
    });
  }); // authentiate request
  describe("Guard", () => {
    describe("given requst is authenticated", () => {
      it("should call next", () => {
        const req: any = {
          user,
          project: "test",
        };
        const res: any = {};
        const next = jest.fn();
        authGuard(req, res, next);
        expect(next).toBeCalled();
      });
    });
    describe("given un-authenticated request", () => {
      it("should return 401", () => {
        const req: any = {
          project: "test",
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
        authGuard(req, res, next);
        expect(res.status).toBeCalledWith(401);
        expect(send).toBeCalled();
      });
    });
  });
});
