from flask import Flask, request, jsonify, session
from passwordsKepper import app, db, bcrypt
from flask_login import login_user, logout_user, current_user, login_required
import passwordsKepper.models as models
from datetime import timedelta
import secrets
import hashlib


@app.before_request
def make_session_permanent():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=10)


def setPassword(password):
    # TODO: change to bcrypte
    salt = secrets.token_bytes(32)
    return hashlib.md5(salt+password.encode()).hexdigest(), salt


@app.route('/islogin', methods=['GET'])
def is_log_in():
    if current_user.is_authenticated:
        return jsonify(status="success", description="User is login.")
    return jsonify(status="error", description="User is not login.")


@app.route('/all-data', methods=['GET'])
@login_required
def getAllData():
    '''
    this function is send all the data in the 'Data' table in the database file
    '''
    strings = []
    all_data = models.Data.query.filter_by(owner=current_user).all()
    for data in all_data:
        strings.append(data.jsonify())
    return jsonify(strings)


@app.route('/add-record', methods=['POST'])
@login_required
def addRecord():
    new_record = request.get_json()
    # print(new_record) url, email, username, password
    new_data = models.Data(owner=current_user, url=new_record['url'], email=new_record['email'],
                           username=new_record['username'], password=new_record['password'])
    db.session.add(new_data)
    db.session.commit()
    return getAllData()


@app.route('/remove-record', methods=['POST'])
@login_required
def removeRecord():
    record2del = request.get_json()
    data2del = models.Data.query.filter_by(id=record2del).first()
    db.session.delete(data2del)
    db.session.commit()
    return getAllData()


@app.route('/register', methods=['POST'])
def register():
    newUser = request.get_json()
    # encrypt the password
    enc_pass = bcrypt.generate_password_hash(
        newUser['password']).decode('utf-8')
    # check if there is a user with this email
    exist = models.User.query.filter_by(email=newUser['email']).first()
    if exist is not None:
        return jsonify(status="error", description="Email already exist.")

    # create new user with the new data and save it.
    user = models.User(email=newUser['email'], password=enc_pass)
    db.session.add(user)
    db.session.commit()
    login_user(user)  # process login
    # TODOL return seccussed
    return jsonify(status="success", description="User had been created.")


@app.route("/login", methods=['POST'])
def login():
    user_data = request.get_json()
    # check if there is a user with this email
    user = models.User.query.filter_by(email=user_data['email']).first()
    if not user:
        return jsonify(status="error", description="There is a broblem with those email or password.")

    # check if the user enter the right password:
    if not bcrypt.check_password_hash(user.password, user_data['password']):
        return jsonify(status="error", description="There is a broblem with those email or password.")

    # email end password are currect, login in:
    login_user(user, remember=user_data['rememberMe'])
    return jsonify(status="success", description="User had been logged in.")


@app.route("/logout", methods=['GET', 'POST'])
def logout():
    logout_user()
    return jsonify(status="success", description="User had been logged out successfully.")


@app.route("/hash", methods=['POST'])
@login_required
def hashed():
    return jsonify(status="success", hashed=current_user.password)


@app.route("/show-password", methods=['POST'])
@login_required
def show_password():
    # get data from POST body request:
    data = request.get_json()
    hashed_pass = data['hashed_pass']
    record_id = data['record_id']

    # get the user who own this record:
    user = models.Data.query.filter_by(id=record_id).first().owner
    if user != current_user:
        return jsonify(status="error", description="This records is not yours!")

    # check if the user enter the right password:
    if not bcrypt.check_password_hash(user.password, hashed_pass):
        return jsonify(status="error", description="Wrong password")

    return jsonify(status="success", description=user.password)


@app.route('/')
def home():
    return "<h1>Hey</h1>"


@app.route('/home')
def index():
    return app.send_static_file('index.html')
