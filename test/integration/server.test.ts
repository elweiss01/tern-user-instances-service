import request from "supertest";
import { application, shutDown } from "../../src/server";
import { after } from "node:test";

describe("server file", () => {
  afterAll((done) => {
    shutDown(done);
  });

  it("Starts with the proper test enviroment", async () => {
    expect(process.env.NODE_ENV).toBe("test");
    expect(application).toBeDefined();
  }, 10000);

  it("Returns all options allowed to be called by customers (http methods)", async () => {
    const response = await request(application).options("/");

    expect(response.status).toBe(200);
    expect(response.headers["Access-Control-Allow-Methods"]).toBe(
      "PUT, POST, PATCH, DELETE, GET"
    );
  });
});
