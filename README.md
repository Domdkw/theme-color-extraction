# Theme Color Extraction CLI

一个强大的命令行工具，用于从图片和音频文件中提取主题颜色调色板

<div align="center">
  <img src="https://img.shields.io/badge/Python-3.8+-red.svg" alt="Python">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
</div>

## ✨ 特性

- 🎨 **智能颜色提取** - 从图片中自动提取主色调调色板
- 🎵 **音频封面提取** - 支持从 MP3、M4A、FLAC、OGG、WAV 等音频文件中提取专辑封面并分析颜色
- 🎯 **智能过滤** - 可选择排除黑白颜色或保留所有颜色
- 📊 **颜色统计** - 显示每种颜色的出现频率和百分比
- 🎨 **多种颜色格式** - 支持 HEX、RGB、RGBA 颜色输出格式
- ⚡ **高性能** - 基于 Pillow 图像处理库实现快速颜色分析
- 🔧 **灵活配置** - 支持自定义分辨率、插值模式、最大颜色数等参数
- 🐛 **调试模式** - 提供详细的调试信息，便于问题排查

## 🚀 安装

### 使用 pip 安装

```bash
pip install -r requirements.txt
```

### 从源码安装

```bash
git clone -b python-cli https://github.com/Domdkw/theme-color-extraction.git --single-branch
cd theme-color-extraction
pip install -e .
```

这里只克隆了单个分支`cli`

## 📖 使用方法

### 基本用法

```bash
# 提取图片颜色（使用默认设置）
python main.py ./image.jpg

# 或使用安装后的命令
extract-colors ./image.jpg
```

### 命令行选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--precision <size>` | 分辨率大小：1（原始尺寸），>1 为像素尺寸，0-1 为百分比 | 100 |
| `--unabw` | 排除黑白颜色 | false |
| `--colorsys <format>` | 颜色格式：hex、rgb、rgba | hex |
| `--max <number>` | 最大颜色数量 | 5 |
| `--present` | 显示颜色百分比 | false |
| `--interpolation <mode>` | 插值模式：nearest、linear、cubic、lanczos | linear |
| `--dev` | 启用详细调试输出 | false |

### 使用示例

#### 基本颜色提取

```bash
# 提取前 5 个主要颜色（默认）
python main.py ./bg.jpg

# 输出示例：
# #FF5733
# #33FF57
# #3357FF
# #F3FF33
# #FF33F3
```

#### 自定义颜色数量

```bash
# 只提取前 3 个颜色
python main.py ./bg.jpg --max 3

# 提取前 10 个颜色
python main.py ./bg.jpg --max 10
```

#### 调整分辨率

```bash
# 使用原始分辨率
python main.py ./bg.jpg --precision 1

# 缩放到 50x50 像素
python main.py ./bg.jpg --precision 50

# 缩放到原始尺寸的 50%
python main.py ./bg.jpg --precision 0.5
```

#### 排除黑白颜色

```bash
# 排除黑白及灰色调
python main.py ./bg.jpg --unabw
```

#### 选择颜色格式

```bash
# 输出 HEX 格式（默认）
python main.py ./bg.jpg --colorsys hex

# 输出 RGB 格式
python main.py ./bg.jpg --colorsys rgb

# 输出 RGBA 格式
python main.py ./bg.jpg --colorsys rgba
```

#### 显示颜色百分比

```bash
# 显示每个颜色的占比
python main.py ./bg.jpg --present

# 输出示例：
# #FF5733 (35%)
# #33FF57 (25%)
# #3357FF (20%)
# #F3FF33 (12%)
# #FF33F3 (8%)
```

#### 音频文件封面提取

```bash
# 从 MP3 文件提取封面颜色
python main.py ./song.mp3

# 从 M4A 文件提取封面颜色
python main.py ./audio.m4a --max 3 --colorsys rgb
```

#### 组合选项

```bash
# 完整示例：排除黑白、显示百分比、使用 RGB 格式、提取 3 个颜色
python main.py ./bg.jpg --unabw --present --colorsys rgb --max 3

# 音频文件示例：高精度、排除黑白、调试模式
python main.py ./song.mp3 --precision 1 --unabw --dev
```

#### 调试模式

```bash
# 启用调试模式查看详细处理信息
python main.py ./bg.jpg --dev

# 输出示例：
# === 调试信息 ===
# 图片路径: ./bg.jpg
# 原始尺寸: 1920 x 1080
# 分辨率参数: 100
# 最大颜色数: 5
# 排除黑白: false
# 插值模式: linear
# 缩放模式: 固定尺寸模式 (100 x 56)
# 处理后的尺寸: 100 x 56
# 像素总数: 5600
# 数据长度: 22400 bytes
# 
# === 颜色统计 ===
# 总像素数: 5600
# 透明像素: 0
# 排除的黑白像素: 0
# 有效像素: 5600
# 量化后的颜色数量: 234
# 
# === 前10个颜色（按出现次数）===
# 1. #FF5733 - 出现 850 次 (15%)
# 2. #33FF57 - 出现 720 次 (13%)
# ...
# 
# === 最终结果 ===
# 跳过的相似颜色: 2
# 最终提取颜色数: 5
# ...
# === 调试结束 ===
```

## 🏗️ 项目结构

```
theme-color-extraction/
├── example/                 # 示例文件
│   ├── bg.jpg              # 示例图片
│   └── Lighting.mp3        # 示例音频文件
├── color_utils.py           # 颜色处理工具函数
├── main.py                  # 程序入口
├── requirements.txt         # Python 依赖
├── pyproject.toml           # 项目配置
├── LICENSE                  # MIT 许可证
└── README.md                # 项目文档
```

## 🛠️ 技术栈

- **运行环境**: Python 3.8+
- **图像处理**: Pillow 10.0.0+
- **音频元数据**: Mutagen 1.47.0+
- **开发语言**: Python 3.8+

## 🔧 核心功能实现

### 颜色提取算法

项目使用 Pillow 图像处理库进行图像处理，通过以下步骤提取颜色：

1. **图像缩放**: 根据精度参数将图片缩放到指定尺寸
2. **像素采样**: 获取所有像素的 RGB 值
3. **颜色量化**: 将相似颜色归类（量化因子为 12）
4. **频率统计**: 统计每种颜色出现的次数
5. **排序过滤**: 按频率排序并过滤相似颜色
6. **结果输出**: 返回最常出现的颜色调色板

### 音频封面提取

使用 `mutagen` 库从音频文件中提取专辑封面信息：

1. 解析音频文件元数据
2. 提取嵌入的封面图片
3. 将封面保存为临时文件
4. 对封面进行颜色提取
5. 清理临时文件

### 颜色相似度检测

使用欧几里得距离计算颜色相似度，距离小于 45 的颜色被视为相似颜色并跳过。

## 📝 API 参考

### 主要工具函数

#### `extract_palette(image_path, options)`

提取图片调色板的主要函数。

**参数:**
- `image_path` (str): 图片文件路径
- `options` (dict):
  - `maxColors` (int): 最大颜色数量，默认 5
  - `resolution` (float): 分辨率参数，默认 100
  - `excludeBW` (bool): 是否排除黑白颜色，默认 False
  - `interpolation` (str): 插值模式，默认 'linear'
  - `dev` (bool): 是否启用调试模式，默认 False

**返回值:** `List[ColorPalette]`

**ColorPalette 对象结构:**
```python
{
    'hex': '#FF5733',        # HEX 颜色值
    'rgb': {'r': 255, 'g': 87, 'b': 51},  # RGB 颜色值
    'count': 850,            # 出现次数
    'percentage': 15         # 出现百分比
}
```

#### `rgb_to_hex(r, g, b)`

将 RGB 颜色转换为 HEX 格式。

**参数:**
- `r` (int): 红色分量 (0-255)
- `g` (int): 绿色分量 (0-255)
- `b` (int): 蓝色分量 (0-255)

**返回值:** `str` - HEX 颜色值

#### `hex_to_rgb(hex)`

将 HEX 颜色转换为 RGB 格式。

**参数:**
- `hex` (str): HEX 颜色值

**返回值:** `str` - RGB 颜色字符串

#### `hex_to_rgba(hex, alpha)`

将 HEX 颜色转换为 RGBA 格式。

**参数:**
- `hex` (str): HEX 颜色值
- `alpha` (float): 透明度 (0-1)，默认 1

**返回值:** `str` - RGBA 颜色字符串

## 📋 支持的文件格式

### 图片格式
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- BMP (.bmp)
- TIFF (.tiff, .tif)

### 音频格式
- MP3 (.mp3)
- M4A (.m4a)
- FLAC (.flac)
- OGG (.ogg)
- WAV (.wav)
- WMA (.wma)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Pillow](https://pillow.readthedocs.io/) - Python 图像处理库
- [Mutagen](https://github.com/quodlibet/mutagen) - 音频元数据解析库

## 📮 联系方式

- GitHub: [Domdkw](https://github.com/Domdkw)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
