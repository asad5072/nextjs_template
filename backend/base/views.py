from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category
from .serializers import UserRegistrationSerializer, CategorySerializer


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
