import { io } from "socket.io-client";
import { defaultPORT, setPORT, getPORT, SWMessage, getSettings } from "./config";

chrome.runtime.onInstalled.addListener(() => {
  getPORT.then(PORT => {
    if (!PORT) setPORT(defaultPORT);
  });
});

getSettings.then(({ PORT, toggled }) => {
  let socketCleanup = toggled ? socketSetup(PORT ?? defaultPORT) : () => void false;
  !toggled && offBadge();

  chrome.runtime.onMessage.addListener((event: SWMessage) => {
    switch (event.type) {
      case "PORT UPDATE":
        PORT = event.payload;
        if (!toggled) return;
        socketCleanup();
        socketCleanup = socketSetup(PORT);
        break;
      case "TOGGLE UPDATE":
        toggled = event.payload;
        if (!toggled) return socketCleanup();
        socketCleanup = socketSetup(PORT ?? defaultPORT);
        break;
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
    offBadge();
  }
  return cleanUp;
}

function offBadge() {
  chrome.action.setBadgeText({ text: "off" });
  chrome.action.setBadgeBackgroundColor({ color: "#AAAAAA" });
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
