import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Card className="custom-class">Content</Card>);
    const card = screen.getByText("Content").closest("div");
    expect(card).toHaveClass("custom-class");
  });

  it("applies default styling", () => {
    render(<Card>Styled Card</Card>);
    const card = screen.getByText("Styled Card").closest("div");
    expect(card).toBeInTheDocument();
  });
});

describe("CardHeader", () => {
  it("renders children", () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CardHeader className="custom-header">Header</CardHeader>);
    expect(screen.getByText("Header")).toHaveClass("custom-header");
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent>Main content</CardContent>);
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CardContent className="custom-content">Content</CardContent>);
    expect(screen.getByText("Content")).toHaveClass("custom-content");
  });
});

describe("CardFooter", () => {
  it("renders children", () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CardFooter className="custom-footer">Footer</CardFooter>);
    expect(screen.getByText("Footer")).toHaveClass("custom-footer");
  });
});

describe("Card composition", () => {
  it("renders full card with all sections", () => {
    render(
      <Card>
        <CardHeader>Title</CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Actions</CardFooter>
      </Card>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});
