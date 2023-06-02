from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models import models
from schema import schemas
from schema.hash import Hash


def create(request: schemas.FloorType, db: Session):
  
    floor_type = models.FloorType(id=request.id, name=request.name, floors = [])
    db.add(floor_type)
    db.commit()
    db.refresh(floor_type)
    return floor_type


def show(id: int, db: Session):
    
    user = db.query(models.FloorType).filter(models.FloorType.id == id).first()
    if not user:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, detail=f"Floor Type with id {id} not found"
        )
    return user


def get_all(db: Session):
 
    return db.query(models.FloorType).all()


def destroy(id: int, db: Session):
    """
    Delete a FloorType
    Args:
        id (int): FloorType id
        db (Session): Database session
    Raises:
        HTTPException: 404 not found
    Returns:
        str: Success message
    """
    floor_type_to_delete = db.query(models.FloorType).filter(
        models.FloorType.id == id)

    if not floor_type_to_delete.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Floor type with id {id} not found.",
        )
   
    floor_type_to_delete.delete(synchronize_session=False)
    db.commit()
    return {"done"}


def update(request: schemas.FloorType, id, db: Session):
    """
    Update a FloorType
    Args:
        id (int): FloorType id
        request (schemas.FloorType): FloorType object
        db (Session): Database session
    Raises:
        HTTPException: 404 not found
    Returns:
        models.FloorType: FloorType object
    """
    
    floor_type = db.query(models.FloorType).filter(
        models.FloorType.id == id)
    if not floor_type.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Floor type with id {id} not found"
        )
    
    floor_type_new = request.__dict__
    floor_type_new.pop('_sa_instance_state', None)
    floor_type.update(floor_type_new)
    db.commit()
    return "updated"

def check_floor_type(floor_type_id, db: Session):
    floor_types = db.query(models.FloorType).filter(
        models.FloorType.id == floor_type_id.strip())
    if not floor_types.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Floor type with id {floor_type_id} not found"
        )
    return True
