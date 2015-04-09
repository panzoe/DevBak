"use strict";

const telnet = require("telnet-client");

class AutoAction {
	constructor(param) {
		this.hooks = {};
		this.options = param.options;
		this.script = param.script;
		this.callback = param.callback;

		this.client = new telnet();

		this.client.on("ready" , (function(){
			let self = this;
			return function(prompt){

				if (self.hooks.onready) {
					self.hooks.onready.apply(this , [prompt]);
				}
			}
		})());

		this.client.on("timeout" , (function(){
			let self = this;
			return function(){

				if (self.hooks.ontimeout) {
					self.hooks.ontimeout.apply(this);
				}
			}
		})());

		this.client.on("close" , (function(){
			let self = this;
			return function(){

				if (self.hooks.onclose) {
					self.hooks.onclose.apply(this);
				}
			}
		})());
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
		this.pre_options = param.pre_options;
	};

	create(options) {
		let full_options = Object.create(this.pre_options);

		for (let i in options) {
			full_options[i] = options[i];
		}

		let callback = full_options.callback;
		delete full_options.callback;

		return new AutoAction({
			script : this.script , 
			options : full_options , 
			callback : callback
		});
	};
}