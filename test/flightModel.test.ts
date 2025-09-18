import { describe, expect, test, vi } from "vitest";
import prisma from "../src/__mocks__/db";
import { getFlightData } from "../src/models/flightModel";
import createHttpError from "http-errors";

vi.mock("../src/db.ts");

describe("getFlightData correct functionality", () => {
  test("getFlightData returns the data from the flight", async () => {
    const flightId = "1";

    const flightData = {
      flight_id: 1,
      takeoff_date_time: 20200101,
      takeoff_airport: "Airport 1",
      landing_date_time: 20200101,
      landing_airport: "Airport 2",
      airplane_id: 1,
    };

    prisma.flight.findUnique.mockResolvedValue(flightData);

    const response = await getFlightData(flightId);
    expect(response).toStrictEqual(flightData);
  });
});

describe("getFlightData error handling", () => {
  test("getFlightData returns not found error when no flight is found", async () => {
    prisma.flight.findUnique.mockResolvedValue(null);

    const randomId = Math.floor(Math.random() * 10000).toString();

    await expect(getFlightData(randomId)).rejects.toThrowError(
      createHttpError.NotFound,
    );

    await expect(getFlightData(randomId)).rejects.toMatchObject({
      status: 404,
      message: "{}",
    });
  });

  test('sets message to "could not connect to db" for non-404 HttpError', async () => {
    const dbError = createHttpError(500, "original message");

    prisma.flight.findUnique.mockRejectedValue(dbError);

    const randomId = Math.floor(Math.random() * 10000).toString();

    await expect(getFlightData(randomId)).rejects.toThrowError(
      createHttpError[500],
    );

    await expect(getFlightData(randomId)).rejects.toMatchObject({
      status: 500,
      message: "could not connect to db",
    });
  });

  test("getFlightData throws the same error if there is an unknown error", async () => {
    prisma.flight.findUnique.mockRejectedValue(new Error("Unknown error"));

    await expect(getFlightData("1")).rejects.toThrow("Unknown error");
  });
});
