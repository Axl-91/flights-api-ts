import { getPassengersFromFlight, Passenger } from "../models/passengersModel";
import { getSeatTypesFromFlight, SeatType } from "../models/seatsModel";
import { assignPassengers } from "./assignSeats";
import { groupByPurchase, sortGroupedPassengers } from "./passengers";
import { createSeatsMap } from "./seatsMap";

// Given a flight and an airplaine it will simulate the seat assignments for all passengers
export async function simulateCheckIn(flightId: string, airplaneId: number) {
  const passengersWithSeats: Passenger[] = [];
  const seatTypesIds = (await getSeatTypesFromFlight(flightId)).map(
    (st: SeatType) => st.seat_type_id,
  );

  for (const seatTypeId of seatTypesIds) {
    // Get Passengers for flight and with the correspondat seat type
    const passengers = await getPassengersFromFlight(flightId, seatTypeId);
    // Group the passengers by their purchase id
    const groupedPassengers = groupByPurchase(passengers);
    // Sort this passengers
    const sortedPassengers = sortGroupedPassengers(groupedPassengers);
    // Create list for all seats for an easily assignment
    const seatsMap = await createSeatsMap(passengers, airplaneId, seatTypeId);

    const passengersAssigned = assignPassengers(sortedPassengers, seatsMap);

    passengersWithSeats.push(...passengersAssigned);
  }
  return passengersWithSeats;
}
