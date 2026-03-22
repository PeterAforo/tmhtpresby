import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders without label", () => {
    render(<Input name="email" placeholder="Enter email" />);
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
  });

  it("handles value changes", () => {
    const handleChange = jest.fn();
    render(<Input name="email" onChange={handleChange} />);
    
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it("displays error message", () => {
    render(<Input name="email" error="Invalid email address" />);
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
  });

  it("displays hint text", () => {
    render(<Input name="email" hint="We'll never share your email" />);
    expect(screen.getByText(/we'll never share your email/i)).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(<Input name="email" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("can be required", () => {
    render(<Input name="email" label="Email" required />);
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("supports different types", () => {
    const { rerender } = render(<Input name="password" type="password" />);
    expect(document.querySelector('input[type="password"]')).toBeTruthy();

    rerender(<Input name="number" type="number" />);
    expect(document.querySelector('input[type="number"]')).toBeTruthy();
  });

  it("applies error styling when error is present", () => {
    render(<Input name="email" error="Error" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("has an id attribute", () => {
    render(<Input name="test-input" label="Test" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id");
  });
});
