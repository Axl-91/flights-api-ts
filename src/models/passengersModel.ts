import { RowDataPacket } from "mysql2";
import dbPool from "../db";

export interface Passenger extends RowDataPacket {
  passenger_id: number;
  dni: number;
  name: string;
  age: number;
  country: string;
  boarding_pass_id: number;
  purchase_id: number;
  seat_type_id: number;
  seat_id: number;
}

export interface SeatType extends RowDataPacket {
  seat_type_id: number;
}

// Get all the passengers on flight_id that belongs to the seat_type_id
export async function getPassengersFromFlightWithType(
  flightId: string,
  seatsTypeId: number,
) {
  try {
    const [passengersData] = await dbPool.execute<Passenger[]>(
      `SELECT p.*, bp.boarding_pass_id, bp.purchase_id, bp.seat_type_id, bp.seat_id 
            FROM boarding_pass bp
            JOIN passenger p ON bp.passenger_id = p.passenger_id 
            WHERE bp.flight_id = ? AND bp.seat_type_id = ?;`,
      [flightId, seatsTypeId],
    );
    return passengersData;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get all seat_type_id from the passengers on flight_id
export async function getAllSeatTypesIdsFromPassengers(flightId: string) {
  try {
    const [passengersData] = await dbPool.execute<SeatType[]>(
      `SELECT DISTINCT bp.seat_type_id
            FROM boarding_pass bp
            WHERE bp.flight_id = ?
            ORDER BY bp.seat_type_id;`,
      [flightId],
    );
    return passengersData;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
