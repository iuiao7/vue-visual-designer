# Nuxt 3 Starter

一个现代化的 Nuxt 3 项目模板，集成了 Pinia 状态管理、TailwindCSS 样式框架和 TypeScript 支持。

## 技术栈

- **Nuxt 3** - Vue.js 全栈框架
- **Pinia** - Vue 状态管理
- **TailwindCSS v4** - 原子化 CSS 框架
- **TypeScript** - 类型安全
- **ESLint** - 代码规范检查

查看 [Nuxt 文档](https://nuxt.com/docs/getting-started/introduction) 了解更多信息。

## 环境要求

- Node.js 18+
- pnpm (推荐) / npm / yarn / bun

## 安装依赖

```bash
# 推荐使用 pnpm
pnpm install

# 或使用其他包管理器
npm install
yarn install
bun install
```

## 开发服务器

启动开发服务器，访问 `http://localhost:9876`：

```bash
# 推荐使用 pnpm
pnpm dev

# 或使用其他包管理器
npm run dev
yarn dev
bun run dev
```

## 代码规范

项目集成了 ESLint 进行代码规范检查：

```bash
# 检查代码规范
pnpm lint

# 自动修复代码格式
pnpm lint:fix
```

## 生产构建

构建生产版本：

```bash
pnpm build
```

本地预览生产构建：

```bash
pnpm preview
```

查看 [部署文档](https://nuxt.com/docs/getting-started/deployment) 了解更多部署信息。
