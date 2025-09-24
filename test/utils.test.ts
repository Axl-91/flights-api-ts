import { describe, expect, test } from "vitest";
import { getChebyshevDistanceDirs } from "../src/common/utils"

describe("getChebyshevDistanceDirs correct functionality", () => {
  test("getChebyshevDistanceDirs gets all correct directions", () => {
    // Get a random number between 0...100
    const distance = Math.floor(Math.random() * 100)
    const directions = getChebyshevDistanceDirs(distance)

    for (const dir of directions) {
      const maxValue = Math.max(Math.abs(dir.dc), Math.abs(dir.dr))
      expect(maxValue).toStrictEqual(distance)
    }
  })
})
