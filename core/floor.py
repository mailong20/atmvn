from typing import List

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from models import models
from api import floor
from database import configuration
from schema import schemas
from schema.oa2 import get_current_user
from fastapi import UploadFile, File
from typing import Optional


router = APIRouter(tags=["Floors"], prefix="/api/floors")
get_db = configuration.get_db


@router.get("/", response_model=List[schemas.ShowFloor])
def get_all_floors(
    db: Session = Depends(get_db),
    # current_user: schemas.User = Depends(get_current_user),
):
    """
    Get all blogs
    Args:
        db (Session, optional): Database session. Defaults to None.
        current_user (schemas.User, optional): Current user. Defaults to None.
    Returns:
        List[schemas.ShowBlog]: List of blogs
    """
    return floor.get_all(db)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_floor(
    floor_id: str,
    floor_name: str,
    floor_description: str,
    floor_price: float,
    floor_type_id: str,
    floor_image: Optional[UploadFile] = File(...),
    db: Session = Depends(get_db),
    # current_user: schemas.User = Depends(get_current_user),
):
    request = models.Floor(floor_id=floor_id, floor_name=floor_name, floor_images='',
                           floor_description=floor_description, floor_price=floor_price, floor_type_id= floor_type_id)
    return floor.create(request=request, floor_image_file=floor_image, db=db)


@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=schemas.ShowFloor)
def get_floor_by_id(
    id: str,
    response: Response,
    db: Session = Depends(get_db),
):
    """
    Get a floor by id
    Args:
        id (int): Floor id
        response (Response): FastAPI response
        db (Session, optional): Database session. Defaults to None.
        current_user (schemas.User, optional): Current user. Defaults to None.
    Returns:
        schemas.ShowBlog: Blog
    """
    return floor.show(id, db)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_floor(
    id: str,
    db: Session = Depends(get_db),
    # current_user: schemas.User = Depends(get_current_user),
):
    """
    Delete a floor by id
    Args:
        id (int): Blog id
        db (Session, optional): Database session. Defaults to None.
        current_user (schemas.User, optional): Current user. Defaults to None.
    Returns:
        None: None
    """
    return floor.destroy(id, db)


@router.put("/", status_code=status.HTTP_202_ACCEPTED)
def update_floor(
    request: schemas.UpdateFloor,
    db: Session = Depends(get_db),
    # current_user: schemas.User = Depends(get_current_user),
):
    return floor.update(request, db)


@router.get("/image/{floor_image_name}")
def get_floor_image(floor_image_name: str):
    return floor.get_image(floor_image_name)


@router.get("/bytype/{floor_type_id}", status_code=status.HTTP_200_OK, 
    response_model=List[schemas.ShowFloor]
    )
def get_floors_by_floor_type_id(
    floor_type_id: str,
    response: Response,
    db: Session = Depends(get_db),
):
    """
    Get a floor by id
    Args:
        id (int): Floor id
        response (Response): FastAPI response
        db (Session, optional): Database session. Defaults to None.
        current_user (schemas.User, optional): Current user. Defaults to None.
    Returns:
        schemas.ShowBlog: Blog
    """
    return floor.get_floors_by_floor_type_id(floor_type_id, db)