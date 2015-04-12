{
	"up port" : {
		"actions" : [
			{
				"command" : "en"
			} , 
			{
				"expect" : "password:" ,
				"command" : "${VARS_SUPERPASSWORD}" , 
				"just for comment" : "expect #shellPrompt by default"
			} ,
			{
				"command" : "conf t"
			} , 
			{
				"command" : "int fa 0/${IMPORTS_PORT}"
			} , 
			{
				"command" : "no switchport port-security mac-address sticky"
			} , 
			{
				"command" : "shutdown"
			} , 
			{
				"command" : "no shutdown"
			} , 
			{
				"command" : "switchport port-security mac-address sticky"
			} , 
			{
				"command" : "end"
			}
		]
	} ,

	"down port" : {
		"actions" : [
			{
				"command" : "en"
			} , 
			{
				"expect" : "password:" ,
				"command" : "${VARS_SUPERPASSWORD}"
			} ,
			{
				"command" : "conf t"
			} ,
			{
				"command" : "int fa 0/${VARS_PORT}"
			} ,
			{
				"command" : "no switchport port-security mac-address sticky"
			} ,
			{
				"command" : "shutdown"
			} ,
			{
				"command" : "switchport port-security mac-address sticky"
			} ,
			{
				"command" : "end"
			}
		]
	}
}