
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import requests
import os

SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:tum19@localhost/atmvn'
ROOT_DATA = 'data'
IMAGES_DIR = os.path.join(ROOT_DATA, 'images')
os.makedirs(IMAGES_DIR, exist_ok=True)


from urllib.request import urlopen
import re as r
 
def getIP():
    d = str(urlopen('http://checkip.dyndns.com/')
            .read())
 
    return r.compile(r'Address: (\d+\.\d+\.\d+\.\d+)').search(d).group(1)

# ip_address = getIP()
host = "0.0.0.0"
port = 8000
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
# , connect_args={"check_same_thread": False}
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


def get_db():
    """
    Get the database session
    Yields:
        Session: The database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
