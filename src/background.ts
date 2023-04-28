import { io } from "socket.io-client";
import { defaultPORT, setPORT, getPORT, PortUpdateEvent } from "./config";

chrome.runtime.onInstalled.addListener(() => {
  getPORT.then(PORT => {
    if (!PORT) setPORT(defaultPORT);
  });
});

getPORT.then(PORT => {
  let socketCleanup = socketSetup(PORT ?? defaultPORT);
  chrome.runtime.onMessage.addListener((event: PortUpdateEvent) => {
    if (event.type === "PORT UPDATE") {
      socketCleanup();
      socketCleanup = socketSetup(event.payload);
    }
  });
});

function socketSetup(PORT: number) {
  const socket = io(`http://localhost:${PORT}`, { transports: ["websocket"] });
  chrome.action.setBadgeText({ text: PORT.toString() });
  chrome.action.setBadgeBackgroundColor({ color: "red" });
  socket.on("crx-reload", reloadExtensions);
  socket.on("connect", () => chrome.action.setBadgeBackgroundColor({ color: "green" }));
  socket.on("disconnect", () => chrome.action.setBadgeBackgroundColor({ color: "red" }));

  function cleanUp() {
    socket.disconnect();
  }
  return cleanUp;
}

function reloadExtensions() {
  console.log("reloading unpacked extensions");
  chrome.management
    .getAll()
    .then(extensions =>
      extensions.filter(
        extension =>
          extension.name !== "CRX Reload" &&
          extension.enabled === true &&
          extension.installType === "development"
      )
    )
    .then(extensions => {
      extensions.forEach(({ id }) => {
        chrome.management
          .setEnabled(id, false)
          .finally(() => chrome.management.setEnabled(id, true));
      });
    });
}
