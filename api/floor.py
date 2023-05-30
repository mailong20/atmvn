from fastapi import HTTPException, status, Response
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from fastapi import UploadFile, File
from typing import Optional
import uuid
import os
from pathlib import Path
from PIL import Image
import io

from models import models
from schema import schemas
from database.configuration import IMAGES_DIR, port


def get_all(db: Session):
    """
    Get all Floors
    Args:
        db (Session): Database session
    Returns:
        List[models.Floor]: List of Floors
    """
    return db.query(models.Floor).all()


def create(request: schemas.Floor, floor_image_file: File(), db: Session):
    """
    Create a new Floor
    Args:
        request (schemas.Floor): floor object
        db (Session): Database session
    Returns:
        models.Floor: Floor object
    """
    new_floor = models.Floor(floor_name=request.floor_name,
                             floor_description=request.floor_description, floor_price=request.floor_price)

    if floor_image_file:
        basename_image = uuid.uuid4()
        floor_image_path= Path(
            f'{IMAGES_DIR}/{basename_image}.png').as_posix()
        new_floor.floor_image = f'api/floors/image/{basename_image}'
        with open(floor_image_path, "wb") as file:
            file.write(floor_image_file.file.read())

    db.add(new_floor)
    db.commit()
    db.refresh(new_floor)
    return 


def destroy(id: int, db: Session):
    """
    Delete a Floor
    Args:
        id (int): floor id
        db (Session): Database session
    Raises:
        HTTPException: 404 not found
    Returns:
        str: Success message
    """
    floor_to_delete = db.query(models.Floor).filter(
        models.Floor.floor_id == id)

    if not floor_to_delete.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Floor with id {id} not found.",
        )
    floor_to_delete.delete(synchronize_session=False)
    db.commit()
    return {"done"}


def update(id: int, request: schemas.Floor, db: Session):
    """
    Update a floor
    Args:
        id (int): Floor id
        request (schemas.Floor): Floor object
        db (Session): Database session
    Raises:
        HTTPException: 404 not found
    Returns:
        models.Floor: Floor object
    """
    floor = db.query(models.Floor).filter(models.Floor.id == id)
    if not floor.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Floor with id {id} not found"
        )
    floor.update(request.__dict__)
    db.commit()
    return "updated"


def show(id: int, db: Session):
    """
    Get a Foor
    Args:
        id (int): Foor id
        db (Session): Database session
    Raises:
        HTTPException: 404 not found
    Returns:
        models.Foor: Foor object
    """
    floor = db.query(models.Floor).filter(models.Floor.floor_id == id).first()
    if floor:
        return floor
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Foor with the id {id} is not available",
        )


def get_image(floor_image_name:str):
    path_image = os.path.join(IMAGES_DIR,f'{floor_image_name}.png')
    try:
        if os.path.isfile(path_image):
           return FileResponse(path_image)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Image not found")
    # img_byte_arr = io.BytesIO()
    # img_byte_arr = image.getvalue()
