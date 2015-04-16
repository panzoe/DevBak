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

	// convert number type
	UserSettting.ColCount = +(UserSettting.ColCount);

	/* convert DevBak.da
	* eg.
	* [[""],["SN","PORT","IP"],["D7AB21","30","192.168.1.1"]]
	* to
	* {
	*	"7D001" : {
	*		"port" : "1" , 
	*		"ip" : "10.176.50.30"
	*	}
	* }
	*/
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
			let record = UserData[idx];
			let data = userData[String(record[keyCol]).toUpperCase()] = {};

			for (let jdx = 0 ; jdx < UserSettting.ColCount ; jdx++) {
				data[String(cols[jdx]).toUpperCase()] = record[jdx];
			}
		}

		fs.writeFileSync("DevBak.da" , JSON.stringify(userData));

		UserData = userData;
	}
});