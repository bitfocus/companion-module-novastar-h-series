//Novastar H-series processor  for H2, H5, H9, H15 models

var udp = require('../../udp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
    var self = this;

    // super-constructor
    instance_skel.apply(this, arguments);

    self.actions(); // export actions
    self.init_presets();

    return self;
}

instance.prototype.updateConfig = function(config) {
    var self = this;
    self.init_presets();

    if (self.udp !== undefined) {
        self.udp.destroy();
        delete self.udp;
    }

    if (self.socket !== undefined) {
        self.socket.destroy();
        delete self.socket;
    }

    self.config = config;

    self.init_udp();
};

instance.prototype.init = function() {
    var self = this;

    debug = self.debug;
    log = self.log;
    self.init_presets();

    self.init_udp();
};

instance.prototype.init_udp = function() {
    var self = this;

    if (self.udp !== undefined) {
        self.udp.destroy();
        delete self.udp;
    }

    self.status(self.STATE_WARNING, 'Connecting');

    if (self.config.host !== undefined) {
        self.udp = new udp(self.config.host, self.config.port);

        self.udp.on('error', function(err) {
            debug("Network error", err);
            self.status(self.STATE_ERROR, err);
            self.log('error', "Network error: " + err.message);
        });

        // If we get data, thing should be good
        self.udp.on('data', function() {
            self.status(self.STATE_OK);
        });

        self.udp.on('status_change', function(status, message) {
            self.status(status, message);
        });
    }
};

// Return config fields for web config
instance.prototype.config_fields = function() {
    var self = this;

    return [{
            type: 'textinput',
            id: 'host',
            label: 'Target IP',
            width: 6,
            default: '192.168.1.10',
            regex: self.REGEX_IP
        },
        {
            type: 'textinput',
            id: 'port',
            label: 'Target Port',
            width: 2,
            default: 6000,
            regex: self.REGEX_PORT
        }
    ]
};

// When module gets deleted
instance.prototype.destroy = function() {
    var self = this;

    if (self.socket !== undefined) {
        self.socket.destroy();
    }

    if (self.udp !== undefined) {
        self.udp.destroy();
    }

    debug("destroy", self.id);;
};


instance.prototype.init_presets = function() {
    var self = this;
    var presets = [];

    self.setPresetDefinitions(presets);
}

instance.prototype.actions = function(system) {
    var self = this;

    self.system.emit('instance_actions', self.id, {

//----------------------------RECALL PRESETS------------------------------------

        'recall': {
            label: 'Recall Presets',
            options: [
              {
                    type: 'number',
                    label: 'Device ID',
                    id: 'deviceid',
                    min: 1,
                    max: 10,
                    default: 1,
                    required: true
                },
                {
                    type: 'number',
                    label: 'ScreenID',
                    id: 'screenid',
                    min: 1,
                    max: 40,
                    default: 1,
                    required: true
                },
              {
                    type: 'number',
                    label: 'Presets',
                    id: 'presetid',
                    min: 1,
                    max: 2000,
                    default: 1,
                    required: true
                }
            ]
        },
//--------------------------ADJUST BRIGHTNESS-----------------------------------

        'brightness': {
            label: 'Set brightness',
            options: [
              {
                    type: 'number',
                    label: 'Device ID',
                    id: 'deviceid',
                    min: 1,
                    max: 10,
                    default: 1,
                    required: true
                },
                {
                    type: 'number',
                    label: 'ScreenID',
                    id: 'screenid',
                    min: 1,
                    max: 40,
                    default: 1,
                    required: true
                },
                {
                    type: 'number',
                    label: 'Brightness',
                    id: 'brightness',
                    tooltip: 'Sets the brightness percent (0-100)',
                    min: 0,
                    max: 100,
                    default: 50,
                    step: 1.0,
                    required: true,
                    range: false
                }
            ]
        },
//-----------------------SWITCH LAYER SOURCE---------------------------------------
/*
        'switchlayer': {
            label: 'Switch Layer Input Source',
            options: [
              {
                    type: 'number',
                    label: 'Device ID',
                    id: 'deviceid',
                    min: 1,
                    max: 10,
                    default: 1,
                    required: true
                },
                {
                    type: 'number',
                    label: 'ScreenID',
                    id: 'screenid',
                    min: 1,
                    max: 40,
                    default: 1,
                    required: true
                },
                {
                    type: 'number',
                    label: 'Layer ID',
                    id: 'layerid',
                    min: 1,
                    max: 16,
                    default: 1,
                    required: true
                },
                {
                    type: 'number',
                    label: 'Input ID',
                    id: 'inputid',
                    min: 1,
                    max: 40,
                    default: 1,
                    required: true
                },
                {
                    type: 'dropdown',
                    label: 'Interface Type',
                    id: 'interfacetype',
                    default: '6',
                    choices: [
                      { id: '1', label: 'EXP'},
                      { id: '2', label: 'Single Link DVI'},
                      { id: '3', label: 'Dual Link DVI'},
                      { id: '4', label: 'HDMI1.3'},
                      { id: '5', label: 'HDMI1.4'},
                      { id: '6', label: 'HDMI2.0'},
                      { id: '7', label: 'DP1.1'},
                      { id: '8', label: 'DP1.2'},
                      { id: '9', label: '3G-SDI'},
                      { id: '10', label: 'VGA'},
                      { id: '11', label: 'CVBS'},
                      { id: '12', label: 'YpbPr'},
                      { id: '13', label: 'RJ45'},
                      { id: '14', label: 'USB'},
                      { id: '15', label: 'HDBaseT'},
                      { id: '16', label: 'HDBaseT-4K'},
                      { id: '17', label: 'OpticalFiber'},
                      { id: '18', label: '12G-SDI'}
                    ]
                },
                {
                    type: 'number',
                    label: 'Crop ID',
                    id: 'cropid',
                    min: 255,
                    max: 255,
                    default: 255,
                    required: true
                }
            ]
        },
        */
//------------------------------SEND COMMANDS ----------------------------------
                'send': {
                    label: 'Send Command',
                    options: [{
                            type: 'textinput',
                            id: 'id_send',
                            label: 'Command:',
                            default: '[{"cmd":"W0605","deviceId":0,"screenId":0,"presetId":0}]',
                            //[{"cmd":"W0605","deviceId":0,"screenId":0,"presetId":0}]
                            width: 6
                        },
                    ]
                }
//-----------------------FINISH CASES -----------------------------------------
    });
}

instance.prototype.action = function(action) {
    var self = this;
    var cmd;
    var end;
    var options = action.options;

    switch (action.action) {
//----------------------------------------------------------------------------
        case 'recall':
            var cmd_obj = [{
                "cmd": "W0605",
                "deviceId": parseInt(options.deviceid) - 1,
                "screenId": parseInt(options.screenid) - 1,
                "presetId": parseInt(options.presetid) - 1
            }];
            cmd = JSON.stringify(cmd_obj);
            console.log(cmd);
            break;
 //----------------------------------------------------------------------------
            case 'brightness':
              var cmd_obj = [{
                "cmd": "W0410",
                "deviceId": parseInt(options.deviceid) - 1,
                "screenId": parseInt(options.screenid) - 1,
                "brightness": parseInt(options.brightness)
              }];
              cmd = JSON.stringify(cmd_obj);
              console.log(cmd);
            break;
//----------------------------------------------------------------------------
  /*          case 'switchlayer':
                var cmd_obj = [{
                    "cmd": "W0506",
                    "deviceId": parseInt(options.deviceid) - 1,
                    "screenId": parseInt(options.screenid) - 1,
                    "layerId": parseInt(options.layerid),
                    "inputId": parseInt(options.inputid),
                    "interfaceType": parseInt(options.interfacetype),
                    "cropId": parseInt(options.cropid)
                }];
                cmd = JSON.stringify(cmd_obj);
                console.log(cmd);
                break;
                */
//----------------------------------------------------------------------------
            case 'send':
              cmd = unescape(action.options.id_send);
              end = action.options.id_end;
            break;
//----------------------------------------------------------------------------
    }
    var sendBuf = Buffer.from(cmd + end, 'latin1');

    if (sendBuf != '') {
        if (self.udp !== undefined) {
              debug('sending', sendBuf, "to", self.config.host);

            self.udp.send(sendBuf);
        }
    }
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;
