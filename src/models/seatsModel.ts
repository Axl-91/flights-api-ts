import prisma from "../db";

export interface Seat {
  seat_id: number;
  seat_column: string;
  seat_row: number;
}

export interface RowSeat {
  seat_id: number;
  occupied: boolean;
}

export interface SeatsByRow {
  row: number;
  seats: (RowSeat | null)[];
  quantity: number;
}

// Get all the seats from the selected airplane_id and seat_type_id
export async function getSeatsFromAirplaneWithSeatType(
  airplaneId: number,
  typeId: number,
) {
  try {
    const seats: Seat[] = await prisma.seat.findMany({
      where: {
        airplane_id: airplaneId,
        seat_type_id: typeId,
      },
      orderBy: [
        { seat_column: 'asc' },
        { seat_row: 'asc' },
      ],
      select: {
        seat_id: true,
        seat_column: true,
        seat_row: true,
      },
    });
    return seats;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
