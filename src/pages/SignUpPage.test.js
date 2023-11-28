import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/vue";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import SignUpPage from "./SignUpPage.vue";
import i18n from "../locales/i18n";
import en from "../locales/en.json";
import ptBR from "../locales/ptBR.json";
import LanguageSelector from "../components/LanguageSelector.vue";

let requestBody;
let counter = 0;
let acceptLanguageHeader;

const server = setupServer(
    rest.post("/api/1.0/users", async (req, resp, ctx) => {
        requestBody = await req.json();
        counter += 1;
        acceptLanguageHeader = req.headers.get("Accept-Language");
        return resp(ctx.status(200), ctx.delay(100));
    })
);

beforeAll(() => server.listen());
beforeEach(async () => {
    counter = 0;
    requestBody = undefined;
    acceptLanguageHeader = undefined;
    server.resetHandlers();
});
afterAll(() => server.close());

describe("Sign Up Page", () => {
    describe("Layout", () => {

        const setup = () => {
            render(SignUpPage, {
                global: {
                    plugins: [i18n]
                }
            });
        };

        beforeEach(() => {
            setup();
        });

        it("has Sign Up header", () => {
            const header = screen.queryByRole("heading", { name: "Sign Up" });
            expect(header).toBeInTheDocument();
        });

        it("has username input", () => {
            const input = screen.queryByLabelText("Username");
            expect(input).toBeInTheDocument();
        });

        it("has email input", () => {
            const input = screen.queryByLabelText("E-mail");
            expect(input).toBeInTheDocument();
        });

        it("has password input", () => {
            const input = screen.queryByLabelText("Password");
            expect(input).toBeInTheDocument();
        });

        it("has type password for password input", () => {
            const input = screen.queryByLabelText("Password");
            expect(input.type).toBe("password");
        });

        it("has repeat password input", () => {
            const input = screen.queryByLabelText("Repeat Password");
            expect(input).toBeInTheDocument();
        });

        it("has type password for repeat password input", () => {
            const input = screen.queryByLabelText("Repeat Password");
            expect(input.type).toBe("password");
        });

        it("has Sign Up button", () => {
            const button = screen.queryByRole("button", { name: "Sign Up" });
            expect(button).toBeInTheDocument();
        });

        it("has Sign Up button", () => {
            const button = screen.queryByRole("button", { name: "Sign Up" });
            expect(button).toBeDisabled();
        });
    });
    describe("Interactions", () => {
        const username = "GoodUser";
        const email = "my-email@host.com";
        const password = "myPassword@123";

        let button, usernameInput, passwordInput, repeatPasswordInput;
        const setup = async () => {
            render(SignUpPage, {
                global: {
                    plugins: [i18n]
                }
            });
            usernameInput = screen.queryByLabelText("Username");
            const emailInput = screen.queryByLabelText("E-mail");
            passwordInput = screen.queryByLabelText("Password");
            repeatPasswordInput = screen.queryByLabelText("Repeat Password");
            button = screen.queryByRole("button", { name: "Sign Up" });

            await userEvent.type(usernameInput, username);
            await userEvent.type(emailInput, email);
            await userEvent.type(passwordInput, password);
            await userEvent.type(repeatPasswordInput, password);
        };

        const generateValidationError = (field, message) => {
            return rest.post("/api/1.0/users", async (_, resp, ctx) => {
                return resp(
                    ctx.status(400),
                    ctx.json({
                        validationErrors: {
                            [field]: message
                        }
                    })
                );
            });
        };

        beforeEach(async () => {
            await setup();
        });

        it(
            "enables the button when the password and repeat password fields have same value",
            async () => {
                expect(button).toBeEnabled();
            });

        it(
            "sends username, e-mail and password to backend after clicking the button",
            async () => {
                await userEvent.click(button);
                await screen.findByText(en.accountActivationNotification);

                expect(requestBody).toEqual({
                    username: username,
                    email: email,
                    password: password
                });
            });

        it(
            "does not allow clicking to the button when there is an ongoing api call",
            async () => {
                await userEvent.click(button);
                await userEvent.click(button);
                await screen.findByText(en.accountActivationNotification);

                expect(counter).toBe(1);
            });

        it("displays spinner while API request is in progress", async () => {
            await userEvent.click(button);
            const spinner = screen.queryByRole("status");

            expect(spinner).toBeInTheDocument();
        });

        it("does not display spinner when there is no API request", async () => {
            const spinner = screen.queryByRole("status");
            expect(spinner).not.toBeInTheDocument();
        });

        it("displays account activation information after successful sign up request", async () => {
            await userEvent.click(button);
            const text = await screen.findByText(en.accountActivationNotification);

            expect(text).toBeInTheDocument();
        });

        it("doesn't display account activation message before sign up request", async () => {
            const text = screen.queryByText(en.accountActivationNotification);
            expect(text).not.toBeInTheDocument();
        });

        it("doesn't display account activation information after failing sign up request", async () => {
            server.use(
                rest.post("/api/1.0/users", async (_, resp, ctx) => {
                    return resp(ctx.status(400));
                })
            );
            await userEvent.click(button);

            const text = screen.queryByText(en.accountActivationNotification);

            expect(text).not.toBeInTheDocument();
        });

        it("hides sign up form after successful sign up request", async () => {
            const form = screen.queryByTestId("form-sign-up");
            await userEvent.click(button);

            await waitFor(() => {
                expect(form).not.toBeInTheDocument();
            });
        });

        it.each`
            field               | message
            ${"username"}       | ${"Username cannot be null"}
            ${"email"}          | ${"E-mail cannot be null"}
            ${"password"}       | ${"Password cannot be null"}
        `("display $message for field $field.", async ({ field, message }) => {
            server.use(generateValidationError(field, message));
            await userEvent.click(button);

            const text = await screen.findByText(message);

            expect(text).toBeInTheDocument();
        });

        it("hides spinner after error response.", async () => {
            server.use(generateValidationError("username", "Username cannot be null"));
            await userEvent.click(button);

            await screen.findByText("Username cannot be null");
            const spinner = screen.queryByRole("status");

            expect(spinner).not.toBeInTheDocument();
        });

        it("enables the button after error response.", async () => {
            server.use(generateValidationError("username", "Username cannot be null"));

            await userEvent.click(button);

            await screen.findByText("Username cannot be null");

            expect(button).toBeEnabled();
        });

        it("displays mismatch message for password repeat input.", async () => {
            await userEvent.type(passwordInput, "P4ss1");
            await userEvent.type(repeatPasswordInput, "P4ss2");

            const text = await screen.findByText("Password mismatch");

            expect(text).toBeInTheDocument();
        });

        it.each`
            field               | message                       | label
            ${"username"}       | ${"Username cannot be null"}  | ${"Username"}
            ${"email"}          | ${"E-mail cannot be null"}    | ${"E-mail"}
            ${"password"}       | ${"Password cannot be null"}  | ${"Password"}
        `(
            "clear validation error after $field field is updated.",
            async ({ field, message, label }) => {
                server.use(generateValidationError(field, message));
                await userEvent.click(button);

                const text = await screen.findByText(message);
                const input = await screen.findByLabelText(label);
                await userEvent.type(input, "updated");

                expect(text).not.toBeInTheDocument();
            });
    });
    describe("Internationalization", () => {
        let portugueseLanguage, englishLanguage, username, email, password, repeatPassword, button;
        const setup = () => {
            const app = {
                components: {
                    SignUpPage,
                    LanguageSelector,
                },
                template: `
                    <SignUpPage/>
                    <LanguageSelector/>
                `,
            };

            render(app, {
                global: {
                    plugins: [i18n]
                }
            });
            portugueseLanguage = screen.queryByTitle("Portuguese");
            englishLanguage = screen.queryByTitle("English");
            username = screen.queryByLabelText(en.username);
            email = screen.queryByLabelText(en.email);
            password = screen.queryByLabelText(en.password);
            repeatPassword = screen.queryByLabelText(en.repeatPassword);
            button = screen.queryByRole("button", { name: en.signUp });
        };

        beforeEach(() => setup());
        afterEach(() => {
            i18n.global.locale = "en";
        });

        it("initially displays all text in English", async () => {
            expect(screen.queryByRole("heading", { name: en.signUp })).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: en.signUp })).toBeInTheDocument();
            expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
            expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
            expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
            expect(screen.queryByLabelText(en.repeatPassword)).toBeInTheDocument();
        });

        it("displays all text in Portuguese after selecting that language", async () => {
            await userEvent.click(portugueseLanguage);

            expect(screen.queryByRole("heading", { name: ptBR.signUp })).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: ptBR.signUp })).toBeInTheDocument();
            expect(screen.queryByLabelText(ptBR.username)).toBeInTheDocument();
            expect(screen.queryByLabelText(ptBR.email)).toBeInTheDocument();
            expect(screen.queryByLabelText(ptBR.password)).toBeInTheDocument();
            expect(screen.queryByLabelText(ptBR.repeatPassword)).toBeInTheDocument();
        });

        it("displays all text in English after page is translated to Portuguese", async () => {
            await userEvent.click(portugueseLanguage);
            await userEvent.click(englishLanguage);

            expect(screen.queryByRole("heading", { name: en.signUp })).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: en.signUp })).toBeInTheDocument();
            expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
            expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
            expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
            expect(screen.queryByLabelText(en.repeatPassword)).toBeInTheDocument();
        });

        it("displays password mismatch validation in Portuguese", async () => {
            await userEvent.click(portugueseLanguage);
            await userEvent.type(password, "P4ssword");
            await userEvent.type(repeatPassword, "N3wP4ss");

            const validation = screen.queryByText(ptBR.passwordMismatchValidation);

            expect(validation).toBeInTheDocument();
        });

        it("sends accept-language having en to backend for sign up request", async () => {
            await userEvent.type(username, "user1");
            await userEvent.type(email, "user1@mail.com");
            await userEvent.type(password, "P4ssword");
            await userEvent.type(repeatPassword, "P4ssword");
            await userEvent.click(button);

            await screen.findByText(en.accountActivationNotification);

            expect(acceptLanguageHeader).toBe("en");
        });

        it("sends accept-language having ptBR after that language is selected", async () => {
            await userEvent.click(portugueseLanguage);
            await userEvent.type(username, "user1");
            await userEvent.type(email, "user1@mail.com");
            await userEvent.type(password, "P4ssword");
            await userEvent.type(repeatPassword, "P4ssword");

            await userEvent.click(button);

            await screen.findByText(ptBR.accountActivationNotification);

            expect(acceptLanguageHeader).toBe("pt-BR");
        });

        it(
            "displays account activation information in Portuguese after selecting that language",
            async () => 
        {
            await userEvent.click(portugueseLanguage);
            await userEvent.type(username, "user1");
            await userEvent.type(email, "user1@mail.com");
            await userEvent.type(password, "P4ssword");
            await userEvent.type(repeatPassword, "P4ssword");

            await userEvent.click(button);

            const accountActivation = await screen.findByText(ptBR.accountActivationNotification);

            expect(accountActivation).toBeInTheDocument();
        });
    });
});
