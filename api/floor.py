from fastapi import HTTPException, status, Response
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from fastapi import UploadFile, File
from typing import Optional
import uuid
import os
from pathlib import Path
import io
import base64
import json

from models import models
from schema import schemas
from api import floor_type
from database.configuration import IMAGES_DIR, port


def get_all(db: Session):
    """
    Get all Floors
    Args:
        db (Session): Database session
    Returns:
        List[models.Floor]: List of Floors
    """
    # floors = []
    # for floor in db.query(models.Floor).all():
    #     floor.floor_images = convert_image(floor.floor_images)
    #     floors.append(floor)
    return db.query(models.Floor).all()


def create(request: schemas.ShowFloor, db: Session):
    """
    Create a new Floor
    Args:
        request (schemas.Floor): floor object
        db (Session): Database session
    Returns:
        models.Floor: Floor object
    """
   
    floor_type.check_floor_type(floor_type_id=request.floor_type_id, db=db)
    floor_id =  f"{request.floor_type_id}-{request.floor_id}"
    check_floor(floor_id, db)
    new_floor = models.Floor(floor_id=floor_id,floor_name=request.floor_name,floor_images ='',
                             floor_description=request.floor_description, floor_price=request.floor_price, floor_type_id=request.floor_type_id)
    image_dict = json.loads(request.floor_images)
    if image_dict:
        for name, img in image_dict.items():
            base64_image = img.split(',')[1]
            image_data = base64.b64decode(base64_image)

            basename_image = uuid.uuid4()
            floor_image_path = Path(
                f'{IMAGES_DIR}/{basename_image}.png').as_posix()
            if os.path.exists(floor_image_path):
                os.remove(floor_image_path)

            
            new_floor.floor_images += f'{name}|api/floors/image/{basename_image}~'
            floor_image_path = Path(
                f'{IMAGES_DIR}/{basename_image}.png').as_posix()

            with open(floor_image_path, "wb") as file:
                file.write(image_data)
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
            detail=f"Floor với id {id} không tồn tại.",
        )
    dicst_image_old = convert_image(floor_to_delete.first().floor_images)
    for url , _ in dicst_image_old.items():
        floor_image_path = Path(
            f'{IMAGES_DIR}/{url.split("/")[-1]}.png').as_posix()
        if os.path.exists(floor_image_path):
            os.remove(floor_image_path)
    floor_to_delete.delete(synchronize_session=False)
    db.commit()
    return {"done"}


def update(request: schemas.UpdateFloor, db: Session):
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
    new_floor_id =  f"{request.floor_type_id}-{request.floor_id}"
    new_floor = models.Floor(floor_id=new_floor_id,floor_name=request.floor_name,floor_images='',
                             floor_description=request.floor_description, 
                             floor_price=request.floor_price, floor_type_id=request.floor_type_id)
    
    floor = db.query(models.Floor).filter(
        models.Floor.floor_id == request.old_floor_id.strip())
    if not floor.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Floor với id {id} không tồn tại"
        )
    dicst_image_old = convert_image(floor.first().floor_images)
    image_dict = json.loads(request.floor_images)
    if image_dict:
        for name, img in image_dict.items():
            if not 'api/floors/image/' in img:
                base64_image = img.split(',')[1]
                image_data = base64.b64decode(base64_image)

                basename_image = uuid.uuid4()
                floor_image_path = Path(
                    f'{IMAGES_DIR}/{basename_image}.png').as_posix()
                if os.path.exists(floor_image_path):
                    os.remove(floor_image_path)

                
                new_floor.floor_images += f'{name}|api/floors/image/{basename_image}~'
                floor_image_path = Path(
                    f'{IMAGES_DIR}/{basename_image}.png').as_posix()

                with open(floor_image_path, "wb") as file:
                    file.write(image_data)
            else:
                print('url', img[:20])
                url = '/'.join(img.split('/')[-4:])
                
                dicst_image_old.pop(url)
                new_floor.floor_images += f'{name}|{url}~'
    for url , _ in dicst_image_old.items():
        floor_image_path = Path(
            f'{IMAGES_DIR}/{url.split("/")[-1]}.png').as_posix()
        if os.path.exists(floor_image_path):
            os.remove(floor_image_path)

    
    floor_new = new_floor.__dict__
    floor_new.pop('_sa_instance_state', None)
    floor.update(floor_new)
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


def get_image(floor_image_name: str):
    path_image = os.path.join(IMAGES_DIR, f'{floor_image_name}.png')
    try:
        if os.path.isfile(path_image):
            return FileResponse(path_image)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Image not found")


def get_floors_by_floor_type_id(floor_type_id, db):
    print(floor_type_id)
    if floor_type_id == "all":
        return get_all(db=db)
    
    floor_type.check_floor_type(floor_type_id, db)
    floors = db.query(models.Floor).filter(
        models.Floor.floor_type_id == floor_type_id).all()
    return floors



def check_floor(floor_id, db):
    floor = db.query(models.Floor).filter(
        models.Floor.floor_id == floor_id)
    if floor.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Floor với id: {floor_id} đã tồn tại!"
        )
    
def convert_image(floor_images):
    print(floor_images)
    dict_img ={}
    floor_images = floor_images.split('~')
    floor_images = [floor_image.split('|') for floor_image in floor_images if len(floor_image.split('|'))==2]
    floor_images = [dict_img.setdefault(img, name) for name, img in floor_images]
    return dict_img
