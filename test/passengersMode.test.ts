import { describe, expect, test, vi } from "vitest";
import prisma from "../src/__mocks__/db";
import { getPassengersFromFlight } from "../src/models/passengersModel";
import { Passenger } from "../generated/prisma";

vi.mock("../src/db.ts");

describe("functions correct functionality", () => {
  test("getPassengersFromFlight returns passengers", async () => {
    const flightId = "1";
    const typeId = 1;

    const passengersData: Passenger = {
      passenger_id: 1,
      dni: "1234",
      name: "name",
      age: 20,
      country: "Country",
    };

    const boardingPassData = {
      boarding_pass_id: 1,
      purchase_id: 1,
      seat_type_id: 1,
      seat_id: 1,
      passenger: passengersData,
    };

    const { passenger: _, ...expectedResponse } = {
      ...boardingPassData,
      ...passengersData,
    };

    // Added 'as any' to bypass schema enforcement
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    prisma.boardingPass.findMany.mockResolvedValue([boardingPassData] as any);

    const response = await getPassengersFromFlight(flightId, typeId);

    expect(response).toStrictEqual([expectedResponse]);
  });
});

describe("functions error handling", () => {
  test("getPassengersFromFlight returns empty array if there is nothing", async () => {
    const flightId = "1";
    const typeId = 1;

    prisma.boardingPass.findMany.mockResolvedValue([]);

    const response = await getPassengersFromFlight(flightId, typeId);

    expect(response).toEqual([]);
  });

  test("getPassengersFromFlight throws error if there is one", async () => {
    const flightId = "1";
    const typeId = 1;

    prisma.boardingPass.findMany.mockRejectedValue(new Error("Unknown error"));

    await expect(getPassengersFromFlight(flightId, typeId)).rejects.toThrow(
      "Unknown error",
    );
  });
});
