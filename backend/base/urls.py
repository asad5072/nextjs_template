from django.urls import path
from .views import *

urlpatterns = [
    path("categories/", categoryListCreateView.as_view(), name="category-list-create"),
    path("auth/register/", register, name="register_user"),
]
