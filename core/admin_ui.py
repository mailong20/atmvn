from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from fastapi.templating import Jinja2Templates

from api import floor
from database import configuration
from schema import schemas
from schema.oa2 import get_current_user
from starlette.responses import HTMLResponse
from fastapi import  Request



router = APIRouter(tags=["ADMIN UI"], prefix="/admin")
get_db = configuration.get_db
templates = Jinja2Templates(directory="templates")




@router.get("/floor", response_class=HTMLResponse)
async def index(request: Request):
        # ):
    """
    Home page
    Args:
        request (Request): Request object
    Returns:
        HTMLResponse: HTML response
    """
    return templates.TemplateResponse("floor_ad_read.html", {"request": request})

@router.get("/createui", response_class=HTMLResponse)
async def index(request: Request):
        # ):
    """
    Home page
    Args:
        request (Request): Request object
    Returns:
        HTMLResponse: HTML response
    """
    return templates.TemplateResponse("floor_ad_create.html", {"request": request})
