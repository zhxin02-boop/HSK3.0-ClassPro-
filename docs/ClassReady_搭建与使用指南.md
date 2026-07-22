# ClassReady 搭建与使用指南

> 本文档记录 ClassReady（HSK3.0 预习模块）从搭建到上线的完整过程，包括环境配置、关键决策、操作流程和常见问题排查。供后续开发与维护人员参考。

---

## 一、系统概览

### 1.1 ClassReady 是什么

ClassReady 是 **Chinese ClassPro（HSK3.0）** 体系中的**课前预习模块**。
学生通过浏览器完成预习测试（选择题 + 开放题），数据上传到 Google Sheets，
教师在批改页面查看并评分，学生随后可查看批改反馈。

### 1.2 数据流全景

```
学生测试页 -> navigator.sendBeacon POST -> GAS 脚本 -> Google Sheets
                                                          |
教师批改页 (fetch) -> GAS POST -> 更新得分/批语/状态
                                                          |
学生查看页 (fetch/JSONP) -> GAS GET -> 展示批改结果
```

### 1.3 技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| 学生端 | HTML + CSS + JS (Vanilla) + Vue 3 | 测试页用原生 JS，主页用 Vue 3 |
| 数据层 | Google Apps Script + Google Sheets | 云端存储，无服务器依赖 |
| 教师端 | HTML + CSS + JS (Vanilla) | 纯前端，直接与 GAS 通信 |
| 本地开发 | Node.js (server.js) / Python http.server | 本地调试用 |
| 生产部署 | GitHub Pages | 学生通过 HTTPS 访问 |

### 1.4 核心设计原则

1. **数据统一在 Google Sheets** -- 所有端通过同一 GAS API 读写
2. **学生端无需本地服务器** -- 双击 HTML 或用 GitHub Pages 即可访问
3. **教师批改有反馈** -- 用 fetch() 代替 sendBeacon，失败时提示
4. **时间戳匹配用毫秒数** -- 避免不同时区/格式导致匹配失败

---

## 二、环境配置与部署

### 2.1 前提条件

- **Google 账号**（用于 Google Sheets + Google Apps Script）
- **GitHub 账号**（用于 GitHub Pages 部署）
- **Node.js**（可选，用于本地调试）
- **浏览器**（Chrome / Edge 最新版）

### 2.2 Google Sheets + GAS 设置（首次部署）

**Step 1：创建 Google Sheets**
1. 打开 https://sheets.new 创建新表格
2. 复制表格 URL 中的 Sheet ID（/d/ 和 /edit 之间的一长串）

**Step 2：部署 Google Apps Script**
1. 打开 https://script.google.com 新建项目
2. 将 `source/data-model/ClassPro_GAS_代码.js` 全部内容复制到编辑器
3. 修改代码顶部的 `SHEET_ID` 为你的 Sheet ID
4. 保存后点击「部署」->「新建部署」
5. 类型选择「Web 应用」，执行身份选择「任何人」
6. 复制生成的部署 URL

**Step 3：配置 GAS URL**
将部署 URL 更新到以下文件中的 `GAS_URL` / `U` 变量：
- `source/pre-class/HSK1-L02_课堂测试.html` -- GAS_URL
- `source/pre-class/index.html` -- GAS_URL
- `source/teacher-dashboard/review.html` -- U
- `server.js`（代理接口）-- gasUrl

### 2.3 本地开发环境

**方式 A：使用 Node.js server.js（推荐）**
```
cd 项目根目录
node server.js
```
服务器运行在 `http://localhost:18765`

**方式 B：使用 Python 临时服务器**
```
python -m http.server 8000
```
服务器运行在 `http://localhost:8000`

访问地址：
- 学生端：`http://localhost:18765/source/pre-class/index.html`
- 测试页：`http://localhost:18765/source/pre-class/HSK1-L02_课堂测试.html`
- 教师批改：`http://localhost:18765/source/teacher-dashboard/review.html`

### 2.4 GitHub Pages 部署（生产环境）

1. 将整个项目推送到 GitHub 仓库
2. 仓库 Settings -> Pages -> 选择 main 分支，根目录发布
3. 学生访问：`https://用户名.github.io/仓库名/source/pre-class/index.html`
4. 教师批改：`https://用户名.github.io/仓库名/source/teacher-dashboard/review.html`

---

## 三、学生端操作流程

### 3.1 测试答题页

**文件：** `source/pre-class/HSK1-L02_课堂测试.html`

提交方式：`navigator.sendBeacon(GAS_URL, blob)` -- POST，fire-and-forget

选择题提交数据：`{studentName, lesson, module, score, total, answer, openEnded:"no"}`
开放题提交数据：`{studentName, lesson, module, score:0, total:10, answer, openEnded:"yes"}`

### 3.2 查看批改结果

**文件：** `source/pre-class/index.html`（Vue 3 应用）

**状态标签含义：**
- 已批改（绿色）-- 教师已完成批改
- 待批改（橙色）-- 等待教师批改
- 自动评分（蓝色）-- 选择题自动评分

---

## 四、教师端操作流程

### 4.1 批改页面

**文件：** `source/teacher-dashboard/review.html`

批改 API 调用：
```js
fetch(GAS_URL, {method:'POST', body: JSON.stringify({
  action: 'save_score',
  lesson: row.cells[2].textContent,
  timestamp: row.cells[0].textContent,
  studentName: row.cells[1].textContent,
  score: sc,
  correction: fix
})})
```

---

## 五、GAS API 参考

### 5.1 GET 接口

| Action | 参数 | 返回 | 用途 |
|--------|------|------|------|
| get_all | 无 | {status, data:{课名:[记录]}} | 获取全部数据 |
| get_data | lesson=课名 | {status, data:[记录]} | 获取指定课程数据 |
| list_sheets | 无 | {status, sheets:[课名]} | 列出所有课程 |
| (无) | 无 | 返回内置批改 HTML | 直接访问 GAS URL |

**JSONP 支持：** 加 `&callback=函数名` 可绕过 CORS 限制

### 5.2 POST 接口

| Action | 必要字段 | 用途 |
|--------|---------|------|
| save_score | lesson, timestamp, studentName, score, correction | 教师批改 |
| mark_reviewed | lesson, timestamp, studentName, correction | 仅标记已批改 |
| (无) | studentName, lesson, module, score, total, answer, openEnded | 学生提交 |

---

## 六、关键问题与解决方案

### 6.1 时间戳匹配失败

**问题：** saveScore 用 formatDate 格式化日期，浏览器发 ISO 字符串，比对失败。
**解决：** 改用 Date.getTime() 毫秒数比对，容忍 2 秒误差。

### 6.2 navigator.sendBeacon 无反馈

**问题：** fire-and-forget 不返回响应，教师以为保存成功实则失败。
**解决：** 改用 fetch() POST，根据返回结果决定是否更新 UI。

### 6.3 file:// 下跨域被拦

**问题：** file:// 协议 fetch GAS 被 CORS 拦截。
**解决：** 部署到 GitHub Pages（HTTPS），或本地用 HTTP 服务器。

### 6.4 Vue 3 全局变量不可访问

**问题：** {{D.lessonTitle}} 中 D 需要在 setup 显式返回。
**解决：** return {D, p, mi, ...} 注入组件上下文。

### 6.5 课前批改队列识别经验（必须固化）

课前记录不能根据课程模块名称判断是否需要批改。不同课程的主观题模块名称可能不同，例如自我介绍、开放式对话、翻译练习等；如果只维护一组固定模块名，新课程很容易出现“数据已保存，但批改台不显示”的问题。

统一规则：

- `stage` 为 `预习` / `课前`，且 `openEnded` 为 `yes` 或 `true`：进入课前待批改队列。
- `openEnded` 为 `no`：不进入批改队列，只用于学习记录和统计。
- `reviewStatus` 为 `已批改`，或已有教师反馈：从待批改队列隐藏，但原始记录必须保留。
- 页面显示应同时区分“已读取的课前记录数”和“课前待批改数”，避免把“待批改为 0”误认为“课前数据没有读取”。
- 批改台应优先读取标准字段；对历史 GAS 行数据，才使用固定列位置作为兼容回退，不应再依赖模块名称猜测。

排查顺序：

1. 先检查 `/api/reviews` 或 GAS 返回的数据总量。
2. 再按 `lesson / studentName / stage` 检查课前记录是否存在。
3. 再检查 `openEnded / reviewStatus / teacherFeedback`。
4. 最后检查页面的待批改筛选，不要先修改课程数据。

---

## 七、文件索引

| 文件路径 | 用途 | 关键依赖 |
|----------|------|----------|
| source/data-model/ClassPro_GAS_代码.js | GAS 核心逻辑 | Google Sheets |
| source/pre-class/HSK1-L02_课堂测试.html | 学生测试答题页 | GAS URL |
| source/pre-class/index.html | 学生主页（含查看批改） | Vue 3, GAS URL |
| vue.global.prod.js | Vue 3 本地构建 | - |
| source/teacher-dashboard/review.html | 教师批改页面 | GAS URL |
| server.js | 本地服务器 + GAS 代理 | Node.js |
| docs/architecture-HSK1-L2.md | 技术架构说明 | - |
| docs/ClassReady_搭建与使用指南.md | **本文档** | - |

---

## 八、当前状态与后续规划

### 已完成功能

| 功能 | 状态 |
|------|------|
| 学生测试答题（选择题+开放题） | 完成 |
| 数据提交到 Google Sheets | 完成 |
| 教师在线批改 | 完成 |
| 学生查看批改结果 | 完成 |
| GAS 时间戳匹配修复 | 完成 |
| 教师批改反馈优化 | 完成 |
| 架构文档整理 | 完成 |

### 待改进

| 项目 | 优先级 | 说明 |
|------|--------|------|
| 多课支持 | 高 | 目前仅 HSK1-L02 |
| 课程选择页 | 中 | 学生可选不同课程 |
| 后端 GAS 增加唯一 ID | 中 | 避免纯依赖时间戳匹配 |
| 预习模块完整流程 | 中 | R0-R6 内容待完善 |

---

*文档版本：v1.0 | 最后更新：2026-07-07*
