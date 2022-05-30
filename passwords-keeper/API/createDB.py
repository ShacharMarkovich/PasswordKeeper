from passwordsKepper import db, app
from passwordsKepper.models import User, Data
import time
if __name__ == "__main__":
    db.drop_all()
    db.create_all()
    
    # check:
    print("\nusers table:\t",User.query.all())
    print("data table:\t",Data.query.all())