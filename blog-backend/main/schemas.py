from ninja import ModelSchema, Schema
from main.models import Article, Comment
from django.contrib.auth.models import User


class UserSchema(ModelSchema):
    class Meta:
        model = User
        fields = ['username']


class CommentSchema(ModelSchema):
    author: UserSchema

    class Meta:
        model = Comment
        fields = ('id', 'text', 'created_at')


class ArticleSchema(ModelSchema):
    author: UserSchema

    class Meta:
        model = Article
        fields = ('id', 'title', 'slug', 'text', 'description', 'created_at')


class CommentCreateSchema(Schema):
    article_id: str
    text: str


class UserLoginSchema(Schema):
    username: str
    password: str


class UserRegistrationSchema(Schema):
    username: str
    password: str
    password_confirm: str


class Error(Schema):
    message: str
