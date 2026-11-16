import os
from dotenv import load_dotenv
from pymongo import MongoClient, ASCENDING

load_dotenv()

# Read MongoDB connection URI. Defaults to local MongoDB, supports MongoDB Atlas URI.
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "msme_connect_ai")

# Initialize PyMongo Client
client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
businesses_collection = db["businesses"]
products_collection = db["products"]
collaborations_collection = db["collaborations"]
marketing_collection = db["marketing_content"]
opportunities_collection = db["opportunities"]
analytics_collection = db["analytics"]


def init_db_indexes():
    """Ensure essential indexes exist for performance and uniqueness."""
    try:
        # Unique email constraint
        users_collection.create_index([("email", ASCENDING)], unique=True)
        # Hyperlocal and search indexes
        businesses_collection.create_index([
            ("name", ASCENDING),
            ("city", ASCENDING),
            ("pin_code", ASCENDING),
            ("category", ASCENDING)
        ])
        businesses_collection.create_index([("owner_id", ASCENDING)])
        products_collection.create_index([("business_id", ASCENDING)])
        collaborations_collection.create_index([("sender_business_id", ASCENDING)])
        collaborations_collection.create_index([("receiver_business_id", ASCENDING)])
        analytics_collection.create_index([("business_id", ASCENDING)], unique=True)
        print("MongoDB indexes verified successfully.")
    except Exception as e:
        print(f"Warning initializing MongoDB indexes: {e}")


def format_doc(doc: dict) -> dict:
    """Helper to convert MongoDB ObjectId to string id."""
    if not doc:
        return doc
    doc_copy = dict(doc)
    if "_id" in doc_copy:
        doc_copy["id"] = str(doc_copy.pop("_id"))
    return doc_copy


def get_db():
    """FastAPI dependency to provide access to database collections."""
    return {
        "users": users_collection,
        "businesses": businesses_collection,
        "products": products_collection,
        "collaborations": collaborations_collection,
        "marketing": marketing_collection,
        "opportunities": opportunities_collection,
        "analytics": analytics_collection,
    }
