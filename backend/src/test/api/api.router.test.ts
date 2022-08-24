import { ApiRouter } from "../../api/api.router";
import { getSupertestFromRoute } from "../test-utils";

describe("Api Router", () => {
  const app = getSupertestFromRoute(ApiRouter);
  it("get health check", async () => {
    const res = await app.get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
  });
});
