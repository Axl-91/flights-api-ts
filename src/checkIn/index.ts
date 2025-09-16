import { getAllSeatTypesIdsFromPassengers, getPassengersFromFlightWithType } from "../models/passengersModel.js"
import { assignPassengers } from "./assignSeats.js";
import { groupByPurchase, sortGroupedPassengers } from "./passengers.js";
import { createSeatsMap } from "./seatsMap.js";

// Given a flight and an airplaine it will simulate the seat assignments for all passengers
export async function simulateCheckIn(flightId, airplaneId) {
  let passengersWithSeats = []
  let seatTypesIds =
    (await getAllSeatTypesIdsFromPassengers(flightId))
      .map(st => st.seat_type_id)

  for (const seatTypeId of seatTypesIds) {
    // Get Passengers for flight and with the correspondat seat type
    const passengers = await getPassengersFromFlightWithType(flightId, seatTypeId)
    // Group the passengers by their purchase id
    const groupedPassengers = groupByPurchase(passengers)
    // Sort this passengers
    const sortedPassengers = sortGroupedPassengers(groupedPassengers)
    // Create list for all seats for an easily assignment
    const seatsMap = await createSeatsMap(passengers, airplaneId, seatTypeId)

    const passengersAssigned = assignPassengers(sortedPassengers, seatsMap)

    passengersWithSeats.push(...passengersAssigned)
  }
  return passengersWithSeats
}
