from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from database.configuration import Base

class FloorType(Base):
    __tablename__ = "floor_type"

    id = Column(String(15), primary_key=True)
    name = Column(String(256), unique=True)

    floors = relationship("Floor", back_populates="floor_type")

class Floor(Base):
    __tablename__ = "floor"

    floor_id = Column(String(50), primary_key=True)
    floor_name = Column(String(128))
    floor_images = Column(String(256))
    floor_description = Column(String(256))
    floor_price = Column(Integer)
    floor_type_id = Column(String(15), ForeignKey("floor_type.id"), )
# ondelete="CASCADE")
    floor_type = relationship("FloorType", back_populates="floors")


class User(Base):
    __tablename__ = 'user'

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(256))
    user_email = Column(String(256))
    user_pass = Column(String(256))


# class Token(BaseModel):
#     access_token: str
#     token_type: str


# class TokenData(BaseModel):
#     user_email: Optional[str] = None
