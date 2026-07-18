# Chinese ClassPro（HSK3.0）数据存储架构

## 存储方式
Google Sheets + Google Apps Script（GAS），沿用原有架构。
Sheet ID: 1ILjSScbsUKwh7za0iEzRcHWOJf3QnonrTaIafEkbhiw

## 统一记录格式（11列）

| 列名 | 说明 | 示例 |
|---|---|---|
| 提交时间 | 自动生成 | 2026-07-06 14:30 |
| 姓名 | 学生姓名 | Mwasonya |
| 课程 | 课次代码 | HSK1-L02 |
| 环节 | 预习/课中/课后 | 预习 |
| 模块 | 具体模块名称 | R1词义闯关 |
| 得分 | 该题/模块得分 | 8 |
| 总分 | 该题/模块总分 | 10 |
| 薄弱点 | 知识点标签 | 词汇：认识 |
| 学生作答 | 学生原始回答 | 我叫Mwasonya |
| 教师批改 | 教师纠错内容 | 正确句子... |
| 批改状态 | 无需批改/待批改/已批改 | 待批改 |

## 存储结构

同一个Sheet文件，每课一个Tab，Tab名=课程代码。
所有Tab列结构一致。旧数据Tab可归档或保留。

## GAS接口

| 接口 | 功能 |
|---|---|
| GET ?action=list_sheets | 列出所有课次 |
| GET ?action=get_all | 读取全部课次数据(JSON) |
| GET ?action=get_data&lesson=X | 读取指定课数据 |
| POST(正常写入) | 写入一条学习记录 |
| POST action=save_score | 教师批改(打分+纠错) |
## POST 数据格式

学生端POST(客观题)时用sendBeacon避免CORS预检。
详情参考测试页面 source/pre-class/HSK1-L02_课堂测试.html

## 教师批改页面

source/teacher-dashboard/review.html
独立的HTML页面，通过本地服务器访问，不经GAS Caja过滤器。

## 部署步骤

1. GAS代码在 source/data-model/ClassPro_GAS_代码.js
2. 替换到Google Apps Script编辑器，部署为Web App
3. 执行身份设为"任何人"
4. 教师批改页面通过本地服务器(http://localhost:18765)访问
