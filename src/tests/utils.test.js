import { expect, test } from "vitest";
import utils from "../utils.js";

/*
 * Test: getNextId
 */

test("getNextId: empty array returns 1", () => {
  expect(utils.getNextId([])).toBe(1);
});

test("getNextId: returns id + 1 of only item", () => {
  expect(utils.getNextId([{ id: 1 }])).toBe(2);
});

test("getNextId: returns biggest ID + 1", () => {
  let expectedId = 0;
  const items = [];
  for (let i = 0; i < 10; i++) {
    const id = Math.floor(Math.random() * 999) + 1; // [0, 1000]
    expectedId = Math.max(expectedId, id);
    items.push({ id });
  }
  expectedId++;
  expect(utils.getNextId(items)).toBe(expectedId);
});
