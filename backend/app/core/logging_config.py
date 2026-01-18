import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

LOG_FILE = Path("logs.txt")

def setup_logging() -> None:
    """
    Configura logs para consola y logs.txt
    RotatingFileHandler evita que el archivo crezca infinitamente
    """
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Evita duplicar handlers si uvicorn recarga
    if logger.handlers:
        return
    # Se define formatter
    fmt = logging.Formatter( 
        fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Consola
    cnsl = logging.StreamHandler() # se crea nuevo streamhandler
    cnsl.setLevel(logging.INFO) # el logger esta en nivel INFO
    cnsl.setFormatter(fmt) # se aplica el formatter creado

    # Archivo rota en 1MB yguarda 3 backups
    file = RotatingFileHandler(LOG_FILE, maxBytes=1_000_000, backupCount=3, encoding="utf-8")
    file.setLevel(logging.INFO) 
    file.setFormatter(fmt) 

    #se añaden los handlers creados al logger
    logger.addHandler(cnsl) 
    logger.addHandler(file)
