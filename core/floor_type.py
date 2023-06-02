from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from api import floor_type
from database import configuration
from schema import schemas
from schema.oa2 import get_current_user

router = APIRouter(tags=["Floor Type"], prefix="/api/floortype")
get_db = configuration.get_db


@router.get("/", status_code=status.HTTP_200_OK, response_model=List[schemas.ShowFloorType])
def get_floor_types(db: Session = Depends(get_db)):
 
    return floor_type.get_all(db)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.ShowFloorType)
def create_floor_type(request: schemas.FloorType, db: Session = Depends(get_db)):
    """
    Create a new user
    Args:
        request (schemas.User): User to create
        db (Session, optional): Database session.
    Returns:
        schemas.ShowUser: User created
    """
    return floor_type.create(request, db)




@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=schemas.ShowFloorType)
def get_floor_type_by_id(id: int, db: Session = Depends(get_db)):
    """
    Get a user by id
    Args:
        id (int): User id
        db (Session, optional): Database session. Defaults to Depends(get_db).
    Returns:
        schemas.ShowUser: User
    """
    return floor_type.show(id, db)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_floor_type(
    id: int,
    db: Session = Depends(get_db),
    # current_user: schemas.User = Depends(get_current_user),
):
    """
    Delete a floor type by id
    Args:
        id (int): floor type  id
        db (Session, optional): Database session. Defaults to None.
        current_user (schemas.User, optional): Current user. Defaults to None.
    Returns:
        None: None
    """
    return floor_type.destroy(id, db)


@router.put("/", status_code=status.HTTP_202_ACCEPTED)
def update_floor_type(
    id: str,
    # floor_name: str,
    # floor_description: str,
    # floor_price: float,
    # floor_image: Optional[UploadFile] = File(...),
    request: schemas.FloorType,
    db: Session = Depends(get_db),
    # current_user: schemas.User = Depends(get_current_user),
):
   
    return floor_type.update(request, id, db)
