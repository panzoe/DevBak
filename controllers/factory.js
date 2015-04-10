"use strict";

const telnet = require("telnet-client");

class AutoAction {
	constructor(param) {
		this.hooks = {};
		this.options = param.options;
		/**
		* @type {[{"expect" : String , "command" : String}]}
		*/
		this.script = param.script;
		this.callback = param.callback;

		this.client = new telnet();

		// bind task information into orign telnet objects
		this.autoaction = this;

		this.client.on("ready" , function(prompt){
			let autoaction = this.autoaction;
			let task = autoaction.script.shift();
			if (hooks.onready) {
				autoaction.hooks.onready.apply(this , [prompt]);
			}
		});

		this.client.on("timeout" , (function(){
			if (this.autoaction.hooks.ontimeout) {
				this.autoaction.hooks.ontimeout.apply(this);
			}
		});

		this.client.on("close" , (function(){
			if (this.autoaction.hooks.onclose) {
				this.autoaction.hooks.onclose.apply(this);
			}
		});
	};

	hook(hooks) {
		this.hooks = hooks;
	}

	start(callback) {
		this.callback = callback;
		this.client.connect(this.options);
	};
}

class Factory {
	constructor(param) {
		this.script = param.script;
		this.pre_options = param.options;
		this.callback = param.callback;
	};

	create(options) {
		let full_options = Object.create(this.pre_options);

		for (let i in options) {
			full_options[i] = options[i];
		}

		let callback = function(){};
		if (full_options.callback) {
			callback = full_options.callback;
			delete full_options.callback;
		}		

		return new AutoAction({
			script : this.script , 
			options : full_options , 
			callback : callback
		});
	};
}