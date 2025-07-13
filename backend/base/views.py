from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Category, User
from .serializers import (
    UserRegistrationSerializer,
    CategorySerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

# ...existing code...


# Create your views here.
class categoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@api_view(["POST"])
def register(request):
    if request.method == "POST":
        print("Request data:", request.data)
        # Ensure the request data contains 'email' and 'password'
        data = request.data
        data["username"] = data["email"]
        serializer = UserRegistrationSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=201)
        return Response(serializer.errors, status=400)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class TokenValidationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user

        # Generate tokens using Simple JWT
        refresh = RefreshToken.for_user(user)

        user_data = UserSerializer(user).data
        # Prepare the data to be returned
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": user_data,
        }

        return Response(data)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication]
