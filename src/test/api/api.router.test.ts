import { ApiRouter } from "../../api/api.router";
import { superRouter } from "../test-utils";

describe("Api Router", () => {
  const app = superRouter(ApiRouter);
  it("get health check", async () => {
    const res = await app.get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
  });
});
