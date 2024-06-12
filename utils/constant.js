export const PRODUCTS_INFORMATION =
  "This module will allow you to control the splicer";

export const ACTIONS_CMD = {
  play_preset: "W0605",
  freeze: "W040A",
  ftb: "W0409",
  brightness: "W0410",
};

export const SCREEN_COUNT_H = 40;

export const PRESET_COUNT_H = 128;

export const FREEZE_CHOICES = [
  { label: "Freeze", id: 1 },
  { label: "Unfreeze", id: 0 },
];

export const FTB_CHOICES = [
  { label: "FTB", id: 0 },
  { label: "Cancel FTB", id: 1 },
];

export const DEFAULT_COMMAND = '[{"cmd":"W041A","screenId":1,"enable":0}]';

export const OLD_ACTION_TO_NEW = {
  recall: "play_preset",
  brightness: "brightness",
  send: "send_command",
};
