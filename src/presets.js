import { combineRgb } from "@companion-module/base";

const getFreezePresets = (screenList) => {
  const freezePresets = {};
  const ftbPresets = {};
  screenList.forEach((screen) => {
    const { label, id } = screen;
    const freezePreset = {
      type: "button",
      category: "Freeze & Unfreeze",
      name: label,
      style: {
        text: "Freeze \n" + label,
        size: "14",
        color: combineRgb(255, 255, 255),
        bgcolor: combineRgb(0, 0, 0),
      },
      steps: [
        {
          down: [
            {
              actionId: "freeze",
              options: {
                screenId: id,
                enable: 1,
              },
            },
          ],
        },
        {
          down: [
            {
              actionId: "freeze",
              options: {
                screenId: id,
                enable: 0,
              },
            },
          ],
        },
      ],
      feedbacks: [
        {
          feedbackId: "freeze",
          style: {
            bgcolor: combineRgb(255, 0, 0),
            text: "Unfreeze \n" + label,
          },
          options: {},
        },
      ],
    };
    freezePresets[`freeze_screen ${id}`] = freezePreset;
    const ftbPrest = {
      type: "button",
      category: "FTB & Cancel FTB",
      name: label,
      style: {
        text: "FTB \n" + label,
        size: "14",
        color: combineRgb(255, 255, 255),
        bgcolor: combineRgb(0, 0, 0),
      },
      steps: [
        {
          down: [
            {
              actionId: "ftb",
              options: {
                screenId: id,
                type: 0,
              },
            },
          ],
        },
        {
          down: [
            {
              actionId: "ftb",
              options: {
                screenId: id,
                type: 1,
              },
            },
          ],
        },
      ],
      feedbacks: [
        {
          feedbackId: "ftb",
          style: {
            bgcolor: combineRgb(255, 0, 0),
            text: "Cancel FTB \n" + label,
          },
          options: {},
        },
      ],
    };
    ftbPresets[`ftb_screen ${id}`] = ftbPrest;
  });

  return {
    ftbPresets,
    freezePresets,
  };
};

export const getPresetDefinitions = function (instance) {
  const { ftbPresets, freezePresets } = getFreezePresets(instance.screenList);

  return {
    ...freezePresets,
    ...ftbPresets,
  };
};
