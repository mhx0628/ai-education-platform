# AI未来教育平台开发文档

## 项目架构

### 技术栈
- 前端：Vue 3 + Element Plus + Vite
- 后端：Node.js + Express + MongoDB
- AI服务：DeepSeek + Ollama + MaxKB
- 存储：MinIO (文件存储)
- 缓存：Redis (会话和数据缓存)

### 部署架构
1. 公共云部署方案
   - 前端：CDN + 对象存储
   - 后端：容器集群
   - AI服务：GPU服务器集群
   - 数据库：MongoDB Atlas

2. 私有化部署方案
   - 统一容器化部署
   - 本地化AI模型部署
   - 数据本地存储

## 开发规范

### 代码规范
- ESLint + Prettier 配置
- Git 提交规范
- TypeScript 类型定义规范

### 文档规范
- API 文档：OpenAPI 3.0
- 代码注释：JSDoc
- 提交日志：Angular Commit Message

### 安全规范
- 数据加密传输
- 权限精细化控制
- 敏感信息保护
