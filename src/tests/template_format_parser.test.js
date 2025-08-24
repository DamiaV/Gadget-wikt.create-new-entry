import { expect, test } from "vitest";
import templates from "../templates.js";

/**
 * @type {[string, import("../templates.js").TemplateFormat][]}
 */
const testData = [
  [
    "inline",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: false,
      newLineBeforeClosing: false,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 0,
      spacesAfterEqual: 0,
      minParamNameLength: 1,
    },
  ],
  [
    "{{_|_=_}}",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: false,
      newLineBeforeClosing: false,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 0,
      spacesAfterEqual: 0,
      minParamNameLength: 1,
    },
  ],
  [
    "block",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: true,
      newLineAfterPipe: false,
      newLineBeforeClosing: true,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 1,
      spacesBeforeEqual: 1,
      spacesAfterEqual: 1,
      minParamNameLength: 1,
    },
  ],
  [
    "{{_\\n| _ = _\\n}}",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: true,
      newLineAfterPipe: false,
      newLineBeforeClosing: true,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 1,
      spacesBeforeEqual: 1,
      spacesAfterEqual: 1,
      minParamNameLength: 1,
    },
  ],
  [
    "\\n{{_\\n|_ = _\\n}}\\n",
    {
      newLineBeforeTemplate: true,
      newLineAfterTemplate: true,
      newLineBeforePipe: true,
      newLineAfterPipe: false,
      newLineBeforeClosing: true,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 1,
      spacesAfterEqual: 1,
      minParamNameLength: 1,
    },
  ],
  [
    "{{_\\n |_ = _\\n}}",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: true,
      newLineAfterPipe: false,
      newLineBeforeClosing: true,
      spacesBeforePipe: 1,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 1,
      spacesAfterEqual: 1,
      minParamNameLength: 1,
    },
  ],
  [
    "{{_\\n|______________ = _\\n}}\\n",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: true,
      newLineBeforePipe: true,
      newLineAfterPipe: false,
      newLineBeforeClosing: true,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 1,
      spacesAfterEqual: 1,
      minParamNameLength: 14,
    },
  ],
  [
    "{{_|\\n  ______________ = _}}",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: true,
      newLineBeforeClosing: false,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 2,
      spacesBeforeEqual: 1,
      spacesAfterEqual: 1,
      minParamNameLength: 14,
    },
  ],
  [
    "\\n{{_ | _ = _}}",
    {
      newLineBeforeTemplate: true,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: false,
      newLineBeforeClosing: false,
      spacesBeforePipe: 1,
      spacesBeforeParamName: 1,
      spacesBeforeEqual: 1,
      spacesAfterEqual: 1,
      minParamNameLength: 1,
    },
  ],
  [
    "\\n{{_ |\\n  ______________ = _}}",
    {
      newLineBeforeTemplate: true,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: true,
      newLineBeforeClosing: false,
      spacesBeforePipe: 1,
      spacesBeforeParamName: 2,
      spacesBeforeEqual: 1,
      spacesAfterEqual: 1,
      minParamNameLength: 14,
    },
  ],
];

/**
 * @type {[string, number][]}
 */
const failTestData = [
  ["\\n\\n{{", 2],
  ["\\n!{{", 2],
  ["\\n {{", 2],
  ["!{{", 0],
  [" {{", 0],
  ["{{\\n_", 2],
  ["{{!_", 2],
  ["{{ _", 2],
  ["{{__", 3],
  ["{{_!", 3],
  ["{{_\\n\\n", 5],
  ["{{_\\n!", 5],
  ["{{_ !", 4],
  ["{{_|!", 4],
  ["{{_|\\n!", 6],
  ["{{_|\\n !", 7],
  ["{{_|_!", 5],
  ["{{_|_\\n", 5],
  ["{{_|_ \\n", 6],
  ["{{_|_ !", 6],
  ["{{_|_=!", 6],
  ["{{_|_=\\n", 6],
  ["{{_|_= \\n", 7],
  ["{{_|_= !", 7],
  ["{{_|_=__", 7],
  ["{{_|_=_!", 7],
  ["{{_|_=_ ", 7],
  ["{{_|_=_\\n\\n", 9],
  ["{{_|_=_\\n!", 9],
  ["{{_|_=_\\n ", 9],
  ["{{_|_=_}}!", 9],
  ["{{_|_=_}} ", 9],
  ["{{_|_=_}}\\n\\n", 11],
  ["{{_|_=_}}\\n!", 11],
  ["{{_|_=_}}\\n ", 11],
];

for (const [input, expectedOutput] of testData) {
  test(input, () => {
    expect(templates.parseTemplateFormat(input)).toEqual(expectedOutput);
  });
}

for (const [input, failIndex] of failTestData) {
  test(input, () => {
    expect(() => templates.parseTemplateFormat(input)).toThrowError(
      `Parse error at index ${failIndex}`
    );
  });
}
