/**
 * API Route Tests - Contact Form Validation
 * Tests validation logic for contact form submissions
 */

describe("Contact Form Validation", () => {
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContactForm = (data: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!data.name?.trim()) errors.push("Name is required");
    if (!data.email?.trim()) errors.push("Email is required");
    else if (!validateEmail(data.email)) errors.push("Invalid email format");
    if (!data.message?.trim()) errors.push("Message is required");
    
    return { valid: errors.length === 0, errors };
  };

  it("validates required fields", () => {
    const result = validateContactForm({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Name is required");
    expect(result.errors).toContain("Email is required");
    expect(result.errors).toContain("Message is required");
  });

  it("validates email format", () => {
    const result = validateContactForm({
      name: "Test",
      email: "invalid-email",
      message: "Test message",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Invalid email format");
  });

  it("passes with valid data", () => {
    const result = validateContactForm({
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      message: "Test message",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("validates email correctly", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("user.name@domain.org")).toBe(true);
    expect(validateEmail("invalid")).toBe(false);
    expect(validateEmail("@domain.com")).toBe(false);
    expect(validateEmail("user@")).toBe(false);
  });
});
