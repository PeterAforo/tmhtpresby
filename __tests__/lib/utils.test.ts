import { cn, formatDate, formatShortDate, formatTime, truncate, slugify, titleCase } from "@/lib/utils";

describe("cn (classNames utility)", () => {
  it("merges multiple class names", () => {
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", null, "bar", undefined, false, 0, "baz")).toBe("foo bar baz");
  });

  it("returns empty string for no valid classes", () => {
    expect(cn(null, undefined, false)).toBe("");
  });

  it("handles single class", () => {
    expect(cn("single")).toBe("single");
  });

  it("handles empty call", () => {
    expect(cn()).toBe("");
  });
});

describe("formatDate", () => {
  const testDate = new Date("2026-03-10T09:00:00");

  it("formats date with default options", () => {
    const result = formatDate(testDate);
    expect(result).toContain("March");
    expect(result).toContain("10");
    expect(result).toContain("2026");
  });

  it("accepts ISO string input", () => {
    const result = formatDate("2026-03-10T09:00:00");
    expect(result).toContain("March");
  });

  it("accepts timestamp input", () => {
    const result = formatDate(testDate.getTime());
    expect(result).toContain("March");
  });

  it("throws RangeError for invalid date", () => {
    expect(() => formatDate("invalid-date")).toThrow(RangeError);
  });

  it("accepts custom options", () => {
    const result = formatDate(testDate, { month: "short", day: "numeric" });
    expect(result).toContain("Mar");
  });
});

describe("formatShortDate", () => {
  it("formats date as short string", () => {
    const result = formatShortDate(new Date("2026-03-10"));
    expect(result).toContain("Mar");
    expect(result).toContain("10");
    expect(result).toContain("2026");
  });
});

describe("formatTime", () => {
  it("formats time with AM/PM", () => {
    const result = formatTime(new Date("2026-03-10T09:30:00"));
    expect(result).toMatch(/9:30\s*AM/i);
  });

  it("formats PM time correctly", () => {
    const result = formatTime(new Date("2026-03-10T14:30:00"));
    expect(result).toMatch(/2:30\s*PM/i);
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("Hello World", 8)).toBe("Hello W…");
  });

  it("does not truncate short strings", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("handles exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("uses custom ellipsis", () => {
    expect(truncate("Hello World", 9, "...")).toBe("Hello...");
  });

  it("trims trailing whitespace before ellipsis", () => {
    expect(truncate("Hello World Test", 12)).toBe("Hello World…");
  });
});

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("HELLO")).toBe("hello");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World?")).toBe("hello-world");
  });

  it("handles multiple spaces", () => {
    expect(slugify("hello   world")).toBe("hello-world");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
  });

  it("handles underscores", () => {
    expect(slugify("hello_world")).toBe("hello-world");
  });

  it("handles complex strings", () => {
    expect(slugify("Sunday Morning Service!")).toBe("sunday-morning-service");
  });
});

describe("titleCase", () => {
  it("capitalizes first letter of each word", () => {
    expect(titleCase("hello world")).toBe("Hello World");
  });

  it("handles uppercase input", () => {
    expect(titleCase("HELLO WORLD")).toBe("Hello World");
  });

  it("handles mixed case", () => {
    expect(titleCase("hElLo WoRlD")).toBe("Hello World");
  });

  it("handles single word", () => {
    expect(titleCase("hello")).toBe("Hello");
  });
});
