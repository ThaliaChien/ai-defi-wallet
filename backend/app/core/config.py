from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI DeFi Wallet API"
    app_version: str = "0.1.0"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"
    frontend_origin: str = "http://localhost:3000"
    coingecko_base_url: str = "https://api.coingecko.com/api/v3"
    coingecko_timeout_seconds: float = 5.0
    coingecko_cache_ttl_seconds: int = 90
    coingecko_api_key: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
