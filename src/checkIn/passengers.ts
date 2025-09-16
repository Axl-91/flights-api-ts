import { Passenger } from "../models/passengersModel";

// Function to group passengers by their purchase_id
export function groupByPurchase(passengers: Passenger[]) {
  const groupedPassengers =
    passengers.reduce((groups: Record<number, Passenger[]>, p: Passenger) => {
      if (!groups[p.purchase_id]) {
        groups[p.purchase_id] = [];
      }
      groups[p.purchase_id].push(p);
      return groups;
    }, {});

  // Transform into an array and sort the groups to have biggest on top
  const arrayGroupedPassengers =
    Object.values(groupedPassengers)
      .sort((a: Passenger[], b: Passenger[]) => b.length - a.length)

  return arrayGroupedPassengers
}

// Sort the grouped seats in the following format
// 1. Groups with assigned seats (with kids)
// 2. Groups with assigned seats (without kids)
// 3. Groups without assigned seats (with kids)
// 4. Groups without assigned seats (without kids)
export function sortGroupedPassengers(passengersGrouped: Passenger[][]) {
  let fixedGroupsWithKids: Passenger[][] = []
  let fixedGroupsWithoutKids: Passenger[][] = []
  let freeGroupsWithKids: Passenger[][] = []
  let freeGroupsWithoutKids: Passenger[][] = []

  for (const group of passengersGrouped) {
    if (group.some(p => p.seat_id)) {
      if (group.some(p => p.age < 18))
        fixedGroupsWithKids.push(group)
      else
        fixedGroupsWithoutKids.push(group)
    } else {
      if (group.some(p => p.age < 18))
        freeGroupsWithKids.push(group)
      else
        freeGroupsWithoutKids.push(group)
    }
  }

  const sortedPassengers = [
    ...fixedGroupsWithKids,
    ...fixedGroupsWithoutKids,
    ...freeGroupsWithKids,
    ...freeGroupsWithoutKids
  ]

  return sortedPassengers
}

