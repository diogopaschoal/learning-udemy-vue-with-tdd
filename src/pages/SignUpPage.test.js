import SignUpPage from "./SignUpPage.vue";
import {render, screen} from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Sign Up Page", ()=>{
    describe("Layout", ()=> {
        
        it("has Sign Up header", () =>{
            render(SignUpPage);
            const header = screen.queryByRole("heading", { name: "Sign Up"});
            expect(header).toBeInTheDocument();
        });

        it("has username input", () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Username");
            expect(input).toBeInTheDocument();
        });

        it("has email input", () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("E-mail");
            expect(input).toBeInTheDocument();
        });

        it("has password input", () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Password");
            expect(input).toBeInTheDocument();
        });

        it("has type password for password input", () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Password");
            expect(input.type).toBe("password");
        });

        it("has repeat password input", () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Repeat Password");
            expect(input).toBeInTheDocument();
        });

        it("has type password for repeat password input", () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Repeat Password");
            expect(input.type).toBe("password");
        });

        it("has Sign Up button", () =>{
            render(SignUpPage);
            const button = screen.queryByRole("button", { name: "Sign Up"});
            expect(button).toBeInTheDocument();
        });

        it("has Sign Up button", () =>{
            render(SignUpPage);
            const button = screen.queryByRole("button", { name: "Sign Up"});
            expect(button).toBeDisabled();
        });
    });
    describe("Interactions", ()=> {
        it(
            "enables the button when the password and repeat password fields have same value",
            async () =>
        {
            render(SignUpPage);
            const passwordInput = screen.queryByLabelText("Password");
            const repeatPasswordInput = screen.queryByLabelText("Repeat Password");

            await userEvent.type(passwordInput, "myPassword@123");
            await userEvent.type(repeatPasswordInput, "myPassword@123");

            const button = screen.queryByRole("button", { name: "Sign Up"});
            expect(button).toBeEnabled();
        });
    });
})
