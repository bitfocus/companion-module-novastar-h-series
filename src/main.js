import {
  InstanceBase,
  InstanceStatus,
  UDPHelper,
  Regex,
  runEntrypoint,
} from "@companion-module/base";

import { PRODUCTS_INFORMATION } from "../utils/constant.js";
import upgradeScripts from "./upgrades.js";

import { getActions } from "./actions.js";
import { getFeedbacks } from "./feedbacks.js";
import { getPresetDefinitions } from "./presets.js";
import { generatePresetList, generateScreenList } from "../utils/index.js";

class ModuleInstance extends InstanceBase {
  constructor(internal) {
    super(internal);
    // save freeze controlId
    this.freezeControlMap = {};

    // save ftb controlId
    this.ftbControlMap = {};

    this.screenList = generateScreenList();
    this.presetList = generatePresetList();
  }

  updateActions() {
    this.setActionDefinitions(getActions(this));
  }

  updateFeedbacks() {
    this.setFeedbackDefinitions(getFeedbacks(this));
  }

  getConfigFields() {
    return [
      {
        type: "static-text",
        id: "info",
        width: 12,
        label: "Information",
        value: PRODUCTS_INFORMATION,
      },
      {
        type: "textinput",
        id: "host",
        label: "IP Address",
        width: 6,
        default: "127.0.0.1",
        regex: Regex.IP,
      },
      {
        type: "textinput",
        id: "port",
        label: "Port",
        width: 6,
        default: "6000",
        regex: Regex.PORT,
      },
    ];
  }

  // When module gets deleted
  async destroy() {
    this.log("info", "destroy:" + this.id);
    if (this.udp !== undefined) {
      this.udp.destroy();
    }
  }

  initUDP() {
    if (this.udp !== undefined) {
      this.udp.destroy();
      delete this.udp;
    }

    if (this.config.host !== undefined) {
      this.udp = new UDPHelper(this.config.host, this.config.port);

      this.udp.on("error", (err) => {
        this.updateStatus(InstanceStatus.ConnectionFailure);
      });

      this.udp.on("listening", () => {
        this.log("debug", "UDP listening");
        this.updateStatus(InstanceStatus.Ok);
      });

      // If we get data, thing should be good
      this.udp.on("data", (msg) => {});

      this.udp.on("status_change", (status, message) => {
        this.log("debug", "UDP status_change: " + status);
      });
      this.log("debug", "initUDP finish");
    } else {
      this.log("error", "No host configured");
      this.updateStatus(InstanceStatus.BadConfig);
    }
  }
  /** devices cmd handle end */

  async configUpdated(config) {
    let resetConnection = false;

    if (this.config.host != config.host) {
      resetConnection = true;
    }

    this.log("info", "configUpdated module....");

    this.config = {
      ...this.config,
      ...config,
    };

    if (resetConnection) {
      this.updateStatus(InstanceStatus.Connecting);
      this.initUDP();
    }
    this.updateActions();
    this.updateFeedbacks();
  }

  async init(config) {
    this.config = {
      ...this.config,
      ...config,
    };

    this.updateStatus(InstanceStatus.Connecting);

    this.initUDP();

    this.updateActions();
    this.updateFeedbacks();
    this.setPresetDefinitions(getPresetDefinitions(this));
  }
}

runEntrypoint(ModuleInstance, upgradeScripts);
