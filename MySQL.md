# Window 安装 Mysql 压缩档

## 获取
下载 MySQL [Community Server](http://dev.mysql.com/downloads/mysql/)（下载 zip 压缩档）以及 MySQL [Workbench](http://dev.mysql.com/downloads/workbench/)

解压 **Community Server** 压缩包（本文以 ${MYSQL} 指代 Mysql 的解压路径），将 ${MYSQL}\my-default.ini 档案重命名为：${MYSQL}\my.ini。


## 初始化
修改 ${MYSQL}\my.ini 内容中下面两行，下例中的路径为示例 mysql 的安装解压路径：

```properties
basedir = D:\db\mysql-5.7.12-winx64
datadir = D:\db\mysql-5.7.12-winx64\data
```

为方便以后偶尔操作命令行便利，可以创建 ${MYSQL}\data\目录以及 ${MYSQL}\mysql.cmd 档案，档案内容如下：

```bat
@ECHO OFF
SET PATH=%~dp0\bin;%PATH%

CMD /k "TITLE MYSQL Environment"
```

双击该档案会打开 Windows 命令行提示符，输入如下命令：

```cmd
mysqld --initialize --console
```

程式会以初始化方式在 ${MYSQL}\data 下生成基本的资料库数据，以及日志，在命令行的输出信息中：

```cmd
2000-01-01T02:18:51.119418Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
2000-01-01T02:18:52.521469Z 0 [Warning] InnoDB: New log files created, LSN=45790
2000-01-01T02:18:53.071296Z 0 [Warning] InnoDB: Creating foreign key constraint system tables.
2000-01-01T02:18:53.257098Z 0 [Warning] No existing UUID has been found, so we assume that this is the first time that this server has been started. Generating a new UUID: 8bfe3394-119e-11e6-b975-64006a2fd295.
2000-01-01T02:18:53.283289Z 0 [Warning] Gtid table is not ready to be used. Table 'mysql.gtid_executed' cannot be opened.
2000-01-01T02:18:53.288256Z 1 [Note] A temporary password is generated for root@localhost: l=6<Gcl:14kf
```

可以看到最后一行提示了，初始化的资料库管理员 **root** 用户的临时密码。这里注意保存好初始密码(l=6<Gcl:14kf)，之后要用。

## 安装 Mysql 服务

接着需要将 mysql 以 Windows 服务 的方式安装至系统中，右键点击 mysql.cmd 选择*以管理员身份运行*，在弹出的命令行提示符中输入：

```cmd
mysqld -install
```

接着可以输入指令直接启动 Mysql 服务：

```cmd
net start mysql
```

也可以通过右键点击 *我的电脑* -> *管理* -> *服务和应用程序* -> *服务*，在右侧的服务列表中控制名为：*Mysql* 的服务。

## 卸载

以与 *安装 Mysql 服务* 相同的方法打开命令行提示符，输入以下指令：

```cmd
net stop mysql
mysqld -remove
```

如指令过程中无错，接着删除 mysql 的存储目录即完成完全卸载工作。

## 登录
安装 MySQL Workbench 后启动主程序，程序会自动扫描当前计算机中已安装的 MySQL 实例，双击自己安装的服务结点，会提示输入管理员密码，该密码就是我们在初始 MySQL 时，命令行提示符中输出的密码，使用该密码登录，系统会提示修改新密码，修改完新密码后即可正常登录并工作。
