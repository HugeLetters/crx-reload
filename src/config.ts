const storage = chrome.storage.local;
const portKey = "port";
const toggledKey = "switch";
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

export type SWMessage =
  | { type: "PORT UPDATE"; payload: number }
  | { type: "TOGGLE UPDATE"; payload: boolean };

export const getToggled = storage
  .get(toggledKey)
  .then(data => data[toggledKey] as boolean | undefined)
  .catch(e => {
    console.error(e);
    return false;
  });
1;
export const setToggled = (value: boolean) => storage.set({ [toggledKey]: value });

export const sendMessage = chrome.runtime.sendMessage<SWMessage>;

export const getSettings = storage
  .get([toggledKey, portKey])
  .then(data => ({
    toggled: data[toggledKey] as boolean | undefined,
    PORT: data[portKey] as number | undefined,
  }))
  .catch(e => {
    console.error(e);
    return { toggled: false, PORT: defaultPORT };
  });
