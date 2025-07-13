from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework import generics
from .models import Category
from .serializers import CategorySerializer

User = get_user_model()


# Create your views here.
class categoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [
        IsAuthenticated
    ]  # Require authentication to create categories


@api_view(["POST"])
@permission_classes([AllowAny])  # Allow unauthenticated access for registration
def register(request):
    try:
        data = request.data
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        email = data.get("email")
        password = data.get("password")

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "User with this email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create user
        user = User.objects.create_user(
            username=email,  # Use email as username
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]  # Allow unauthenticated access for login


class TokenValidationView(APIView):
    permission_classes = [
        IsAuthenticated
    ]  # Require authentication for token validation

    def get(self, request):
        return Response(
            {
                "user": {
                    "id": request.user.id,
                    "email": request.user.email,
                    "username": request.user.username,
                    "first_name": request.user.first_name,
                    "last_name": request.user.last_name,
                }
            }
        )


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access to view categories
