import { render, screen } from "@testing-library/vue";
import SignUp from "./SignUp.vue";
import { describe, expect } from "vitest";
import userEvent from "@testing-library/user-event";

describe("Sign Up", () => {
  it("has Sign Up header", () => {
    render(SignUp);
    const header = screen.getByRole("heading", { name: "Sign Up" });
    expect(header).toBeInTheDocument();
  });

  it("has username input", () => {
    render(SignUp);
    expect(screen.queryByLabelText("Username")).toBeInTheDocument();
  });

  it("has email input", () => {
    render(SignUp);
    expect(screen.queryByLabelText("E-mail")).toBeInTheDocument();
  });

  it("has password input", () => {
    render(SignUp);
    expect(screen.queryByLabelText("Password")).toBeInTheDocument();
  });

  it("has password repeat input", () => {
    render(SignUp);
    expect(screen.queryByLabelText("Password Repeat")).toBeInTheDocument();
  });

  it("has password type for password input", () => {
    render(SignUp);
    expect(screen.queryByLabelText("Password")).toHaveAttribute(
      "type",
      "password"
    );
  });
  it("has password type for password repeat input", () => {
    render(SignUp);
    expect(screen.queryByLabelText("Password Repeat")).toHaveAttribute(
      "type",
      "password"
    );
  });
  it("has a Sign Up button", () => {
    render(SignUp);
    const button = screen.getByRole("button", { name: "Sign Up" });
    expect(button).toBeInTheDocument();
  });
  it("disables the button initially", () => {
    render(SignUp);
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeDisabled();
  });
});

describe("when user sets same value for password inputs", () => {
  it("enables button", async () => {
    const passwordValue = "abc@123";
    const user = userEvent.setup();
    render(SignUp);
    const passwordInput = screen.getByLabelText("Password");
    const passwordRepeatInput = screen.getByLabelText("Password Repeat");

    await user.type(passwordInput, passwordValue);
    await user.type(passwordRepeatInput, passwordValue);

    expect(screen.getByRole("button", { name: "Sign Up" })).toBeEnabled();
  });
});
