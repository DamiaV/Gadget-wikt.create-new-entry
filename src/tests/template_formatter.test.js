import { beforeEach, expect, test } from "vitest";
import templates from "../templates.js";

/**
 * @type {import("../templates.js").FilledTemplate}
 */
let template;

/**
 * @type {[string, import("../templates.js").TemplateFormat, string][]}
 */
const testData = [
  [
    "all false/0",
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
      minParamNameLength: 0,
    },
    "{{Foo|foo|fuu|bar=baz|longparameter=quux|verylongparameter=bat}}",
  ],
  [
    "new line before template",
    {
      newLineBeforeTemplate: true,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: false,
      newLineBeforeClosing: false,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 0,
      spacesAfterEqual: 0,
      minParamNameLength: 0,
    },
    "\n{{Foo|foo|fuu|bar=baz|longparameter=quux|verylongparameter=bat}}",
  ],
  [
    "new line after template",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: true,
      newLineBeforePipe: false,
      newLineAfterPipe: false,
      newLineBeforeClosing: false,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 0,
      spacesAfterEqual: 0,
      minParamNameLength: 0,
    },
    "{{Foo|foo|fuu|bar=baz|longparameter=quux|verylongparameter=bat}}\n",
  ],
  [
    "new line before pipe",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: true,
      newLineAfterPipe: false,
      newLineBeforeClosing: false,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 0,
      spacesAfterEqual: 0,
      minParamNameLength: 0,
    },
    `{{Foo
|foo
|fuu
|bar=baz
|longparameter=quux
|verylongparameter=bat}}`,
  ],
  [
    "new line after pipe",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: true,
      newLineBeforeClosing: false,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 0,
      spacesAfterEqual: 0,
      minParamNameLength: 0,
    },
    `{{Foo|
foo|
fuu|
bar=baz|
longparameter=quux|
verylongparameter=bat}}`,
  ],
  [
    "new line before closing",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: false,
      newLineBeforeClosing: true,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 0,
      spacesAfterEqual: 0,
      minParamNameLength: 0,
    },
    "{{Foo|foo|fuu|bar=baz|longparameter=quux|verylongparameter=bat\n}}",
  ],
  [
    "spaces before pipe",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: false,
      newLineBeforeClosing: false,
      spacesBeforePipe: 2,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 0,
      spacesAfterEqual: 0,
      minParamNameLength: 0,
    },
    "{{Foo  |foo  |fuu  |bar=baz  |longparameter=quux  |verylongparameter=bat}}",
  ],
  [
    "spaces before arg name",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: false,
      newLineBeforeClosing: false,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 2,
      spacesBeforeEqual: 0,
      spacesAfterEqual: 0,
      minParamNameLength: 0,
    },
    "{{Foo|  foo|  fuu|  bar=baz|  longparameter=quux|  verylongparameter=bat}}",
  ],
  [
    "spaces before equal",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: false,
      newLineBeforeClosing: false,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 2,
      spacesAfterEqual: 0,
      minParamNameLength: 0,
    },
    "{{Foo|foo|fuu|bar  =baz|longparameter  =quux|verylongparameter  =bat}}",
  ],
  [
    "spaces after equal",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: false,
      newLineAfterPipe: false,
      newLineBeforeClosing: false,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 0,
      spacesAfterEqual: 2,
      minParamNameLength: 0,
    },
    "{{Foo|foo|fuu|bar=  baz|longparameter=  quux|verylongparameter=  bat}}",
  ],
  [
    "padded arg names",
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
      minParamNameLength: 14,
    },
    "{{Foo|foo|fuu|bar           =baz|longparameter =quux|verylongparameter=bat}}",
  ],
  [
    "block formatting",
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
      minParamNameLength: 0,
    },
    `{{Foo
| foo
| fuu
| bar = baz
| longparameter = quux
| verylongparameter = bat
}}`,
  ],
  [
    "no space before the parameter name, each template on its own line",
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
      minParamNameLength: 0,
    },
    `
{{Foo
|foo
|fuu
|bar = baz
|longparameter = quux
|verylongparameter = bat
}}
`,
  ],
  [
    "indent each parameter",
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
      minParamNameLength: 0,
    },
    `{{Foo
 |foo
 |fuu
 |bar = baz
 |longparameter = quux
 |verylongparameter = bat
}}`,
  ],
  [
    "align all parameter names to a given length",
    {
      newLineBeforeTemplate: false,
      newLineAfterTemplate: false,
      newLineBeforePipe: true,
      newLineAfterPipe: false,
      newLineBeforeClosing: true,
      spacesBeforePipe: 0,
      spacesBeforeParamName: 0,
      spacesBeforeEqual: 1,
      spacesAfterEqual: 1,
      minParamNameLength: 14,
    },
    `{{Foo
|foo
|fuu
|bar            = baz
|longparameter  = quux
|verylongparameter = bat
}}`,
  ],
  [
    "pipes at the end of the previous line",
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
    `{{Foo|
  foo|
  fuu|
  bar            = baz|
  longparameter  = quux|
  verylongparameter = bat}}`,
  ],
  [
    "inline style with more spaces, must be at start of line",
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
    "\n{{Foo | foo | fuu | bar = baz | longparameter = quux | verylongparameter = bat}}",
  ],
  [
    "template at the start of a line, indent-aligned parameters, pipe beforehand",
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
    `
{{Foo |
  foo |
  fuu |
  bar            = baz |
  longparameter  = quux |
  verylongparameter = bat}}`,
  ],
];

beforeEach(() => {
  template = {
    name: "Foo",
    params: {
      1: "foo",
      bar: "baz",
      2: "fuu",
      longparameter: "quux",
      verylongparameter: "bat",
    },
    paramOrder: ["1", "2", "bar", "longparameter", "verylongparameter"],
  };
});

for (const [testName, templateFormat, expectedOutput] of testData) {
  test(testName, () => {
    template.format = templateFormat;
    expect(templates.templateToString(template)).toBe(expectedOutput);
  });
}

test("skipped positional arg", () => {
  template.format = {
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
  };
  template.paramOrder.splice(template.paramOrder.indexOf("2") + 1, 0, "4");
  template.params["4"] = "baar";
  expect(templates.templateToString(template)).toBe(
    "{{Foo|foo|fuu|4=baar|bar=baz|longparameter=quux|verylongparameter=bat}}"
  );
});

test("skipped positional arg, cancels subsequent positional args", () => {
  template.format = {
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
  };
  template.paramOrder.splice(template.paramOrder.indexOf("2") + 1, 0, "4", "5");
  template.params["4"] = "baar";
  template.params["5"] = "faa";
  expect(templates.templateToString(template)).toBe(
    "{{Foo|foo|fuu|4=baar|5=faa|bar=baz|longparameter=quux|verylongparameter=bat}}"
  );
});

test("skipped positional args treated as named args", () => {
  template.format = {
    newLineBeforeTemplate: false,
    newLineAfterTemplate: false,
    newLineBeforePipe: false,
    newLineAfterPipe: false,
    newLineBeforeClosing: false,
    spacesBeforePipe: 0,
    spacesBeforeParamName: 0,
    spacesBeforeEqual: 1,
    spacesAfterEqual: 1,
    minParamNameLength: 1,
  };
  template.paramOrder.splice(template.paramOrder.indexOf("2") + 1, 0, "4");
  template.params["4"] = "baar";
  expect(templates.templateToString(template)).toBe(
    "{{Foo|foo|fuu|4 = baar|bar = baz|longparameter = quux|verylongparameter = bat}}"
  );
});

test("| is escaped in positional params", () => {
  let template = {
    name: "Foo",
    params: {
      1: "pipe | should be escaped",
    },
    paramOrder: ["1"],
  };
  template.format = {
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
  };
  expect(templates.templateToString(template)).toBe(
    "{{Foo|pipe {{!}} should be escaped}}"
  );
});

test("| is escaped in named params", () => {
  let template = {
    name: "Foo",
    params: {
      bar: "pipe | should be escaped",
    },
    paramOrder: ["1"],
  };
  template.format = {
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
  };
  expect(templates.templateToString(template)).toBe(
    "{{Foo|bar=pipe {{!}} should be escaped}}"
  );
});

test("= forces named positional param", () => {
  let template = {
    name: "Foo",
    params: {
      1: "equal = should force named param",
    },
    paramOrder: ["1"],
  };
  template.format = {
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
  };
  expect(templates.templateToString(template)).toBe(
    "{{Foo|1=equal = should force named param}}"
  );
});

test("= forces following named positional param", () => {
  let template = {
    name: "Foo",
    params: {
      1: "equal = should force named param",
      2: "bar",
    },
    paramOrder: ["1", "2"],
  };
  template.format = {
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
  };
  expect(templates.templateToString(template)).toBe(
    "{{Foo|1=equal = should force named param|2=bar}}"
  );
});

test("respects paramOrder", () => {
  let template = {
    name: "Foo",
    params: {
      1: "foo",
      foo: "bar",
      bat: "faa",
    },
    paramOrder: ["1", "bat", "foo"],
  };
  template.format = {
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
  };
  expect(templates.templateToString(template)).toBe(
    "{{Foo|foo|bat=faa|foo=bar}}"
  );
});

const typeTests = {
  "boolean: true": [true, "|flag=1"],
  "boolean: false": [false, ""],
  "number: 0": [0, "|flag=0"],
  "number: non-zero": [2, "|flag=2"],
  "number: negative": [-1, "|flag=-1"],
  "number: float": [1.2, "|flag=1.2"],
};

for (const [testName, [input, output]] of Object.entries(typeTests)) {
  test(testName, () => {
    let template = {
      name: "Foo",
      params: {
        flag: input,
      },
      paramOrder: ["flag"],
    };
    template.format = {
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
    };
    expect(templates.templateToString(template)).toBe(`{{Foo${output}}}`);
  });
}

const falsyValuesTests = [undefined, null, false, ""];
for (const input of falsyValuesTests) {
  test(`falsy values are ignored: ${input}`, () => {
    let template = {
      name: "Foo",
      params: {
        1: input,
        flag: input,
      },
      paramOrder: ["flag"],
    };
    template.format = {
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
    };
    expect(templates.templateToString(template)).toBe(`{{Foo}}`);
  });
}
