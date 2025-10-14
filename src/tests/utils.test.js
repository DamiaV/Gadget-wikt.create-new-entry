import { expect, test } from "vitest";
import utils from "../utils.js";

/*
 * Test: capitalize
 */

test("capitalize: all lower case", () => {
  expect(utils.capitalize("test")).toBe("Test");
});

test("capitalize: all upper case changes nothing", () => {
  expect(utils.capitalize("TEST")).toBe("TEST");
});

test("capitalize: only first word is changed", () => {
  expect(utils.capitalize("test test")).toBe("Test test");
});

test("capitalize: returns empty string for empty input", () => {
  expect(utils.capitalize("")).toBe("");
});

/*
 * Test: extractTrailingWhitespace
 */

test("extractTrailingWhitespace: returns empty strings for empty input", () => {
  expect(utils.extractTrailingWhitespace("")).toEqual(["", "", ""]);
});

test("extractTrailingWhitespace: returns all whitespace in first item for whitespace-only input", () => {
  expect(utils.extractTrailingWhitespace(" \n\t")).toEqual([" \n\t", "", ""]);
});

test("extractTrailingWhitespace: no trailing whitespace returns empty strings", () => {
  expect(utils.extractTrailingWhitespace("test")).toEqual(["", "test", ""]);
});

test("extractTrailingWhitespace: middle whitespace is kept", () => {
  expect(utils.extractTrailingWhitespace("test test")).toEqual([
    "",
    "test test",
    "",
  ]);
});

test("extractTrailingWhitespace: middle line breaks are kept", () => {
  expect(utils.extractTrailingWhitespace("test\ntest")).toEqual([
    "",
    "test\ntest",
    "",
  ]);
});

test("extractTrailingWhitespace: only leading whitespace", () => {
  expect(utils.extractTrailingWhitespace("  test")).toEqual(["  ", "test", ""]);
});

test("extractTrailingWhitespace: only tailing whitespace", () => {
  expect(utils.extractTrailingWhitespace("test  ")).toEqual(["", "test", "  "]);
});

test("extractTrailingWhitespace: leading and tailing whitespace", () => {
  expect(utils.extractTrailingWhitespace("   test  ")).toEqual([
    "   ",
    "test",
    "  ",
  ]);
});

test("extractTrailingWhitespace: matches \\n", () => {
  expect(utils.extractTrailingWhitespace("\ntest\n\n")).toEqual([
    "\n",
    "test",
    "\n\n",
  ]);
});

test("extractTrailingWhitespace: matches \\r", () => {
  expect(utils.extractTrailingWhitespace("\rtest\r\r")).toEqual([
    "\r",
    "test",
    "\r\r",
  ]);
});

test("extractTrailingWhitespace: matches tabs", () => {
  expect(utils.extractTrailingWhitespace("\ttest\t\t")).toEqual([
    "\t",
    "test",
    "\t\t",
  ]);
});

test("extractTrailingWhitespace: matches non-breaking space", () => {
  expect(utils.extractTrailingWhitespace("\u00a0test\u00a0\u00a0")).toEqual([
    "\u00a0",
    "test",
    "\u00a0\u00a0",
  ]);
});

test("extractTrailingWhitespace: matches thin non-breaking space", () => {
  expect(utils.extractTrailingWhitespace("\u202ftest\u202f\u202f")).toEqual([
    "\u202f",
    "test",
    "\u202f\u202f",
  ]);
});
