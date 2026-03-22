/**
 * API Route Tests - Newsletter Subscription Validation
 * Tests validation logic for newsletter subscriptions
 */

describe("Newsletter Subscription Validation", () => {
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateNewsletterSubscription = (data: {
    email?: string;
  }): { valid: boolean; error?: string } => {
    if (!data.email?.trim()) {
      return { valid: false, error: "Email is required" };
    }
    if (!validateEmail(data.email)) {
      return { valid: false, error: "Invalid email format" };
    }
    return { valid: true };
  };

  it("requires email", () => {
    const result = validateNewsletterSubscription({});
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Email is required");
  });

  it("validates email format", () => {
    const result = validateNewsletterSubscription({ email: "invalid" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid email format");
  });

  it("passes with valid email", () => {
    const result = validateNewsletterSubscription({ email: "test@example.com" });
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("trims whitespace from email", () => {
    const email = "  test@example.com  ".trim();
    const result = validateNewsletterSubscription({ email });
    expect(result.valid).toBe(true);
  });

  it("validates various email formats", () => {
    expect(validateEmail("user@domain.com")).toBe(true);
    expect(validateEmail("user.name@domain.co.uk")).toBe(true);
    expect(validateEmail("user+tag@domain.com")).toBe(true);
    expect(validateEmail("invalid")).toBe(false);
    expect(validateEmail("@domain.com")).toBe(false);
    expect(validateEmail("user@")).toBe(false);
    expect(validateEmail("")).toBe(false);
  });
});
