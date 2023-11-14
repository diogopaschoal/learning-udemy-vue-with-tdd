import TextInput from "./TextInput.vue";
import { render } from "@testing-library/vue";

it("has is-invalid class for input when help is set", () => {
    const { container } = render(TextInput, { props: { help: "Error message" } });    
    const input = container.querySelector("input");
    expect(input.classList).toContain("is-invalid");
});

it("has invalid-feedback class for span when help is set", () => {
    const { container } = render(TextInput, { props: { help: "Error message" } });
    const span = container.querySelector("span");
    expect(span.classList).toContain("invalid-feedback");
});

it("does not have is-invalid class for input when help is not set", () => {
    const { container } = render(TextInput);    
    const input = container.querySelector("input");
    expect(input.classList).not.toContain("is-invalid");
});

it("does not have invalid-feedback class for input when help is not set", () => {
    const { container } = render(TextInput);    
    const span = container.querySelector("span");
    expect(span.classList).not.toContain("invalid-feedback");
});