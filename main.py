from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


from core import auth, floor, home_ui, user, admin_ui, floor_type
from database.configuration import engine
from models import models
import uvicorn

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ATM",
    description="sango.danang.vn",
    version="1.0.1"
    
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")


app.include_router(auth.router)
app.include_router(floor.router)
app.include_router(floor_type.router)
app.include_router(user.router)
app.include_router(home_ui.router)
app.include_router(admin_ui.router)



if __name__ == "__main__":
    from database.configuration import host, port
    uvicorn.run("main:app", host=host, port=port, reload=True)
