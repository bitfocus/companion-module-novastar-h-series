import { SCREEN_COUNT_H, PRESET_COUNT_H, ACTIONS_CMD } from "./constant.js";

export const handleParams = (actionId, params) => {
  return Buffer.from(
    JSON.stringify([{ ...params, cmd: ACTIONS_CMD[actionId], deviceId: 0 }])
  );
};

export const generatePresetList = () => {
  return Array(PRESET_COUNT_H)
    .fill("")
    .map((_, index) => ({
      label: `Preset ${index + 1}`,
      id: index,
    }));
};

export const generateScreenList = () => {
  return Array(SCREEN_COUNT_H)
    .fill("")
    .map((_, index) => ({
      label: `Screen ${index + 1}`,
      id: index,
    }));
};
