import { describe, expect, test, vi } from "vitest";
import prisma from "../src/__mocks__/db";
import {
  getSeatTypesFromFlight,
  getSeatsFromAirplane,
  Seat,
  SeatType,
} from "../src/models/seatsModel";

vi.mock("../src/db.ts");

describe("functions correct functionality", () => {
  test("getSeatsFromAirplane returns the data from the seats", async () => {
    const airplaneId = 1;
    const typeId = 1;

    const seatsData: Seat[] = [
      {
        seat_id: 1,
        seat_column: "A",
        seat_row: 1,
      },
      {
        seat_id: 2,
        seat_column: "B",
        seat_row: 1,
      },
      {
        seat_id: 1,
        seat_column: "C",
        seat_row: 1,
      },
    ];

    // Added 'as any' to bypass schema enforcement
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    prisma.seat.findMany.mockResolvedValue(seatsData as any);

    const response = await getSeatsFromAirplane(airplaneId, typeId);

    expect(response).toStrictEqual(seatsData);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prisma.seat.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: {
          seat_id: true,
          seat_column: true,
          seat_row: true,
        },
      }),
    );
  });

  test("getSeatTypesFromFlight returns the data from the seats type", async () => {
    const flightId = "1";
    const seatTypesData: SeatType[] = [
      { seat_type_id: 1 },
      { seat_type_id: 2 },
      { seat_type_id: 3 },
    ];

    // Added 'as any' to bypass schema enforcement
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    prisma.boardingPass.findMany.mockResolvedValue(seatTypesData as any);

    const response = await getSeatTypesFromFlight(flightId);
    expect(response).toStrictEqual(seatTypesData);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prisma.boardingPass.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: { seat_type_id: true },
      }),
    );
  });
});

describe("functions error handling", () => {
  test("getSeatsFromAirplane returns empty list when there's no seats", async () => {
    const airplaneId = 1;
    const typeId = 1;

    prisma.seat.findMany.mockResolvedValue([]);

    const response = await getSeatsFromAirplane(airplaneId, typeId);

    expect(response).toEqual([]);
  });

  test("getSeatsFromAirplane throws the same error if there is an unknown error", async () => {
    const airplaneId = 1;
    const typeId = 1;
    prisma.seat.findMany.mockRejectedValue(new Error("Unknown error"));

    await expect(getSeatsFromAirplane(airplaneId, typeId)).rejects.toThrow(
      "Unknown error",
    );
  });

  test("getSeatTypesFromFlight returns empty list when there are no seat types", async () => {
    const flightId = "1";

    prisma.boardingPass.findMany.mockResolvedValue([]);

    const response = await getSeatTypesFromFlight(flightId);

    expect(response).toEqual([]);
  });

  test("getSeatTypesFromFlight throws the same error if there is an unknown error", async () => {
    const flightId = "1";

    prisma.boardingPass.findMany.mockRejectedValue(new Error("Unknown error"));

    await expect(getSeatTypesFromFlight(flightId)).rejects.toThrow(
      "Unknown error",
    );
  });
});
