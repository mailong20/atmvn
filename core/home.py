from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from fastapi.templating import Jinja2Templates

from api import floor
from database import configuration
from schema import schemas
from schema.oa2 import get_current_user
from starlette.responses import HTMLResponse
from fastapi import Request


router = APIRouter(tags=["HOME UI"], prefix="")
get_db = configuration.get_db
templates = Jinja2Templates(directory="templates")


@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    # current_user: schemas.User = Depends(get_current_user),):
    """
    Home page
    Args:
        request (Request): Request object
    Returns:
        HTMLResponse: HTML response
    """
    return templates.TemplateResponse("index.html", {"request": request})


@router.get("/login", response_class=HTMLResponse)
async def index(request: Request):
    # current_user: schemas.User = Depends(get_current_user),):
    """
    Home page
    Args:
        request (Request): Request object
    Returns:
        HTMLResponse: HTML response
    """
    return templates.TemplateResponse("login.html", {"request": request})


@router.get("/floor", response_class=HTMLResponse)
async def floor(request: Request):
    # current_user: schemas.User = Depends(get_current_user),):
    """
    Home page
    Args:
        request (Request): Request object
    Returns:
        HTMLResponse: HTML response
    """
    return templates.TemplateResponse("floor_cus_read.html", {"request": request})


@router.get("/company", response_class=HTMLResponse)
async def company(request: Request):
    # current_user: schemas.User = Depends(get_current_user),):
    """
    Home page
    Args:
        request (Request): Request object
    Returns:
        HTMLResponse: HTML response
    """
    return templates.TemplateResponse("company.html", {"request": request})


@router.get("/contact", response_class=HTMLResponse)
async def company(request: Request):
    # current_user: schemas.User = Depends(get_current_user),):
    """
    Home page
    Args:
        request (Request): Request object
    Returns:
        HTMLResponse: HTML response
    """
    return templates.TemplateResponse("contact.html", {"request": request})


@router.get("/floor/view", response_class=HTMLResponse)
async def floor_view(request: Request):
    # current_user: schemas.User = Depends(get_current_user),):

    return templates.TemplateResponse("floor_cus_read.html", {"request": request})


@router.get("/test", response_class=HTMLResponse)
async def test(request: Request):
    # current_user: schemas.User = Depends(get_current_user),):

    return templates.TemplateResponse("test.html", {"request": request})
