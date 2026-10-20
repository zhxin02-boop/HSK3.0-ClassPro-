# ClassPro 多班试点说明

当前试点采用“班级命名空间隔离”：多个班共用课程代码，但学生名单、课堂消息、学习记录和教师看板都携带 `classId`，避免正常使用时串班。

## 已配置班级

班级配置位于 `source/shared/class-config.js`：

- `ai26401-spring`：留人工智能26401（来华项目-春），ZhangXin（张老师），HSK3；
- `rufe-2025-class-4`：俄财大25级4班，ZhangXin（张老师），HSK1；
- `ai26401-fall-class-1`：留人工智能26401（来华项目-秋）1班，WuMeiqi（武老师），HSK1；
- `ai26401-fall-class-2`：留人工智能26401（来华项目-秋）2班，WuMeiqi（武老师），HSK1。

公开的 Render 试点分支不提交真实学生姓名和学号。四个班目前都只包含一个显示名称为 `Student` 的测试身份，各班测试身份使用不同的学生 ID，测试记录不会串班。完整名单保留在本地，待改为私密后台读取后再启用。

四个班目前沿用课堂房间码 `8888`；真正的数据隔离由 `classId + room + lesson` 共同完成。

## 历史数据归属

为保留尚未完成分析的数据，旧表中没有 `班级ID`（或仍是 `legacy-default`）的记录按课程自动归属：

- `HSK1-*` → `rufe-2025-class-4`；
- `HSK3-*` → `ai26401-spring`。

这项兼容逻辑只在读取时解释旧记录，不会覆盖或删除原始 Google Sheets 数据。新提交会直接写入教师 ID、班级 ID 和学生 ID。

## 本地验证入口

启动 `node server.js` 后访问：

- 教师入口：`http://localhost:18765/source/teacher/index.html`
- 秋季 1 班：`http://localhost:18765/source/student/index.html?lesson=HSK1-L01&classId=ai26401-fall-class-1`
- 秋季 2 班：`http://localhost:18765/source/student/index.html?lesson=HSK1-L01&classId=ai26401-fall-class-2`
- 俄财大历史 HSK1 班：`http://localhost:18765/source/student/index.html?lesson=HSK1-L01&classId=rufe-2025-class-4`
- 春季 HSK3 班：`http://localhost:18765/source/student/index.html?lesson=HSK3-L01&classId=ai26401-spring`

教师入口会按 HSK 级别显示适用班级，生成的课程、学生、数据和批改链接都会保留 `teacherId` 与 `classId`。

## 教师登录与班级权限

网站首页保留“从你的角色进入 ClassPro”的教师端、学生端两张入口卡片。教师端先进入登录页，学生端先选择班级和姓名。教师端必须通过本地或正式部署的 ClassPro Node 服务打开，不能再作为纯静态页面单独发布。登录入口为：

`http://localhost:18765/source/teacher/login.html`

登录后服务器签发 8 小时有效的 HttpOnly 签名会话 Cookie：

- ZhangXin 只能访问 `ai26401-spring` 和 `rufe-2025-class-4`；
- WuMeiqi 只能访问 `ai26401-fall-class-1` 和 `ai26401-fall-class-2`。

密码只以 `scrypt` 摘要形式存放在本地 `data/teacher-accounts.json`。该文件被 Git 忽略，并且服务器禁止通过静态 URL 下载。部署时可复制 `data/teacher-accounts.example.json`，再设置真实账号摘要。生成新密码摘要：

```powershell
$env:CLASSPRO_PASSWORD='新密码'
node scripts/hash-classpro-password.js
Remove-Item Env:CLASSPRO_PASSWORD
```

教师数据面板通过 `/api/teacher/reviews` 读取数据，服务器会核验登录教师是否负责请求的班级；批改接口也执行相同的班级权限检查。部署环境通过 `CLASSPRO_SESSION_SECRET` 保持签名一致，服务重启后仍可验证未过期的会话。

## Google Sheets 升级

将更新后的 `source/data-model/ClassPro_GAS_v2.js` 重新部署为 Web App。脚本会在现有表格末尾使用以下三列：

- `教师ID`
- `班级ID`
- `学生ID`

重新部署前不要清空、迁移或手工改写旧记录。

## 当前边界

当前版本已经实现教师登录和班级授权，但仍属于轻量试点权限系统：

- 公开试点只包含各班 `Student` 测试身份，真实名单尚未接入私密后台；
- 教师即使修改其他班级的 `classId`，服务器也会返回 `403`；
- GAS 和 MQTT 仍使用共享公开凭据；
- 学生仍通过选择姓名进入，没有学生密码或短时课堂令牌；
- 测试身份仍位于静态课程配置中。

因此目前只适合受控试点，不应作为面向公众的正式多租户系统。

## 验证命令

```powershell
node scripts/validate-classpro-navigation.js
node scripts/validate-classpro-multiclass.js
node scripts/validate-classpro-auth.js
```
