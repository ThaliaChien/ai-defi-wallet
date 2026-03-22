# AI DeFi Wallet

AI DeFi Wallet 当前 backend 已支持面向交易所风格资产页的钱包数据层：

- 保持 `GET /api/v1/wallet/overview` 路径不变
- 保持原有兼容字段 `address / total_usd_value / assets / protocols / ai_summary`
- 扩展出更适合 Binance / OKX 风格资产页的 overview、assets、protocols 字段
- 接入 CoinGecko 实时价格能力，并带有进程内缓存与失败降级

## 项目结构

```text
ai-defi-wallet/
├─ frontend/                 # Next.js + TypeScript 钱包首页
├─ backend/                  # FastAPI backend
│  ├─ app/
│  │  ├─ api/                # 路由层
│  │  ├─ core/               # 配置
│  │  ├─ schemas/            # Pydantic 响应模型
│  │  ├─ services/           # 钱包概览、价格和后续链上聚合服务
│  │  └─ main.py             # 应用入口
│  ├─ tests/                 # backend 自动化测试
│  └─ pytest.ini             # pytest 配置
└─ README.md
```

## Backend 模块说明

当前 `wallet overview` 的 backend 结构按职责拆分为：

- `api/v1/endpoints/wallet.py`
  - 只处理 HTTP 请求与响应模型绑定
- `schemas/wallet.py`
  - 定义 overview、asset、protocol、section、action 的公开响应 schema
- `services/wallet/mock_provider.py`
  - 提供 mock 钱包持仓、协议数据和 empty address 逻辑
- `services/wallet/asset_registry.py`
  - 维护资产图标、CoinGecko id 和 fallback 价格元数据
- `services/wallet/price_provider.py`
  - 提供 CoinGecko REST 取价、TTL 内存缓存和失败降级
- `services/wallet/assembler.py`
  - 组装最终 overview 响应，并计算总资产、24h 变化、allocation 和 wallet sections
- `services/wallet/overview.py`
  - 对外暴露稳定服务入口 `get_wallet_overview()`

## 接口说明

### 路径

```http
GET /api/v1/wallet/overview
```

Query 参数：

- `address`，可选

empty address 保持为：

- `0x0000000000000000000000000000000000000000`

### 顶层字段

保留兼容字段：

- `address`
- `total_usd_value`
- `assets`
- `protocols`
- `ai_summary`

新增 overview 字段：

- `total_change_24h`
- `total_change_pct_24h`
- `pricing_source`
  - 可能值包括：`coingecko_live`、`coingecko_cached`、`mock_fallback`
- `last_updated_at`
- `wallet_sections`
- `quick_actions`

### assets[] 字段

每个 asset 现在包含：

- `symbol`
- `name`
- `icon`
- `chain`
- `balance`
- `available_balance`
- `locked_balance`
- `price_usd`
- `change_24h`
- `usd_value`
- `allocation_pct`
- `wallet_type`
- `is_yielding`
- `action_hints`

说明：

- `available_balance + locked_balance == balance`
- `usd_value == balance * price_usd`
- `allocation_pct` 是资产在当前钱包总资产中的占比
- `change_24h` 是价格 24h 百分比变化，不是金额变化

### protocols[] 字段

保留兼容字段：

- `name`
- `position_summary`

新增字段：

- `protocol`
- `category`
- `chain`
- `position_usd`
- `status`
- `risk_level`
- `apr`

兼容策略：

- `name` 与 `protocol` 当前保持同值
- 旧前端仍可继续读 `name` 和 `position_summary`
- 新前端可以逐步迁移到新字段

## 实时价格说明

backend 第一版使用 CoinGecko REST 简单价格接口获取：

- `price_usd`
- `change_24h`

实现策略：

- 优先使用 CoinGecko 实时价格
- 命中 TTL 缓存时返回 `coingecko_cached`
- 价格请求失败时，如果有缓存则继续返回缓存
- 若没有缓存，则回退到 mock 价格，并返回 `pricing_source=mock_fallback`
- 无论价格源是否失败，`/api/v1/wallet/overview` 都应保持可返回，不让整体响应崩掉

## 环境要求

- Python 3.11+

## 本地运行

### 启动后端

Windows PowerShell：

```bash
cd backend
py -m venv .venv
.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
py -m uvicorn app.main:app --reload --port 8000
```

如果 `--reload` 在某些工具宿主环境里不稳定，可使用更稳的替代命令：

```bash
py -m uvicorn app.main:app --port 8000
```

说明：

- 用户本机终端环境通常可以正常使用 `--reload`
- 某些工具宿主环境会对 Python 多进程、文件监听或网络访问做额外限制
- 这类现象不代表 backend 本身不可运行，应优先以你本机终端结果为准

启动后可访问：

- [http://localhost:8000](http://localhost:8000)
- [http://localhost:8000/docs](http://localhost:8000/docs)

## Backend 自动化测试

在 `backend` 目录下执行：

```bash
pytest
```

当前测试覆盖：

- service 层默认 demo 地址返回扩展后的完整 shape
- service 层 empty 地址返回空 `assets` 和空 `protocols`
- service 层 `ai_summary` 始终为字符串
- service 层缓存命中时不重复请求价格源
- service 层价格源失败时回退到 `mock_fallback`
- API 层 `/api/v1/health` 返回 200
- API 层 `/api/v1/wallet/overview` 返回 200 且包含旧字段和新字段
- API 层 empty 地址场景返回 200 且 empty shape 正确
- API 层价格源失败时接口仍返回 200

## Backend smoke check

PowerShell 快速检查：

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8000/api/v1/health | Select-Object -ExpandProperty Content
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8000/api/v1/wallet/overview | Select-Object -ExpandProperty Content
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8000/api/v1/wallet/overview?address=0x0000000000000000000000000000000000000000" | Select-Object -ExpandProperty Content
```

重点检查：

- `health` 返回 `status=ok`
- `wallet/overview` 返回 `pricing_source`、`wallet_sections`、`quick_actions`
- `assets[]` 包含交易所风格扩展字段
- empty 地址仍返回空 `assets` 与空 `protocols`

## 示例返回

```json
{
  "address": "0x4F3cA5b2C9E7D1a4eB8f2d6A1c3E9b7D5f1A2C4E",
  "total_usd_value": 14897.0,
  "total_change_24h": 125.45,
  "total_change_pct_24h": 0.84,
  "pricing_source": "coingecko_live",
  "last_updated_at": "2026-03-23T12:00:00Z",
  "wallet_sections": [
    {
      "key": "spot",
      "label": "Spot Wallet",
      "wallet_type": "spot",
      "total_usd_value": 6440.0,
      "asset_count": 1
    }
  ],
  "quick_actions": [
    {
      "key": "deposit",
      "label": "Deposit",
      "type": "transfer",
      "enabled": true
    }
  ],
  "assets": [
    {
      "symbol": "ETH",
      "name": "Ethereum",
      "icon": "https://...",
      "chain": "Ethereum",
      "balance": 1.84,
      "available_balance": 1.24,
      "locked_balance": 0.6,
      "price_usd": 3500.0,
      "change_24h": 2.5,
      "usd_value": 6440.0,
      "allocation_pct": 43.23,
      "wallet_type": "spot",
      "is_yielding": false,
      "action_hints": [
        {
          "key": "trade_eth",
          "label": "Trade",
          "type": "trade",
          "enabled": true
        }
      ]
    }
  ],
  "protocols": [
    {
      "name": "Aave",
      "protocol": "Aave",
      "category": "Lending",
      "chain": "Base",
      "position_summary": "Supplying USDC on Base with steady lending yield.",
      "position_usd": 1000.0,
      "status": "active",
      "risk_level": "medium",
      "apr": 5.1
    }
  ],
  "ai_summary": "This wallet is tilted toward core assets and stablecoin liquidity."
}
```
