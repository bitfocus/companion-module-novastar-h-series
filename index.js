const { InstanceBase, Regex, runEntrypoint, InstanceStatus, UDPHelper } = require('@companion-module/base')

class HInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.init_udp()
		this.init_presets()

		this.updateActions() // export actions

	}

	// When module gets deleted
	async destroy() {

		if (this.udp) {
			this.udp.destroy()
		}
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {

		if (this.udp !== undefined) {
			this.udp.destroy()
			delete this.udp
		}

		this.config = config

		this.init_udp()
	}

	// Return config fields for web config
	getConfigFields() {

		return [{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			default: '192.168.1.10',
			regex: Regex.IP
		},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 2,
				default: 6000,
				regex: Regex.PORT
			}
		]
	}

	updateActions() {
		this.setActionDefinitions({

//----------------------------RECALL PRESETS------------------------------------

			'recall': {
				name: 'Recall Presets',
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
				],
				callback: (action) => {
					this.execute_action(action)
				}
			},
//--------------------------ADJUST BRIGHTNESS-----------------------------------

			'brightness': {
				name: 'Set brightness',
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
				],
				callback: (action) => {
					this.execute_action(action)
				}
			},
//-----------------------SWITCH LAYER SOURCE---------------------------------------
			/*
							'switchlayer': {
									name: 'Switch Layer Input Source',
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
									],
				callback: () => {

					this.execute_action(action)
					}

							},
							*/
//------------------------------SEND COMMANDS ----------------------------------
			'send': {
				name: 'Send Command',
				options: [{
					type: 'textinput',
					id: 'id_send',
					label: 'Command:',
					default: '[{"cmd":"W0605","deviceId":0,"screenId":0,"presetId":0}]',
					//[{"cmd":"W0605","deviceId":0,"screenId":0,"presetId":0}]
					width: 6
				}
				],
				callback: (action) => {
					this.execute_action(action)
				}
			}
//-----------------------FINISH CASES -----------------------------------------
		})
	}


	execute_action(action) {
		var self = this
		var cmd
		var options = action.options

		switch (action.actionId) {
//----------------------------------------------------------------------------
			case 'recall':
				var cmd_obj = [{
					'cmd': 'W0605',
					'deviceId': +options.deviceid - 1,
					'screenId': +options.screenid - 1,
					'presetId': +options.presetid - 1
				}]
				cmd = JSON.stringify(cmd_obj)
				this.log('info',cmd)
				break
			//----------------------------------------------------------------------------
			case 'brightness':
				var cmd_obj = [{
					'cmd': 'W0410',
					'deviceId': +options.deviceid - 1,
					'screenId': +options.screenid - 1,
					'brightness': +options.brightness
				}]
				cmd = JSON.stringify(cmd_obj)
				this.log('info',cmd)
				break
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
				this.log('info',cmd)
										break;
										*/
//----------------------------------------------------------------------------
			case 'send':
				cmd = unescape(action.options.id_send)
				this.log('info',cmd)
				break
//----------------------------------------------------------------------------
			default:
				throw new Error('No action case matched');
		}
		const sendBuf = Buffer.from(cmd, 'latin1')

		if (sendBuf !== '') {
			if (self.udp !== undefined) {
				this.log('debug', 'sending ' +  sendBuf +  ' to ' + self.config.host)

				self.udp.send(sendBuf)
			}
		}
	}

// 	-------
	init_udp() {
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.udp = new UDPHelper(this.config.host, this.config.port)
			this.updateStatus(InstanceStatus.Ok)

			this.udp.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

			// If we get data, thing should be good
			this.udp.on('listening', () => {
				this.updateStatus(InstanceStatus.Ok)
			})

			this.udp.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	init_presets() {
		this.setPresetDefinitions([])
	}

}

runEntrypoint(HInstance, [])
