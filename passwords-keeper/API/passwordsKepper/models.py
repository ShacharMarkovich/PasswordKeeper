import flask
from flask_login import UserMixin
from passwordsKepper import db, login_manager


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(600), nullable=False)
    username = db.Column(db.String(60), nullable=True)
    email = db.Column(db.String(60), nullable=False)
    password = db.Column(db.String(60), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def jsonify(self):
        return {'id': self.id, 'url': self.url, 'email': self.email, 'username': self.username, 'password': self.password}
        '''
        return flask.jsonify(id=self.id, url=self.url, email=self.email, username=self.username, password=self.password,)
        '''

    def __repr__(self):
        return f'Data({self.url}, {self.username}, {self.email})'


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    # salt = db.Column(db.LargeBinary(32), nullable=False)
    passwords_data = db.relationship('Data', backref='owner', lazy=True)

    def __repr__(self):
        return f'User({self.email})'
