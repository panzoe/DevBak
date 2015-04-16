# DevBak
a Tool for autobakup Device configuration files

develop base on nw.js project

# 未使用过 nw.js 工具包的用户

1. 下载 DevBak 的源码包并解压（这里假设是 D:\DevBak\）
2. 从 [nw.js 官方网站](http://nwjs.io/) 下载合适运行时安装包（比如 [nwjs-v0.12.0-win-x64.zip](http://dl.nwjs.io/v0.12.0/nwjs-v0.12.0-win-x64.zip)）
3. 将压缩包中目录 nwjs-v0.12.0-win-x64 解压到源码目录中
4. 将 nwjs-v0.12.0-win-x64 目录重命名为 nw
5. 双击源码包中的 run.bat 即可运行

# 使用方法

1. 建立一份远程连接数据表 da.xlsx ，使用 excel2json.bat 转换成 DevBak.da
2. 修改用户设置文件 DevBak.us
3. 修改自定义脚本文件 DevBak.ss
4. 双击 run.bat 运行主程式

## 连接数据表

连接数据表用于保存远程计算机的连接信息，数据来源的 Excel 文件要求至少包含两列:计算机标识名，计算机地址
Excel 第一行必须为该列的字段标识名（要求纯英文字母或数字的结合），形如：

| Compute |   IpAddress  |   Owner  |
|---------|--------------|----------|
| DNF3C1T | 192.168.1.10 |   John   |
| DNF3C2T | 199.199.1.11 |   Jack   |
| DNF3C3T | 172.100.1.12 |   Ewan   |

将 Excel 文件保存为 da.xlsx 并与 excel2json.bat , excel2json.js 放在同一目录下，
确保当前操作系统安装了 Microsoft Office 2007 以上的办公软件，双击 excel2json.bat 静待转换工作完成，
如数据来源无问题，在同一目录下会生成转换后的 DevBak.da

## 用户设置文件

用户设置文件用于对程式运行参数进行调整，目前该文件支援四个参数的调整：

1. "KeyCol" : Excel 文件中计算机标识名字段
2. "ColCount" : Excel 中有效数据列数量
3. "ShellPrompt" : 登录远程计算机后，常规的用户提示符
4. "Timeout" : 连接远程计算机的超时时间

## 用户自定义批量工作脚本

批量脚本用户定义连接计算机后批量工作任务，脚本格式大致如：

```javascript
"test suse telnet" : {
		"actions" : [
			{
				"command" : "ls"
			} , 
			{
				"command" : "whoami"
			} , 
			{
				"command" : "echo $PATH"
			}
		]
	} , 
```

内容依此格式重复产生，其中：

1. *test suse telnet* 代表该任务名称，会出现在程式的任务选择列表中
2. *actions* 是固定格式，其内容第一组 *{ }* 包含的内容即为一个命令行操作 **action**
3. *expect* 与 *command* 为一组操作指示程式当如服务器返回信息与 *expect* 内容匹配，则向计算机发送 *command* 所指示的指令，若未指定 *expect* 则表示期待远程计算机返回常规的用户提示符
4. *command* 中允许使用变量,变量均为 *${范围前辍_变量名}* , 范围前辍目前有 *VARS_* 和 *IMPORTS_* , VARS_ 用于引用用户从程式界面上输入的内容，IMPORTS_ 用于引用用户在 da.xlsx 中定义的内容，如 *VARS_SUPERPASSWORD* 用于引用用户在程式界面上输入的 SuperPassword ，*${IMPORTS_PORT}* 则用于引用当前连接的计算机在 da.Excel 中对应的记录中 *PORT* 字段的值。

