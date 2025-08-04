# Quantum 流设计器

> Quantum 流设计工具
>
> Quantum Era Studio
>
> Noah Jones / NJ Labs
>
> 2025年04月30日
>

## 介绍

Quantum Era Studio 是轻量级的业务操作流设计器，通过设计器，你可以通过可视化界面编制需要的业务操作，如服务器脚本，定时任务、数据同步等业务操作。
Quantum Era Studio 以项目（Project）的方式组织多个业务，通过工作空间（Workspace）的方式组织多个项目

作为设计器的执行中枢，Quantum Engine是一个通过Rust/C/C++编写的高效业务调度引擎，可以将业务原语解释为具体的操作，采用MIT协议完全开源，关于 Quantum 引擎的详细解释请参照 [Quantum Engine](https://github.com/njlabs/quantum-engine)

## 特性

- 轻量级框架，占用的资源较低
- 高度兼容，与 Quantum Engine 完全兼容，允许直接编译并运行Quantum Engine的业务流
- 开源免费，QES（Quantum Era Studio）项目采用GPL V3 协议完全开源，允许用户自由定制和扩展

### 项目框架

- [Tauri](https://tauri.studio/)
- [Rust](https://www.rust-lang.org/zh-CN/)
- [Node.js](https://nodejs.org/zh-cn/)
- [Vite](https://vitejs.dev/)
- [Vue 3](https://v3.cn.vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Element Plus](https://element-plus.org/zh-CN/)
- [Vue Flow](https://vue-flow.dev/)

## 快速开始

### 安装

#### 安装包安装

我们通过Tauri提供了一套默认的安装包，推荐一切没有定制化需求的用户使用，你可以直接下载安装：

> 注意，目前维护者人数有限，仅对 Windows 11 较新版本及 Macos Sequoia 15.4 （ARM）版本提供支持，理论支持旧版本操作系统，但不直接参与支持，如果发现问题请在社区反馈

- [Windows](https://github.com/njlabs/quantum-era-design/releases/download/v0.1.0/quantum-era-design-0.1.0-x86_64-pc-windows-msvc.zip)
- [MacOS](https://github.com/njlabs/quantum-era-design/releases/download/v0.1.0/quantum-era-design-0.1.0-aarch64-apple-darwin.zip)

#### 编译安装

如果你有一些特殊的需求，比如要对SD项目进行定制化或更改图标，可以通过直接编译源代码的方式进行安装，Quantum Era Studio 需要以下的运行环境：

- Node Js 20+
- Rust 1.8+

## 版本更新

Quantum Era Studio 遵循以下更新原则

> 发行年份.主版本号.次版本号（1-2位）小版本（2位数字，最后两位必然为小版本）

例如：2025.1.101

- 年份版本：核心功能兼容
- 季度版本：主要功能兼容
- 月度版本：大部分功能兼容
- 微小版本：不影响旧有业务

### 发布时间

#### 测试更新（Eureka）

每年1月10日发布当年的年份先行版本（如2025年1月10日发布2025.0），第一个版本没有主版本号，属于现行测试版本，此版本不提供支持，仅接受错误反馈

仅加入试用计划的用户提供此版本更新，且此更新不会触发自动更新，需要手动进行更新

#### 季度更新（Season）

每季发布当年的正式版本（如2025年立春时发布春季版，即2025.1）

#### 月度更新（Monthly）

每月10日更新次要版本，作为当月功能与修复的迭代，如5月10日更新2025.2.523版本

#### 维护更新（Maintenance）

不定时更新小版本（即最后两位数字），作为日常或紧急更新

### 提示

- 测试中发现的问题欢迎在 `issues` 中提出
- 使用Node 20以上版本运行与调试
- 正式版发布前，开发阶段的功能不向后兼容，仅用于测试

## 名词定义

> Quantum Era Studio 允许编译为 `Blueprint` 可执行文件（.bp），此文件需要与Quantum Engine 配合使用

- .bps：蓝图源文件，可以运行，但占用空间较大（存在一些引擎不需要的数据）
- .bp：蓝图文件，编译后的蓝图，可以打开，但没有注释，且布局可能比较混乱

- Config：Quantum Design 的配置
- Profile：特指适用于Quantum Era Studio 用于解析蓝图节点属性的配置，一般称为描述文件

- Plugin：专指用于Quantum Era Studio 的插件
  - 扩展描述：包含Extension 的处理器和服务的描述文件
  - 主题扩展：包含新的设计器主题，包括配色、布局、图标等
  - 节点扩展：包含新的节点类型
  - 语言包：包含新的语言包，默认附带中文语言包
- Extension：特指Quantum 引擎的扩展插件

## 项目历史

最早可以追溯到19年左右编写的一个RPA设计器，当时使用Electron框架进行编写，后续改为使用Tauri框架重构。
