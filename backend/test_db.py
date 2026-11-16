
from sqlalchemy import text
from database import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT DATABASE()"))
        db_name = result.scalar()

        print("Database connection successful!")
        print("Connected database:", db_name)

except Exception as error:
    print("Database connection failed.")
    print("Error:", error)
