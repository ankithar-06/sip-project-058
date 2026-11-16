from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db_indexes, db
from auth import router as auth_router
from business_routes import router as business_router
from product_routes import router as product_router
from marketing_routes import router as marketing_router
from collaboration_routes import router as collaboration_router
from opportunity_routes import router as opportunity_router, seed_opportunities_if_needed
from analytics_routes import router as analytics_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure indexes and seed opportunities
    try:
        init_db_indexes()
        seed_opportunities_if_needed()
    except Exception as e:
        print(f"Startup initialization notice: {e}")
    yield


app = FastAPI(
    title="MSME Connect AI API",
    description="AI-Powered Digital Growth, Hyperlocal Discovery and Collaboration Platform for Informal MSMEs",
    version="2.0.0",
    lifespan=lifespan,
)

# Enable CORS for React frontend (Vite default port 5173, preview 4173, production deployments)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(auth_router)
app.include_router(business_router)
app.include_router(product_router)
app.include_router(marketing_router)
app.include_router(collaboration_router)
app.include_router(opportunity_router)
app.include_router(analytics_router)


@app.get("/")
def root():
    return {
        "platform": "MSME Connect AI",
        "status": "online",
        "database": "MongoDB",
        "version": "2.0.0",
        "documentation": "/docs",
    }


@app.get("/health")
def health_check():
    # Verify MongoDB connection
    try:
        db.command("ping")
        mongo_status = "connected"
    except Exception as e:
        mongo_status = f"error: {str(e)}"

    return {
        "status": "healthy" if mongo_status == "connected" else "degraded",
        "application": "MSME Connect AI",
        "database": mongo_status,
    }
