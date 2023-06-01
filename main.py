from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


<<<<<<< Updated upstream:main.py
from core import auth, floor, home_ui, user, admin_ui
=======
from core import auth, floor, home, user, admin_ui, floor_type
>>>>>>> Stashed changes:main2.py
from database.configuration import engine
from models import models
import uvicorn

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DogeAPI",
    description="API with high performance built with FastAPI & SQLAlchemy, help to improve connection with your Backend Side.",
    version="1.0.0"
    
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")


# app.include_router(auth.router)
# app.include_router(floor.router)
app.include_router(floor_type.router)
app.include_router(user.router)
<<<<<<< Updated upstream:main.py
app.include_router(home_ui.router)
app.include_router(admin_ui.router)
=======
# app.include_router(home.router)
# app.include_router(admin_ui.router)
>>>>>>> Stashed changes:main2.py


if __name__ == "__main__":
    from database.configuration import host, port
    uvicorn.run("main:app", host=host, port=port, reload=True)
