import { describe, expect, test, vi } from "vitest";
import prisma from "../src/__mocks__/db";
import {
  getSeatsFromAirplaneWithSeatType,
  Seat,
} from "../src/models/seatsModel";

vi.mock("../src/db.ts");

describe("getSeatsFromAirplaneWithSeatType correct functionality", () => {
  test("getSeatsFromAirplaneWithSeatType returns the data from the flight", async () => {
    const airplaneId = 1;
    const typeId = 1;

    const seatsData: Seat[] = [
      {
        seat_id: 1,
        seat_column: "A",
        seat_row: 1,
      },
    ];

    // Added 'as any' to bypass schema enforcement
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    prisma.seat.findMany.mockResolvedValue(seatsData as any);

    const response = await getSeatsFromAirplaneWithSeatType(airplaneId, typeId);

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
});

describe("getSeatsFromAirplaneWithSeatType error handling", () => {
  test("getSeatsFromAirplaneWithSeatType returns not found error when no flight is found", async () => {
    const airplaneId = 1;
    const typeId = 1;

    prisma.seat.findMany.mockResolvedValue([]);

    const response = await getSeatsFromAirplaneWithSeatType(airplaneId, typeId);

    expect(response).toEqual([]);
  });

  test("getSeatsFromAirplaneWithSeatType throws the same error if there is an unknown error", async () => {
    const airplaneId = 1;
    const typeId = 1;
    prisma.seat.findMany.mockRejectedValue(new Error("Unknown error"));

    await expect(
      getSeatsFromAirplaneWithSeatType(airplaneId, typeId),
    ).rejects.toThrow("Unknown error");
  });
});
