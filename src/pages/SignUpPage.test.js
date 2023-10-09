import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import axios from "axios";
import SignUpPage from "./SignUpPage.vue";

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
        it(
            "sends username, e-mail and password to backend after clicking the button",
            async () =>
        {
            const mockPost = jest.fn();
            axios.post = mockPost;
            const username = "GoodUser";
            const email = "my-email@host.com";
            const password = "myPassword@123";

            render(SignUpPage);
            const usernameInput = screen.queryByLabelText("Username");
            const emailInput = screen.queryByLabelText("E-mail");
            const passwordInput = screen.queryByLabelText("Password");
            const repeatPasswordInput = screen.queryByLabelText("Repeat Password");
            const button = screen.queryByRole("button", { name: "Sign Up"});

            await userEvent.type(usernameInput, username);
            await userEvent.type(emailInput, email);
            await userEvent.type(passwordInput, password);
            await userEvent.type(repeatPasswordInput, password);
            await userEvent.click(button);

            const firstCall = mockPost.mock.calls[0];
            const body = firstCall[1]; // data parameter from axios.post.

            expect(body).toEqual({
                username: username,
                email: email,
                password: password
            });
        });
    });
})
