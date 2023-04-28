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
    const validatedPORT = parseInt(input.value);
    const isValid = !isNaN(validatedPORT) && validatedPORT >= 1 && validatedPORT <= 2 ** 16 - 1;
    input.setAttribute("aria-invalid", isValid ? "false" : "true");
    if (!isValid) return;
    setPORT(validatedPORT);
    sendMessage({
      type: "PORT UPDATE",
      payload: validatedPORT,
    });
    window.close();
  });
}

main();
