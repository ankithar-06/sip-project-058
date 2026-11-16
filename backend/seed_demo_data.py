import datetime
from pymongo import MongoClient
import os
import bcrypt
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "msme_connect_ai")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

def hash_pw(pw: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw.encode("utf-8"), salt).decode("utf-8")

def seed():
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    # 1. Create a Demo Owner if not exists
    demo_email = "demo@msmeconnect.in"
    demo_user = db.users.find_one({"email": demo_email})
    if not demo_user:
        res = db.users.insert_one({
            "name": "Ramesh Kumar Sharma",
            "email": demo_email,
            "password_hash": hash_pw("password123"),
            "role": "msme_owner",
            "created_at": now,
            "updated_at": now,
        })
        user_id = str(res.inserted_id)
        print("Created demo user:", demo_email)
    else:
        user_id = str(demo_user["_id"])
        print("Demo user already exists:", demo_email)

    # 2. Check if Demo Business exists
    demo_biz = db.businesses.find_one({"owner_id": user_id})
    if not demo_biz:
        biz_res = db.businesses.insert_one({
            "owner_id": user_id,
            "name": "Jaipur Royal Terracotta & Pottery",
            "owner_name": "Ramesh Kumar Sharma",
            "category": "Handicrafts & Artisans",
            "description": "Authentic Rajasthani handcrafted terracotta vases, earthen cookware, and ceremonial lamps made with traditional non-toxic clay.",
            "location": "Plot 14, Sanganer Industrial Artisan Cluster",
            "city": "Jaipur",
            "pin_code": "302029",
            "contact_email": demo_email,
            "phone": "+91 98290 12345",
            "whatsapp": "+91 98290 12345",
            "website": "https://jaipurterracotta.example.com",
            "operating_hours": "9:30 AM - 7:30 PM",
            "created_at": now,
            "updated_at": now,
        })
        biz_id = str(biz_res.inserted_id)
        print("Created demo business:", biz_id)

        # 3. Add Demo Products
        db.products.insert_many([
            {
                "business_id": biz_id,
                "name": "Handmade Terracotta Water Bottle (1 Litre)",
                "description": "Eco-friendly, naturally cooling clay water bottle with leak-proof wooden cork cap.",
                "price": 380.0,
                "category": "Earthen Cookware",
                "in_stock": True,
                "created_at": now,
                "updated_at": now,
            },
            {
                "business_id": biz_id,
                "name": "Festive Hand-Painted Diya Set (Pack of 12)",
                "description": "Traditional oil lamps painted with organic eco-friendly natural dyes for festivals.",
                "price": 250.0,
                "category": "Ceremonial Crafts",
                "in_stock": True,
                "created_at": now,
                "updated_at": now,
            },
            {
                "business_id": biz_id,
                "name": "Vintage Terracotta Indoor Planter Pot",
                "description": "Porosity-balanced clay planter promoting optimal root aeration and plant longevity.",
                "price": 520.0,
                "category": "Home Decor",
                "in_stock": True,
                "created_at": now,
                "updated_at": now,
            }
        ])
        print("Added 3 demo products.")

        # 4. Initialize analytics
        db.analytics.insert_one({
            "business_id": biz_id,
            "profile_views": 18,
            "product_inquiries": 4,
            "collaboration_requests": 2,
            "marketing_generations": 3,
            "activity_log": [
                {"action": "Profile Created", "timestamp": now, "details": "Registered Jaipur Royal Terracotta & Pottery"},
                {"action": "Product Added", "timestamp": now, "details": "Added Terracotta Water Bottle (₹380)"},
                {"action": "Product Added", "timestamp": now, "details": "Added Hand-Painted Diya Set (₹250)"},
                {"action": "Customer Inquiry", "timestamp": now, "details": "Customer initiated WhatsApp contact for Diya set"}
            ],
            "created_at": now,
            "updated_at": now,
        })
        print("Initialized demo analytics.")

    # 5. Create a Second MSME in a different category & city for discovery & collaboration testing
    second_email = "varanasi.weaves@msmeconnect.in"
    second_user = db.users.find_one({"email": second_email})
    if not second_user:
        u2 = db.users.insert_one({
            "name": "Sunita Devi",
            "email": second_email,
            "password_hash": hash_pw("password123"),
            "role": "msme_owner",
            "created_at": now,
            "updated_at": now,
        })
        u2_id = str(u2.inserted_id)
        biz2 = db.businesses.insert_one({
            "owner_id": u2_id,
            "name": "Kashi Handloom Silk & Zari Weavers",
            "owner_name": "Sunita Devi",
            "category": "Textiles & Garments",
            "description": "Heritage Banarasi silk fabrics, dupattas, and sarees crafted by traditional master weavers in Varanasi.",
            "location": "Weavers Colony, Madanpura",
            "city": "Varanasi",
            "pin_code": "221001",
            "contact_email": second_email,
            "phone": "+91 94150 67890",
            "whatsapp": "+91 94150 67890",
            "operating_hours": "10:00 AM - 8:00 PM",
            "created_at": now,
            "updated_at": now,
        })
        biz2_id = str(biz2.inserted_id)

        db.products.insert_many([
            {
                "business_id": biz2_id,
                "name": "Pure Katan Silk Banarasi Saree",
                "description": "Hand-loomed pure silk with gold zari floral bootas.",
                "price": 6500.0,
                "category": "Silk Sarees",
                "in_stock": True,
                "created_at": now,
                "updated_at": now,
            },
            {
                "business_id": biz2_id,
                "name": "Handcrafted Silk Brocade Stole",
                "description": "Lightweight pure silk stole with traditional Indian paisley motifs.",
                "price": 1800.0,
                "category": "Stoles & Dupattas",
                "in_stock": True,
                "created_at": now,
                "updated_at": now,
            }
        ])

        db.analytics.insert_one({
            "business_id": biz2_id,
            "profile_views": 25,
            "product_inquiries": 6,
            "collaboration_requests": 1,
            "marketing_generations": 2,
            "activity_log": [
                {"action": "Profile Created", "timestamp": now, "details": "Registered Kashi Handloom Silk"},
                {"action": "Product Added", "timestamp": now, "details": "Added Pure Katan Silk Banarasi Saree"}
            ],
            "created_at": now,
            "updated_at": now,
        })
        print("Created second demo business: Kashi Handloom Silk.")

if __name__ == "__main__":
    seed()
