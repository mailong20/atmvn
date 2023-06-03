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


@router.get("/signup", response_class=HTMLResponse)
async def index(request: Request):
    # current_user: schemas.User = Depends(get_current_user),):
    """
    Home page
    Args:
        request (Request): Request object
    Returns:
        HTMLResponse: HTML response
    """
    return templates.TemplateResponse("signup.html", {"request": request})


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


@router.get("/showroom", response_class=HTMLResponse)
async def company(request: Request):
    # current_user: schemas.User = Depends(get_current_user),):
    """
    Home page
    Args:
        request (Request): Request object
    Returns:
        HTMLResponse: HTML response
    """
    return templates.TemplateResponse("showroom.html", {"request": request})


@router.get("/cungcap", response_class=HTMLResponse)
async def company(request: Request):
    # current_user: schemas.User = Depends(get_current_user),):
    """
    Home page
    Args:
        request (Request): Request object
    Returns:
        HTMLResponse: HTML response
    """
    return templates.TemplateResponse("cungcap.html", {"request": request})


@router.get("/products/", response_class=HTMLResponse)
async def show_products(request: Request):
    # current_user: schemas.User = Depends(get_current_user),):

    return templates.TemplateResponse("products.html", {"request": request, "floor_type_id": "all"})


@router.get("/products/{id}", response_class=HTMLResponse)
async def show_products_by_id(request: Request, id: str):
    # current_user: schemas.User = Depends(get_current_user),):
    return templates.TemplateResponse("products.html", {"request": request, "floor_type_id": id})


@router.get("/product/{id}", response_class=HTMLResponse)
async def show_product_by_id(request: Request, id: str):
    # current_user: schemas.User = Depends(get_current_user),):
    return templates.TemplateResponse("product_detail.html", {"request": request, "floor_id": id})


@router.get("/floor/{id}", response_class=HTMLResponse)
async def floor_id(request: Request, id: int):
    """
    Floor page by ID
    Args:
        request (Request): Request object
        id (int): Floor ID
    Returns:
        HTMLResponse: HTML response
    """
    return templates.TemplateResponse("floor_cus_readid.html", {"request": request, "floor_id": id})
