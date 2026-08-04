# ClassPro+ 发布流程与数据安全

更新时间：2026-08-04

## 1. 环境分工

- 本地环境：课程开发、页面调整和课堂前测试；修改后可立即刷新验证。
- GitHub `main`：正式线上版本；合并到 `main` 后由 GitHub Actions 自动发布到 GitHub Pages。
- Google Sheets + GAS：学生名单、答题记录、作业提交、教师批改和历史数据的正式存储，不随网页代码发布而删除。
- MQTT：课中实时互动、当前题目和排行榜状态，不作为历史数据存储。

## 2. 每课更新流程

1. 在本地完成课程数据、图片和页面测试。
2. 修改前将涉及文件备份到 `backups/日期-事项/`。
3. 只提交本次课程需要的代码、数据和资源，不提交学生记录、临时文件和本地日志。
4. 推送课程更新分支并创建 PR。
5. PR 检查通过后合并到 `main`。
6. GitHub Actions 自动部署 GitHub Pages；部署完成后再进行学生端、教师端和数据记录闭环验证。
7. 每课发布后保留版本标签，例如 `release-2026-07-22-L02`，便于恢复稳定版本。

## 3. 数据安全规则

- 不把学生答题记录和作业记录放入 Git 提交；正式记录只保存在 Google Sheets/GAS。
- 每次涉及 GAS 或表格结构调整前，先导出或复制 Google Sheets 备份。
- 网页重新部署只替换前端静态资源，不清空学生名单、课堂记录或教师批改记录。
- 课程数据与页面框架分离：后续课程优先新增课程数据文件，尽量不重复修改通用页面。

## 4. GAS 部署确认

当前需要部署到 Google Apps Script 的后端文件是：

`source/data-model/ClassPro_GAS_v2.js`

不要部署旧文件 `source/data-model/ClassPro_GAS_代码.js`。旧文件是早期版本，字段较少，不包含当前批改台需要的 `questionId/module/result/reviewStatus/__rowIndex` 等完整链路。

GAS 更新步骤：

1. 打开当前 Google Apps Script 项目。
2. 将 `source/data-model/ClassPro_GAS_v2.js` 的全部内容复制到 Apps Script 代码编辑器。
3. 保存。
4. 进入“部署 / Manage deployments”，编辑当前 Web App 部署。
5. 选择“新版本 / New version”，保持原来的执行身份和访问权限设置。
6. 部署后，用线上教师端批改台测试一次“本题全部正确 / 保存本题全部批改”，确认刷新后不再回到待批改列表。

注意：GitHub Pages 前端更新和 Google Apps Script 后端部署是两回事。推送 GitHub 只会更新网页；不会自动更新 GAS。

## 5. L02 线上验证入口

- 学生端课中：`source/in-class/student.html?lesson=HSK1-L02&room=8888&student=Test`
- 教师端课中：`source/in-class/teacher.html?lesson=HSK1-L02&room=8888`
- 课前：`source/pre-class/index.html?lesson=HSK1-L02`
- 课后：`source/post-class/student-report.html?lesson=HSK1-L02&room=8888&student=Test`

部署后的验证顺序：教师进入并开始题目 → Test 学生进入并答题 → 教师公布答案 → 检查已答/未答状态 → 检查 GAS 数据记录。
