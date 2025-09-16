// Function to group passengers by purchase_id
export function groupByPurchase(passengers) {
  let groupedPassengers =
    passengers.reduce((groups, p) => {
      if (!groups[p.purchase_id]) {
        groups[p.purchase_id] = [];
      }
      groups[p.purchase_id].push(p);
      return groups;
    }, {});

  // Transform into an array
  groupedPassengers = Object.values(groupedPassengers)

  //sort the groups to have biggest on top
  groupedPassengers.sort((a, b) => b.length - a.length)
  return groupedPassengers
}

// Sort the grouped seats in the following format
// 1. Groups with assigned seats (with kids)
// 2. Groups with assigned seats (without kids)
// 3. Groups without assigned seats (with kids)
// 4. Groups without assigned seats (without kids)
export function sortGroupedPassengers(passengersGrouped) {
  let fixedGroupsWithKids = []
  let fixedGroupsWithoutKids = []
  let freeGroupsWithKids = []
  let freeGroupsWithoutKids = []

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

