"""
Logging configuration and utilities for Antigravity AI Video Engine.
Provides structured logging with rotation, multiple output formats, and severity levels.
"""

import os
import logging
import logging.handlers
from datetime import datetime
from typing import Optional
import json


class StructuredFormatter(logging.Formatter):
    """JSON formatter for structured logging."""
    
    def format(self, record):
        log_obj = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
        
        if hasattr(record, "extra_data"):
            log_obj.update(record.extra_data)
        
        return json.dumps(log_obj)


class ColoredFormatter(logging.Formatter):
    """Colored formatter for console output."""
    
    COLORS = {
        'DEBUG': '\033[36m',     # Cyan
        'INFO': '\033[32m',      # Green
        'WARNING': '\033[33m',   # Yellow
        'ERROR': '\033[31m',     # Red
        'CRITICAL': '\033[35m', # Magenta
        'RESET': '\033[0m'
    }
    
    def format(self, record):
        color = self.COLORS.get(record.levelname, self.COLORS['RESET'])
        record.levelname = f"{color}{record.levelname}{self.COLORS['RESET']}"
        return super().format(record)


def setup_logging(
    log_dir: str = "out/logs",
    log_file: str = "antigravity",
    level: int = logging.INFO,
    console: bool = True,
    file_format: str = "detailed",
    max_bytes: int = 10 * 1024 * 1024,  # 10MB
    backup_count: int = 5
) -> logging.Logger:
    """
    Setup logging with file rotation and optional console output.
    
    Args:
        log_dir: Directory for log files
        log_file: Base name for log files
        level: Logging level
        console: Enable console output
        file_format: Format for file logs ('detailed', 'simple', 'json')
        max_bytes: Maximum size of each log file before rotation
        backup_count: Number of backup files to keep
        
    Returns:
        Configured logger instance
    """
    os.makedirs(log_dir, exist_ok=True)
    
    logger = logging.getLogger("antigravity")
    logger.setLevel(level)
    logger.handlers.clear()
    
    log_path = os.path.join(log_dir, f"{log_file}.log")
    
    if file_format == "json":
        file_formatter = StructuredFormatter()
    elif file_format == "simple":
        file_formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
    else:
        file_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
    
    file_handler = logging.handlers.RotatingFileHandler(
        log_path,
        maxBytes=max_bytes,
        backupCount=backup_count,
        encoding='utf-8'
    )
    file_handler.setLevel(level)
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)
    
    if console:
        console_handler = logging.StreamHandler()
        console_handler.setLevel(level)
        console_formatter = ColoredFormatter(
            '%(asctime)s - %(levelname)s - %(message)s',
            datefmt='%H:%M:%S'
        )
        console_handler.setFormatter(console_formatter)
        logger.addHandler(console_handler)
    
    return logger


def get_logger(name: Optional[str] = None) -> logging.Logger:
    """
    Get a logger instance.
    
    Args:
        name: Logger name (uses 'antigravity.{name}' if provided)
        
    Returns:
        Logger instance
    """
    if name:
        return logging.getLogger(f"antigravity.{name}")
    return logging.getLogger("antigravity")


class LogContext:
    """Context manager for adding extra data to log records."""
    
    def __init__(self, logger: logging.Logger, **kwargs):
        self.logger = logger
        self.extra_data = kwargs
        self.old_factory = None
    
    def __enter__(self):
        self.old_factory = logging.getLogRecordFactory()
        
        def record_factory(*args, **kwargs):
            record = self.old_factory(*args, **kwargs)
            record.extra_data = self.extra_data
            return record
        
        logging.setLogRecordFactory(record_factory)
        return self
    
    def __exit__(self, *args):
        logging.setLogRecordFactory(self.old_factory)


def log_execution_time(logger: Optional[logging.Logger] = None):
    """Decorator to log execution time of a function."""
    import functools
    import time
    
    if logger is None:
        logger = get_logger()
    
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            logger.info(f"Starting execution of {func.__name__}")
            try:
                result = func(*args, **kwargs)
                elapsed = time.time() - start_time
                logger.info(f"Completed {func.__name__} in {elapsed:.2f}s")
                return result
            except Exception as e:
                elapsed = time.time() - start_time
                logger.error(f"Failed {func.__name__} after {elapsed:.2f}s: {str(e)}")
                raise
        
        return wrapper
    return decorator


def log_api_request(logger: Optional[logging.Logger] = None):
    """Decorator to log API requests."""
    import functools
    import time
    
    if logger is None:
        logger = get_logger("api")
    
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            logger.info(f"API Request: {func.__name__}")
            try:
                result = func(*args, **kwargs)
                elapsed = time.time() - start_time
                logger.info(f"API Response: {func.__name__} - {elapsed*1000:.2f}ms")
                return result
            except Exception as e:
                elapsed = time.time() - start_time
                logger.error(f"API Error: {func.__name__} - {elapsed*1000:.2f}ms - {str(e)}")
                raise
        
        return wrapper
    return decorator