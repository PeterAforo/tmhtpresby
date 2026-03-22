// Mock Stripe before importing
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    checkout: { sessions: { create: jest.fn() } },
  }));
});

import { toPesewas, fromPesewas, CURRENCY, FUND_LABELS } from "@/lib/stripe";

describe("toPesewas", () => {
  it("converts GHS to pesewas", () => {
    expect(toPesewas(10)).toBe(1000);
  });

  it("handles decimal amounts", () => {
    expect(toPesewas(10.5)).toBe(1050);
  });

  it("handles zero", () => {
    expect(toPesewas(0)).toBe(0);
  });

  it("rounds to nearest pesewa", () => {
    expect(toPesewas(10.999)).toBe(1100);
  });
});

describe("fromPesewas", () => {
  it("converts pesewas to GHS string", () => {
    expect(fromPesewas(1000)).toBe("10.00");
  });

  it("handles amounts with pesewas", () => {
    expect(fromPesewas(1050)).toBe("10.50");
  });

  it("handles zero", () => {
    expect(fromPesewas(0)).toBe("0.00");
  });
});

describe("CURRENCY", () => {
  it("is set to ghs", () => {
    expect(CURRENCY).toBe("ghs");
  });
});

describe("FUND_LABELS", () => {
  it("has general fund", () => {
    expect(FUND_LABELS.general).toBe("General Fund");
  });

  it("has building fund", () => {
    expect(FUND_LABELS.building).toBe("Building Fund");
  });

  it("has missions fund", () => {
    expect(FUND_LABELS.missions).toBe("Missions");
  });

  it("has youth fund", () => {
    expect(FUND_LABELS.youth).toBe("Youth Ministry");
  });
});
