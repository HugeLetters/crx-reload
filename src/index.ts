import z from "zod";
import { setPORT, getPORT, defaultPORT, type PortUpdateEvent } from "./config";

function main() {
  const input = document.querySelector<HTMLInputElement>("input#port");

  if (!input) {
    const errorDiv = document.createElement("div");
    errorDiv.innerText = "Something went wrong. Please reload the extension";
    return document.body.appendChild(errorDiv);
  }
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
    chrome.runtime.sendMessage<PortUpdateEvent>({
      type: "PORT UPDATE",
      payload: validatedPORT.data,
    });
    window.close();
  });
}
main();
