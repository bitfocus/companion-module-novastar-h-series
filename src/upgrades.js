import { OLD_ACTION_TO_NEW } from "../utils/constant.js";

export default [
  /*
   * Place your upgrade scripts here
   * Remember that once it has been added it cannot be removed!
   */
  function (context, props) {
    const { actions } = props;
    const result = {
      updatedConfig: null,
      updatedActions: [],
      updatedFeedbacks: [],
    };
    for (const action of actions) {
      if (OLD_ACTION_TO_NEW[action.actionId]) {
        action.actionId = OLD_ACTION_TO_NEW[action.actionId];
        action.options.deviceId = 0;

        if (action.options.deviceid) {
          delete action.options.deviceid;
        }

        if (action.options.screenid) {
          action.options.screenId = action.options.screenid - 1;
          delete action.options.screenid;
        }

        if (action.options.presetid) {
          action.options.presetId = action.options.presetid - 1;
          delete action.options.presetid;
        }

        if (action.options.id_send) {
          action.options.command = action.options.id_send;
          delete action.options.id_send;
        }

        result.updatedActions.push(action);
      }
    }

    return result;
  },
];
