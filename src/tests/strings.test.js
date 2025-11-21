import { expect, test } from "vitest";
import strings from "../strings.js";

/*
 * Test: userGenderSwitch
 */

const GENDERS = {
  unknown: "Utilisateur·ice",
  male: "Utilisateur",
  female: "Utilisatrice",
};
for (const [key, value] of Object.entries(GENDERS))
  test(`userGenderSwitch: ${key}`, () => {
    expect(
      strings.userGenderSwitch(
        key,
        GENDERS.unknown,
        GENDERS.female,
        GENDERS.male
      )
    ).toBe(value);
  });

/*
 * Test: capitalize
 */

test("capitalize: all lower case", () => {
  expect(strings.capitalize("test")).toBe("Test");
});

test("capitalize: all upper case changes nothing", () => {
  expect(strings.capitalize("TEST")).toBe("TEST");
});

test("capitalize: only first word is changed", () => {
  expect(strings.capitalize("test test")).toBe("Test test");
});

test("capitalize: returns empty string for empty input", () => {
  expect(strings.capitalize("")).toBe("");
});

/*
 * Test: extractTrailingWhitespace
 */

test("extractTrailingWhitespace: returns empty strings for empty input", () => {
  expect(strings.extractTrailingWhitespace("")).toEqual(["", "", ""]);
});

test("extractTrailingWhitespace: returns all whitespace in first item for whitespace-only input", () => {
  expect(strings.extractTrailingWhitespace(" \n\t")).toEqual([" \n\t", "", ""]);
});

test("extractTrailingWhitespace: no trailing whitespace returns empty strings", () => {
  expect(strings.extractTrailingWhitespace("test")).toEqual(["", "test", ""]);
});

test("extractTrailingWhitespace: middle whitespace is kept", () => {
  expect(strings.extractTrailingWhitespace("test test")).toEqual([
    "",
    "test test",
    "",
  ]);
});

test("extractTrailingWhitespace: middle line breaks are kept", () => {
  expect(strings.extractTrailingWhitespace("test\ntest")).toEqual([
    "",
    "test\ntest",
    "",
  ]);
});

test("extractTrailingWhitespace: only leading whitespace", () => {
  expect(strings.extractTrailingWhitespace("  test")).toEqual([
    "  ",
    "test",
    "",
  ]);
});

test("extractTrailingWhitespace: only tailing whitespace", () => {
  expect(strings.extractTrailingWhitespace("test  ")).toEqual([
    "",
    "test",
    "  ",
  ]);
});

test("extractTrailingWhitespace: leading and tailing whitespace", () => {
  expect(strings.extractTrailingWhitespace("   test  ")).toEqual([
    "   ",
    "test",
    "  ",
  ]);
});

test("extractTrailingWhitespace: matches \\n", () => {
  expect(strings.extractTrailingWhitespace("\ntest\n\n")).toEqual([
    "\n",
    "test",
    "\n\n",
  ]);
});

test("extractTrailingWhitespace: matches \\r", () => {
  expect(strings.extractTrailingWhitespace("\rtest\r\r")).toEqual([
    "\r",
    "test",
    "\r\r",
  ]);
});

test("extractTrailingWhitespace: matches tabs", () => {
  expect(strings.extractTrailingWhitespace("\ttest\t\t")).toEqual([
    "\t",
    "test",
    "\t\t",
  ]);
});

test("extractTrailingWhitespace: matches non-breaking space", () => {
  expect(strings.extractTrailingWhitespace("\u00a0test\u00a0\u00a0")).toEqual([
    "\u00a0",
    "test",
    "\u00a0\u00a0",
  ]);
});

test("extractTrailingWhitespace: matches thin non-breaking space", () => {
  expect(strings.extractTrailingWhitespace("\u202ftest\u202f\u202f")).toEqual([
    "\u202f",
    "test",
    "\u202f\u202f",
  ]);
});

/*
 * Test: substitute
 */

test("substitute: returns empty strings for empty input (non-empty table)", () => {
  expect(strings.substitute("", { a: "b" })).toBe("");
});

test("substitute: returns empty strings for empty input (empty table)", () => {
  expect(strings.substitute("", {})).toBe("");
});

test("substitute: unchanged string for empty table", () => {
  expect(strings.substitute("abcd", {})).toBe("abcd");
});

test("substitute: replaces all occurrences", () => {
  expect(strings.substitute("abcada", { a: "e" })).toBe("ebcede");
});

test("substitute: respects insertion order", () => {
  expect(strings.substitute("abcada", { a: "ef", e: "g" })).toBe("gfbcgfdgf");
});
