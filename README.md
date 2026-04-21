# Personal Finance Stats

一个基于前端本地 `localStorage` 构建的个人资产与财务可视化管理工具，无需后端，支持资产记录、统计、图表展示以及数据的导入导出。

## 项目特性

- 📊 **多维度财务可视化**：提供资产总览、分布、现金流、月度增长等图表
- 💰 **资产记录管理**：支持多账户、多资产类型的记录和管理
- 📈 **投资组合分析**：包含全天候投资组合分析功能
- 🔄 **数据导入导出**：支持 JSON 格式的数据备份和恢复
- 👤 **个性化头像**：支持自定义头像上传
- 🔐 **数据安全**：所有数据仅存储于浏览器本地，保护隐私

## 项目结构

- [index.html](index.html) — 统一入口页面，包含导航和页面切换功能
- [Dashboard.html](Dashboard.html) — 首页仪表盘，包含资产总览、资产分布、现金流、月度增长等可视化图表
- [Asset-record.html](Asset-record.html) — 资产记录管理页，支持资产明细添加、删除、导入/导出等操作
- [All-weather-portfolio.html](All-weather-portfolio.html) — 投资组合分析页面，支持多账户投资组合跟踪
- [style.css](style.css) — 全局样式文件，包含所有页面的统一CSS样式
- [Javascript.js](Javascript.js) — 全局JavaScript文件，包含所有页面的公共功能和工具函数
- [README.md](README.md) — 项目说明文档

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
- 所有图表数据均实时从 `localStorage` 读取，和"资产记录"同步
- 鼠标悬停交互、样式美观、数据无后端依赖

### 全天候投资组合（All-weather-portfolio.html）

- **双账户支持**：平安账户和雪球账户
- **实际 vs 目标比例**：对比实际资产配置与目标配置
- **调整建议**：提供具体的投资调整建议
- **实时比例图表**：动态展示资产配置情况
- **记录管理**：支持添加和删除历史记录

### 其他特色

- 数据仅存储于浏览器本地，不上传任何隐私数据
- 一键导入导出，方便迁移与备份（`.json` 文件）
- 统一的导航系统，支持页面间快速切换
- 响应式设计，适配不同屏幕尺寸

## 使用说明

1. 推荐用新版 Chrome、Edge 打开
2. 直接打开 [index.html](index.html) 或各独立页面即可使用
3. 记录资产后，Dashboard 仪表盘图表会自动刷新
4. 利用"导入/导出"按钮进行数据迁移/恢复
5. 在"全天候投资组合"页面跟踪您的投资配置

## 技术栈

- **HTML5**：页面结构
- **CSS3**：样式设计
- **JavaScript (ES6+)**：业务逻辑
- **Chart.js**：数据可视化
- **localStorage**：数据持久化

## 开发&维护记录

- 资产记录和统计计算逻辑请见 [Asset-record.html](Asset-record.html) 和 [Javascript.js](Javascript.js) 的 JavaScript 段
- 仪表盘和可视化逻辑请见 [Dashboard.html](Dashboard.html) 和 [Javascript.js](Javascript.js) 的 JavaScript 段
- 投资组合分析逻辑请见 [All-weather-portfolio.html](All-weather-portfolio.html) 和 [Javascript.js](Javascript.js) 的 JavaScript 段

## 贡献

欢迎提交 Issue 和 Pull Request 来改进此项目。

## License

本项目为个人开源项目，可自由使用。

---

本项目由 [Kayo-Ou](https://github.com/Kayo-Ou) 和 Copilot 辅助工具协作完成。