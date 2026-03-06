from sqlalchemy import inspect
from sqlalchemy.orm import sessionmaker
from models import User
from database import engine, Base

Base.metadata.create_all(bind=engine)

class DataAccessObject:
    def __init__(self):
        self.session = sessionmaker(bind=engine)()

    def get_all_tables(self):
        return inspect(engine).get_table_names()
    
    def get_all_users(self):
        return self.session.query(User).all()

    def get_user_by_driving_license(self, driving_license_number: str):
        return self.session.query(User).filter(User.driving_license_number == driving_license_number).first()
