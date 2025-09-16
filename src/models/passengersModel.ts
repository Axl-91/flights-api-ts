import dbPool from "../db.js";

// Get all the passengers on flight_id that belongs to the seat_type_id
export async function getPassengersFromFlightWithType(flightId, seatsTypeId) {
  try {
    const [passengersData] = await dbPool.execute(
      `SELECT p.*, bp.boarding_pass_id, bp.purchase_id, bp.seat_type_id, bp.seat_id 
            FROM boarding_pass bp
            JOIN passenger p ON bp.passenger_id = p.passenger_id 
            WHERE bp.flight_id = ? AND bp.seat_type_id = ?;`,
      [flightId, seatsTypeId]
    )
    return passengersData
  } catch (err) {
    console.error(err)
    throw err
  }
}

// Get all seat_type_id from the passengers on flight_id
export async function getAllSeatTypesIdsFromPassengers(flightId) {
  try {
    const [passengersData] = await dbPool.execute(
      `SELECT DISTINCT bp.seat_type_id
            FROM boarding_pass bp
            WHERE bp.flight_id = ?
            ORDER BY bp.seat_type_id;`,
      [flightId]
    )
    return passengersData
  } catch (err) {
    console.error(err)
    throw err
  }
}
