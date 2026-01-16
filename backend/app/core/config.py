from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./banpro.db"
    ENV: str = "dev"

    # Config como cargar pydantic settings:
    model_config = SettingsConfigDict(
        env_file=".env", # Lee variables de archivo .env
        env_file_encoding="utf-8", # Encoding del .env evita problemas con caracteres
        extra="ignore", # Variables en env no definidas aqui se ignoran
    )


settings = Settings() # Crea una instancia