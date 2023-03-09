import { Response } from "express";
import { authGuard } from "lib/authGuard";
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
        const req: any = { headers: {} };
        const res = {} as Response;
        const next = jest.fn();
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
        expect(next).toHaveBeenCalled();
      });
    });

    describe("given the req header is invalid", () => {
      it("it should call next", () => {
        const req: any = {
          headers: {
            "x-auth-token": "invalid-token",
          },
        };
        const res = {} as Response;
        const next = jest.fn();
        expect(next).toHaveBeenCalled();
      });
    });

    describe("given the req has valid header", () => {
      it("should call next", async () => {
        const req: any = {
          headers: {
            "x-auth-token": "valid-token",
          },
        };
        const res = {} as Response;
        const next = jest.fn();
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
        };
        const res: any = {};
        const next = jest.fn();
        authGuard(req, res, next);
        expect(next).toBeCalled();
      });
    });
    describe("given un-authenticated request", () => {
      it("should return 401", () => {
        const req: any = {};
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
