# ClassPro+ 发布流程与数据安全

更新时间：2026-07-22

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

## 4. L02 线上验证入口

- 学生端课中：`source/in-class/student.html?lesson=HSK1-L02&room=8888&student=Test`
- 教师端课中：`source/in-class/teacher.html?lesson=HSK1-L02&room=8888`
- 课前：`source/pre-class/index.html?lesson=HSK1-L02`
- 课后：`source/post-class/student-report.html?lesson=HSK1-L02&room=8888&student=Test`

部署后的验证顺序：教师进入并开始题目 → Test 学生进入并答题 → 教师公布答案 → 检查已答/未答状态 → 检查 GAS 数据记录。
