import prisma from "../db";

type BoardingPassData = {
  boarding_pass_id: number;
  purchase_id: number;
  seat_type_id: number;
  seat_id: number | null;
};

type BoardingPass = BoardingPassData & { passenger: PassengerData };

type PassengerData = {
  passenger_id: number;
  dni: string;
  name: string;
  age: number;
  country: string;
};

export type Passenger = BoardingPassData & PassengerData;

// Get all the passengers on flight_id that belongs to the seat_type_id
export async function getPassengersFromFlight(
  flightId: string,
  seatsTypeId: number,
): Promise<Passenger[]> {
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

  const passengers: Passenger[] = queryResult.map(
    (bp): Passenger => ({
      boarding_pass_id: bp.boarding_pass_id,
      purchase_id: bp.purchase_id,
      seat_type_id: bp.seat_type_id,
      seat_id: bp.seat_id,
      ...bp.passenger,
    }),
  );

  return passengers;
}
