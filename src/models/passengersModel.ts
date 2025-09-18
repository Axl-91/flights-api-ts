import prisma from "../db";

export interface BoardingPass {
  boarding_pass_id: number,
  purchase_id: number,
  seat_type_id: number,
  seat_id: number | null,
  passenger: PassengerAux
}

export interface PassengerAux {
  passenger_id: number;
  dni: string;
  name: string;
  age: number;
  country: string;
}

export type Passenger =
  PassengerAux & Omit<BoardingPass, 'passenger'>;

export interface SeatType {
  seat_type_id: number;
}

// Get all the passengers on flight_id that belongs to the seat_type_id
export async function getPassengersFromFlightWithType(
  flightId: string,
  seatsTypeId: number,
) {
  try {
    const queryResult: BoardingPass[] = await prisma.boardingPass.findMany({
      where: {
        flight_id: Number(flightId),
        seat_type_id: seatsTypeId,
      },
      select: {
        boarding_pass_id: true,
        purchase_id: true,
        seat_type_id: true,
        seat_id: true,
        passenger: {
          select: {
            passenger_id: true,
            dni: true,
            name: true,
            age: true,
            country: true,
          },
        },
      },
    });

    const passengers: Passenger[] = queryResult.map(bp => ({
      boarding_pass_id: bp.boarding_pass_id,
      purchase_id: bp.purchase_id,
      seat_type_id: bp.seat_type_id,
      seat_id: bp.seat_id,
      ...bp.passenger,
    }));

    return passengers
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get all seat_type_id from the passengers on flight_id
export async function getAllSeatTypesIdsFromPassengers(flightId: string) {
  try {
    const passengers: SeatType[] = await prisma.boardingPass.findMany({
      where: { flight_id: Number(flightId) },
      distinct: ['seat_type_id'],
      orderBy: { seat_type_id: 'asc' },
      select: { seat_type_id: true }
    })

    return passengers;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
