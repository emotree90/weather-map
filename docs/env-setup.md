# 环境变量配置指南

第一版使用 **Next.js 内置缓存**（10 分钟），无需任何密钥即可运行。

当你准备部署上线、用户量增大时，可以按需添加 Upstash Redis 缓存层。

## 可选：Upstash Redis（推荐部署前配置）

1. 打开 https://console.upstash.com/ 并用 GitHub 登录
2. 点击 **Create Database**
3. 类型选 **Regional**，区域选离马来西亚最近的（如 `ap-southeast-1` 新加坡）
4. 创建后进入数据库详情页，找到 **REST API** 区域
5. 复制 `UPSTASH_REDIS_REST_URL` 和 `UPSTASH_REDIS_REST_TOKEN`
6. 在项目根目录创建 `.env.local`：

```bash
UPSTASH_REDIS_REST_URL=你的地址
UPSTASH_REDIS_REST_TOKEN=你的密钥
```

7. 在 Vercel 部署时，在 Environment Variables 里填入同样的两个变量

> 注意：`.env.local` 不要提交到 GitHub，项目已默认忽略此文件。

## 第一版不需要的服务

- **Supabase**：收藏功能使用浏览器 localStorage，无需数据库
- **Open-Meteo / RainViewer**：免费 API，无需注册或密钥
