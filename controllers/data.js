"use strict";

let fs = require("fs");

let UserScript = {};
let UserData = {};
let UserSettting = {};

$(function(){
	let loadConfiguration = function(file_name) {
		let script_content = null;

		try {
			script_content = fs.readFileSync(file_name , "utf8");
		}
		catch (ex) {
			sweetAlert({
				title : "Error" , 
				text : "Error while loading file '" + file_name + "'! \n" + 
					   "for the first time , you should make it by app." , 
				type : "error"
			});

			return {};
		}

		try {
			script_content = JSON.parse(script_content);
		}
		catch (exp) {
			sweetAlert({
				title : "Error" , 
				text : "Format Error in file " + file_name + "." , 
				type : "error"
			});

			return {};
		}

		return script_content;
	};

	UserScript = loadConfiguration("DevBak.ss");
	UserData = loadConfiguration("DevBak.da");
	UserSettting = loadConfiguration("DevBak.us");

	UserSettting.ColCount = +(UserSettting.ColCount);

	// convert DevBak.da
	if ("[object Array]" === Object.prototype.toString.apply(UserData)) {
		if (UserData.length < 3) return;
		UserData.shift();

		let cols = UserData.shift();
		let keyCol = 0;

		for (let idx = 0 ; idx < UserSettting.ColCount ; idx++) {
			if (cols[idx] === UserSettting.KeyCol) {
				keyCol = idx;
			}
		}

		let userData = {};
		for (let idx = 0 ; idx < UserData.length ; idx++) {
			let data = userData[UserData[keyCol]] = {};

			for (let jdx = 0 ; jdx < UserSettting.ColCount ; jdx++) {
				data[keyCol[jdx]] = UserData[idx][jdx];
			}
		}

		userData = JSON.stringify(userData);

		console.log(userData);
	}
});