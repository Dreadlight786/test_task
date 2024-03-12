from ninja import NinjaAPI
from ninja.pagination import paginate, PageNumberPagination
from main.models import Article, Comment
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from main.schemas import (
    ArticleSchema,
    CommentSchema,
    CommentCreateSchema,
    Error,
    UserSchema,
    UserLoginSchema,
    UserRegistrationSchema,
)


api = NinjaAPI()


@api.post('registration/', response={200: UserSchema, 400: Error})
def user_registration(request, data: UserRegistrationSchema):
    username, password, password_confirm = data.username, data.password, data.password_confirm

    if password != password_confirm:
        return 400, {'message', 'Passwords don\'t match'}
    
    user = User.objects.create_user(username=username, email='', password=password)
    user.save()

    user = authenticate(request, username=username, password=password)
    login(request, user)
    return user


@api.post('login/', response={200: UserSchema, 404: Error})
def user_login(request, data: UserLoginSchema):
    username, password = data.username, data.password
    user = authenticate(request, username=username, password=password)

    if user is None:
        return 404, {'message': 'User not found'}

    login(request, user)
    return user

@api.get('who_am_i/', response={200: UserSchema, 401: Error})
def get_user(request):
    user = request.user

    if user.is_authenticated:
        return user

    return 401, {'message': 'Unauthorized'}


@api.get('articles/', response=list[ArticleSchema])
@paginate(PageNumberPagination)
def get_articles(request):
    return Article.objects.all()


@api.get('articles/{slug}/', response=ArticleSchema)
def get_article(request, slug: str):
    article = get_object_or_404(Article, slug=slug)
    return article


@api.post('comments/', response={200: CommentSchema, 401: Error, 404: Error})
def add_comment(request, data: CommentCreateSchema):
    article_id, text = data.article_id, data.text

    author = request.user
    if not author.is_authenticated:
        return 401, {'message': 'Unauthorized'}

    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return 404, {'message': 'Article not found'}

    comment = Comment(author=author, article=article, text=text)
    comment.save()

    return comment


@api.get('article_comments/{slug}/', response=list[CommentSchema])
def get_comments(request, slug: str):
    article = get_object_or_404(Article, slug=slug)

    return Comment.objects.filter(article=article).all()