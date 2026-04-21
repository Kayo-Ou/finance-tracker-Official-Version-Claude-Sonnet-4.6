# Personal Finance Stats

一个基于前端本地 `localStorage` 构建的个人资产与财务可视化管理工具，无需后端，支持资产记录、统计、图表展示以及数据的导入导出。

## 项目结构

- `Dashboard.html` — 首页仪表盘，包含资产总览、资产分布、现金流、月度增长等可视化图表。
- `Asset-record.html` — 资产记录管理页，支持资产明细添加、删除、导入/导出等操作。
- `all-weather-portfolio.html`（如有） — 可选的投资组合分析页面。
- `CONTEXT.md` — 项目进展、约定与协作说明（仅协作参考）。

## 主要功能

### 资产记录页（Asset-record.html）

- 录入主要账户/平台资产及基金、股票市值
- 按日期记录，数据本地存储于浏览器 `localStorage`
- 支持**导出**资产记录为 `.json` 文件
- 支持**导入**历史/备份数据（自动覆盖全部记录）
- 头像自定义上传（本地-only）
- 删除、倒序（最新日期排第一），四种统计维度 Tab
- 兼容 PC 端主流浏览器

### 仪表盘（Dashboard.html）

- **Total Assets 折线图**：资产总额按日期变化趋势
- **Asset Distribution 饼图**及**Compound Growth Rate**：最新一条资产分布与复合增长率动态
- **Cash Flow 曲线图**：现金流历史趋势
- **Month-on-month Growth 柱状图**：近两期资产增减对比
- 所有图表数据均实时从 `localStorage` 读取，和“资产记录”同步
- 鼠标悬停交互、样式美观、数据无后端依赖

### 其他特色

- 数据仅存储于浏览器本地，不上传任何隐私数据
- 一键导入导出，方便迁移与备份（`.json` 文件）

## 使用说明

1. 推荐用新版 Chrome、Edge 打开
2. 直接打开 `Dashboard.html` 和 `Asset-record.html` 即可使用
3. 记录资产后，Dashboard 仪表盘图表会自动刷新
4. 利用“导入/导出”按钮进行数据迁移/恢复

## 开发&维护记录

- 资产记录和统计计算逻辑请见 `Asset-record.html` 的 JavaScript 段
- 仪表盘和可视化逻辑请见 `Dashboard.html` 的 JavaScript 段

## TODO

- 进一步优化交互和数据准确性
- 响应式适配（可选）
- 其他功能建议欢迎 issue/PR

---

本项目由 [Kayo-Ou](https://github.com/Kayo-Ou) 和 Copilot 辅助工具协作完成。