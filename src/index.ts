import z from "zod";
import { setPORT, getPORT, defaultPORT, getToggled, setToggled, sendMessage } from "./config";

function main() {
  portInput();
  toggleInput();
}

function toggleInput() {
  const toggle = document.querySelector<HTMLInputElement>("input#toggle");
  if (!toggle) return document.querySelector("div#error")?.setAttribute("aria-hidden", "false");

  getToggled.then(toggled => (toggle.checked = toggled ?? false));

  toggle.addEventListener("input", () => {
    setToggled(toggle.checked);
    sendMessage({ type: "TOGGLE UPDATE", payload: toggle.checked });
  });
}

function portInput() {
  const input = document.querySelector<HTMLInputElement>("input#port");
  if (!input) return document.querySelector("div#error")?.setAttribute("aria-hidden", "false");

  getPORT.then(PORT => (input.value = (PORT ?? defaultPORT).toString()));

  document.querySelector("button")?.addEventListener("click", e => {
    e.preventDefault();
    const validatedPORT = z.coerce
      .number()
      .int()
      .min(1)
      .max(2 ** 16 - 1)
      .safeParse(input.value);
    input.setAttribute("aria-invalid", validatedPORT.success ? "false" : "true");
    if (!validatedPORT.success) return;
    setPORT(validatedPORT.data);
    sendMessage({
      type: "PORT UPDATE",
      payload: validatedPORT.data,
    });
    window.close();
  });
}

main();
