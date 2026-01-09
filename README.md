<div align="center">
<img width="1200" height="475" alt="ChromaExtract Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# ChromaExtract - 图像主题颜色提取工具

一个现代化的图像和MP3封面颜色调色板提取工具，基于React和TypeScript构建

[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-red.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple.svg)](https://vitejs.dev/)

</div>

## ✨ 特性

- 🎨 **智能颜色提取** - 从图片中自动提取主色调调色板
- 🎵 **MP3封面提取** - 支持从MP3文件中提取专辑封面并分析颜色
- 🎯 **智能过滤** - 排除黑白颜色或保留所有颜色选项
- 📊 **颜色统计** - 显示每种颜色的出现频率和百分比
- 📋 **一键复制** - 轻松复制HEX、RGB颜色值
- 🚀 **批量处理** - 支持批量上传和颜色提取
- 🎪 **现代化UI** - 响应式设计，美观的用户界面
- ⚡ **高性能** - 基于Canvas API实现快速颜色分析

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装和运行

1. **克隆项目**
```bash
git clone https://github.com/Domdkw/theme-color-extraction.git
cd theme-color-extraction
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **打开浏览器访问**
```
http://localhost:5173
```

### 构建生产版本

```bash
# 构建项目
npm run build

# 预览生产版本
npm run preview
```

## 📖 使用方法

### 基本操作

1. **上传图片**
   - 点击"上传图片"按钮选择图片文件
   - 支持JPG、PNG、WebP等常见格式

2. **上传MP3文件**
   - 点击"上传MP3"按钮选择音频文件
   - 自动提取MP3文件中的专辑封面

3. **设置提取选项**
   - **过滤模式**: 
     - 排除黑白: 过滤掉黑白灰色调
     - 全部颜色: 保留所有颜色
   - **数量模式**:
     - 全部提取: 提取所有主要颜色
     - 单一颜色: 只提取最主要的颜色

4. **查看结果**
   - 每个文件会显示预览图和提取的颜色调色板
   - 点击颜色块可复制HEX或RGB值
   - 查看每种颜色的出现频率统计

### 批量处理

- 支持同时上传多个文件进行批量颜色提取
- 实时显示处理进度和状态
- 可单独重新处理每个文件

## 🏗️ 项目结构

```
theme-color-extraction/
├── components/           # React组件
│   ├── ImageCard.tsx     # 图片卡片组件
│   └── SettingsPanel.tsx # 设置面板组件
├── utils/               # 工具函数
│   └── colorUtils.ts    # 颜色处理工具
├── types.ts             # TypeScript类型定义
├── App.tsx              # 主应用组件
├── index.tsx            # 应用入口
└── package.json         # 项目配置
```

## 🛠️ 技术栈

- **前端框架**: React 19.2.3
- **开发语言**: TypeScript 5.8.2
- **构建工具**: Vite 6.2.0
- **样式**: 内联CSS + Tailwind风格
- **颜色分析**: Canvas API

## 🔧 核心功能实现

### 颜色提取算法

项目使用Canvas API进行图像处理，通过以下步骤提取颜色：

1. 将图片缩放到100x100像素以优化性能
2. 获取所有像素的RGB值
3. 统计颜色出现频率
4. 按频率排序并过滤重复颜色
5. 返回最常出现的颜色调色板

### MP3封面提取

使用HTML5 Audio API和File API从MP3文件中提取专辑封面信息。

## 📝 API参考

### 主要工具函数

#### `extractPalette(imageUrl, filterMode, maxColors)`

提取图片调色板的主要函数。

**参数:**
- `imageUrl`: 图片URL或Data URL
- `filterMode`: 过滤模式 (`FilterMode.ALL` 或 `FilterMode.EXCLUDE_BW`)
- `maxColors`: 最大颜色数量 (默认: 5)

**返回值:** `Promise<ColorPalette[]>`

#### `getMp3Cover(file)`

从MP3文件中提取专辑封面。

**参数:**
- `file`: MP3文件对象

**返回值:** `Promise<string | null>`

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有为Gemini做出贡献的开发者。