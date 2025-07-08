from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("categories/", categoryListCreateView.as_view(), name="category-list-create"),
    path("auth/register/", register, name="register_user"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/validate-token/', TokenValidationView.as_view(), name='validate_token'),
]
