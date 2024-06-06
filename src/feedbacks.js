import { combineRgb } from "@companion-module/base";

export const getFeedbacks = (instance) => {
  return {
    freeze: {
      type: "boolean",
      name: "Freeze Status Detection",
      description: "Change the style when Freeze is pressed.",
      defaultStyle: {
        bgcolor: combineRgb(255, 0, 0),
        text: "Unfreeze",
      },
      options: [],
      callback: (feedback) => {
        const { controlId } = feedback;
        return instance.freezeControlMap[controlId] === 1;
      },
    },
    ftb: {
      type: "boolean",
      name: "FTB Status Detection",
      description: "Change the style when FTB is pressed.",
      defaultStyle: {
        bgcolor: combineRgb(255, 0, 0),
        text: "Cancel FTB",
      },
      options: [],
      callback: (feedback) => {
        const { controlId } = feedback;
        return instance.ftbControlMap[controlId] === 0;
      },
    },
  };
};
