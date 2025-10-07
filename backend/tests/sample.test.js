const request = require("supertest");
const express = require("express");

const app = express();
app.get("/health", (req, res) => res.status(200).send({ status: "ok" }));

describe("GET /health", () => {
  it("should return status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "ok");
  });
});
