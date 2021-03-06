var fso = new ActiveXObject("Scripting.FileSystemObject");
var objExcel =  new ActiveXObject("Excel.Application");

var pwd = fso.GetFolder(".").Path;

WScript.Echo("loading excel file : da.xlsx");

var objWorkbook = objExcel.Workbooks.Open(pwd + "\\da.xlsx");

var json = [];
json.push("[[]");

var condition = true;
var iteral = 1;

// make excel to json format like : [[""],["SN","PORT","IP"],["D7AB21","30","192.168.1.1"]]
while (condition) {
	if ((objExcel.Cells(iteral , 1) + "") != "undefined") {
		json.push(',["');
		json.push(objExcel.Cells(iteral , 1));
		json.push('","');
		json.push(objExcel.Cells(iteral , 2));
		json.push('","');
		json.push(objExcel.Cells(iteral , 3));
		json.push('"]');

		WScript.Echo(objExcel.Cells(iteral , 1) + " converted.");

		iteral++;

		continue;
	}
	break;
}

json.push("]")

WScript.Echo("writing into da file.")

var otxt = fso.CreateTextFile(pwd + "\\DevBak.da");
otxt.Close();
otxt = fso.OpenTextFile(pwd + "\\DevBak.da",8,true);
otxt.Write(json.join(""));
otxt.Close();

WScript.Echo("target created: DevBak.da");