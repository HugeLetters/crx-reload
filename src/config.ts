const storage = chrome.storage.local;
const portKey = "port";
// C - 3, R - 18, X - 24;
export const defaultPORT = 31824;

export const getPORT = storage
  .get(portKey)
  .then(data => data[portKey] as number | undefined)
  .catch(e => {
    console.error(e);
    return defaultPORT;
  });
export const setPORT = (value: number) => storage.set({ [portKey]: value });

export type PortUpdateEvent = { type: "PORT UPDATE"; payload: number };
