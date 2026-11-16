
from database import Base, engine
import models

try:
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

    for table_name in Base.metadata.tables:
        print(f"Table ready: {table_name}")

except Exception as error:
    print("Error creating tables:")
    print(error)
