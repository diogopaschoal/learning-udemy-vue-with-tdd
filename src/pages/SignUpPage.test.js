import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/vue";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
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
        const username = "GoodUser";
        const email = "my-email@host.com";
        const password = "myPassword@123";

        const setup = async() => {
            render(SignUpPage);
            const usernameInput = screen.queryByLabelText("Username");
            const emailInput = screen.queryByLabelText("E-mail");
            const passwordInput = screen.queryByLabelText("Password");
            const repeatPasswordInput = screen.queryByLabelText("Repeat Password");

            await userEvent.type(usernameInput, username);
            await userEvent.type(emailInput, email);
            await userEvent.type(passwordInput, password);
            await userEvent.type(repeatPasswordInput, password);
        };

        it(
            "enables the button when the password and repeat password fields have same value",
            async () =>
        {
            await setup();

            const button = screen.queryByRole("button", { name: "Sign Up"});
            expect(button).toBeEnabled();
        });

        it(
            "sends username, e-mail and password to backend after clicking the button",
            async () =>
        {
            let requestBody;
            const server = setupServer(
                rest.post("/api/1.0/users", async (req, resp, ctx) => {
                    requestBody = await req.json();
                    return resp(ctx.status(200));
                })
            );
            server.listen();

            await setup();
            const button = screen.queryByRole("button", { name: "Sign Up"});

            await userEvent.click(button);
            server.close();

            expect(requestBody).toEqual({
                username: username,
                email: email,
                password: password
            });
        });

        it(
            "does not allow clicking to the button when there is an ongoing api call",
            async () =>
        {
            let counter = 0;
            const server = setupServer(
                rest.post("/api/1.0/users", async (req, resp, ctx) => {
                    counter += 1;
                    return resp(ctx.status(200));
                })
            );
            server.listen();
            await setup();
            const button = screen.queryByRole("button", { name: "Sign Up"});

            await userEvent.click(button);
            await userEvent.click(button);
            server.close();

            expect(counter).toBe(1);
        });

        it("displays spinner while API request is in progress", async () => {
            const server = setupServer(
                rest.post("/api/1.0/users", async (req, resp, ctx) => {
                     return resp(ctx.status(200));
                })
            );
            server.listen();
            await setup();
            const button = screen.queryByRole("button", { name: "Sign Up"});

            await userEvent.click(button);

            const spinner = screen.queryByRole("status");

            server.close();
            expect(spinner).toBeInTheDocument();
        });

        it("does not display spinner when there is no API request", async () => {
            await setup();
            const spinner = screen.queryByRole("status");
            expect(spinner).not.toBeInTheDocument();
        });
    });
})
