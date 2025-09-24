import { getDirections } from "../common/utils";
import { Passenger } from "../models/passengersModel";
import {
  RowSeat,
  SeatsByRow,
  getSeatsFromAirplane,
} from "../models/seatsModel";

// Check if the seat is assigned to some passenger
function checkOccupied(passengers: Passenger[], seatId: number) {
  return passengers.some((p) => p.seat_id === seatId);
}

// Create an array of seats separated by column and storing the quantity of free seats
export async function createSeatsMap(
  passengers: Passenger[],
  airplaneId: number,
  seatsTypeId: number,
) {
  const seats = await getSeatsFromAirplane(airplaneId, seatsTypeId);
  const grouped: Record<number, SeatsByRow> = {};

  const allColumns = [...new Set(seats.map((seat) => seat.seat_column))].sort();
  const firstCol = allColumns[0].charCodeAt(0);
  const lastCol = allColumns[allColumns.length - 1].charCodeAt(0);

  for (const seat of seats) {
    const row = seat.seat_row;
    const seat_id = seat.seat_id;
    const occupied = checkOccupied(passengers, seat.seat_id);

    if (!grouped[row]) {
      grouped[row] = {
        row,
        seats: [],
        quantity: 0,
      };

      // Fill all positions from first to last column with null
      for (let i = firstCol; i <= lastCol; i++) {
        grouped[row].seats.push(null);
      }
    }

    // Calculate the index position for the column and add it to the seats
    const actualCol = seat.seat_column.charCodeAt(0);
    const columnIndex = actualCol - firstCol;
    grouped[row].seats[columnIndex] = { seat_id: seat_id, occupied: occupied };

    // if the seat is free we increment the quantity
    if (!occupied) grouped[row].quantity++;
  }

  const seatMap = Object.values(grouped).sort((a, b) => a.row - b.row);

  return seatMap;
}

function seatIsFree(index: number, arraySeats: (RowSeat | null)[]) {
  if (index >= 0 && index < arraySeats.length)
    if (arraySeats[index]) return !arraySeats[index].occupied;
  return false;
}

// Given the array of seats from a row it will search for the best seat
// The best seat is the one with the most adjacent unoccupied seats
export function findBestFreeSeat(seats: (RowSeat | null)[]) {
  let bestSeat: RowSeat | null = null;
  let regularFree: RowSeat | null = null;

  for (let i = 0; i < seats.length; i++) {
    const seat = seats[i];

    if (!seat || seat.occupied) continue;
    if (!regularFree) regularFree = seats[i];

    const leftFree = seatIsFree(i - 1, seats);
    const rightFree = seatIsFree(i + 1, seats);

    if (leftFree && rightFree) {
      return seat;
    } else if (leftFree || rightFree) {
      bestSeat = seat;
    }
  }
  bestSeat = bestSeat ? bestSeat : regularFree;
  return bestSeat;
}

// Given a passenger it searchs for it and returns the rown and col where is assigned
export function getRowAndColFromPassenger(
  passenger: Passenger,
  seatsMap: SeatsByRow[],
) {
  const seatAssigned = passenger.seat_id;
  const rowAssigned = seatsMap.findIndex((obj) =>
    obj.seats.some((s) => s && s.seat_id === seatAssigned),
  );
  const colAssigned = seatsMap[rowAssigned].seats.findIndex(
    (s) => s && s.seat_id === seatAssigned,
  );

  return { rowAssigned, colAssigned };
}

// Given a row and column it gets the free seat that is closest to that one
export function getFreeSeat(
  assignedPassengers: Passenger[],
  seatsMap: SeatsByRow[],
) {
  const rowsQuantity = seatsMap.length;
  const colsQuantity = seatsMap[0].seats.length;

  // Expand outward with increasing offset
  for (
    let offset = 1;
    offset < Math.max(rowsQuantity, colsQuantity);
    offset++
  ) {
    const directions = getDirections(offset)
    for (const { dr, dc } of directions) {
      for (const assignedPassenger of assignedPassengers) {
        const { rowAssigned, colAssigned } = getRowAndColFromPassenger(
          assignedPassenger,
          seatsMap,
        );
        const row = rowAssigned + dr;
        const col = colAssigned + dc;

        if (row >= 0 && row < rowsQuantity && col >= 0 && col < colsQuantity) {
          const newSeat = seatsMap[row].seats[col];
          if (newSeat && !newSeat.occupied) {
            seatsMap[row].quantity--;
            newSeat.occupied = true;
            return newSeat.seat_id;
          }
        }
      }
    }
  }
  throw new Error("Flight full")
}

// Search for a seat that is adjacent to the one assigned to a passenger of their group
export function getSeatNextToAdult(
  assignedPassengers: Passenger[],
  seatsMap: SeatsByRow[],
) {
  const seatsQuantity = seatsMap[0].seats.length;
  const adultAssigned = assignedPassengers.filter((p) => p.age > 18);

  // We want directly adjacent so one column at right or one at left
  const adjDirections = [1, -1];

  for (const assignedPassenger of adultAssigned) {
    const { rowAssigned, colAssigned } = getRowAndColFromPassenger(
      assignedPassenger,
      seatsMap,
    );

    for (const direction of adjDirections) {
      const newCol = colAssigned + direction;
      if (newCol >= 0 && newCol < seatsQuantity) {
        const newSeat = seatsMap[rowAssigned].seats[newCol];
        if (newSeat && !newSeat.occupied) {
          seatsMap[rowAssigned].quantity--;
          newSeat.occupied = true;
          return newSeat.seat_id;
        }
      }
    }
  }
}
