import prisma from "../db";

export type Seat = {
  seat_id: number;
  seat_column: string;
  seat_row: number;
};

export type RowSeat = {
  seat_id: number;
  occupied: boolean;
};

export type SeatsByRow = {
  row: number;
  seats: (RowSeat | null)[];
  quantity: number;
};

export type SeatType = {
  seat_type_id: number;
};

// Get all the seats from the selected airplane_id and seat_type_id
export async function getSeatsFromAirplane(airplaneId: number, typeId: number) {
  const seats: Seat[] = await prisma.seat.findMany({
    where: {
      airplane_id: airplaneId,
      seat_type_id: typeId,
    },
    orderBy: [{ seat_column: "asc" }, { seat_row: "asc" }],
    select: {
      seat_id: true,
      seat_column: true,
      seat_row: true,
    },
  });
  return seats;
}

// Get all seat_type_id on flight_id
export async function getSeatTypesFromFlight(flightId: string) {
  const seatTypes: SeatType[] = await prisma.boardingPass.findMany({
    where: { flight_id: Number(flightId) },
    distinct: ["seat_type_id"],
    orderBy: { seat_type_id: "asc" },
    select: { seat_type_id: true },
  });

  return seatTypes;
}
