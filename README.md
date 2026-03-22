# AI DeFi Wallet

AI DeFi Wallet 第一阶段 MVP 已实现一个可演示闭环：

- 前端模拟“连接钱包”
- 后端提供 `GET /api/v1/wallet/overview` mock 接口
- 首页展示地址、总资产、资产列表、协议交互和 AI 总结
- 页面包含 `idle`、`loading`、`error`、`empty` 四类状态处理

## 项目结构

```text
ai-defi-wallet/
├─ frontend/                 # Next.js + TypeScript 钱包首页
│  ├─ app/                   # App Router 页面与全局样式
│  ├─ components/wallet/     # 钱包首页组件
│  ├─ lib/                   # API、格式化、钱包常量
│  ├─ public/                # 静态资源
│  └─ types/                 # 前端类型定义
├─ backend/                  # FastAPI mock API
│  ├─ app/
│  │  ├─ api/                # 路由层
│  │  ├─ core/               # 配置
│  │  ├─ schemas/            # Pydantic 响应模型
│  │  ├─ services/           # mock 数据服务
│  │  └─ main.py             # 应用入口
│  └─ tests/                 # 测试目录占位
└─ README.md
```

## 第一阶段功能

### 前端

- 首页标题为 `AI DeFi Wallet`
- 点击“Connect wallet”按钮后，前端使用固定 demo 地址模拟连接
- 连接后调用后端钱包概览接口
- 展示钱包地址、总资产、资产列表、协议交互列表、AI 总结卡片
- 支持 loading、error、empty state

### 后端

- 新增 `GET /api/v1/wallet/overview`
- 查询参数：`address`，可选
- 返回结构：
  - `address`
  - `total_usd_value`
  - `assets`
  - `protocols`
  - `ai_summary`
- 当前使用静态 mock 数据，不接入真实链上资产

## 环境要求

- Node.js 20+
- Python 3.11+

## 本地运行

### 启动后端

```bash
cd backend
python -m venv .venv
```

Windows PowerShell:

```bash
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

macOS / Linux:

```bash
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

启动后可访问：

- [http://localhost:8000](http://localhost:8000)
- [http://localhost:8000/docs](http://localhost:8000/docs)

### 启动前端

```bash
cd frontend
npm install
npm run dev
```

启动后可访问：

- [http://localhost:3000](http://localhost:3000)

## 环境变量

前端 `frontend/.env.local`：

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

后端 `backend/.env`：

```bash
APP_NAME=AI DeFi Wallet API
APP_VERSION=0.1.0
DEBUG=true
API_V1_PREFIX=/api/v1
FRONTEND_ORIGIN=http://localhost:3000
```

可直接复制各目录下的 `.env.example` 作为本地配置起点。

## 接口示例

### 获取钱包概览

```http
GET /api/v1/wallet/overview
GET /api/v1/wallet/overview?address=0x4F3cA5b2C9E7D1a4eB8f2d6A1c3E9b7D5f1A2C4E
```

示例返回：

```json
{
  "address": "0x4F3cA5b2C9E7D1a4eB8f2d6A1c3E9b7D5f1A2C4E",
  "total_usd_value": 14513.18,
  "assets": [
    {
      "symbol": "ETH",
      "name": "Ethereum",
      "balance": 1.84,
      "usd_value": 6423.18,
      "chain": "Ethereum"
    }
  ],
  "protocols": [
    {
      "name": "Aave",
      "category": "Lending",
      "position_summary": "Supplying USDC on Base with steady lending yield."
    }
  ],
  "ai_summary": "This wallet is tilted toward core assets and stablecoin liquidity."
}
```

## 如何触发 empty state

这个版本保留了一个空钱包地址：

- `0x0000000000000000000000000000000000000000`

触发方式：

1. 直接访问前端页面时带上 `?demo=empty`
2. 打开 [http://localhost:3000/?demo=empty](http://localhost:3000/?demo=empty)
3. 点击“Connect wallet”后，前端会请求空钱包 mock 数据并展示 empty state

也可以直接请求后端：

```http
GET /api/v1/wallet/overview?address=0x0000000000000000000000000000000000000000
```

## 下一步开发建议

1. 接入真实钱包连接能力，例如 wagmi 或 Web3Modal。
2. 把 mock 数据服务替换成真实链上资产聚合服务。
3. 增加协议识别模块，基于地址行为归纳 DeFi 协议交互。
4. 接入 AI 服务，将资产分布和协议活动整理成更完整的自然语言总结。
5. 补充测试、日志、错误码和部署配置。
