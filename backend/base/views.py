from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from .models import Category
from .serializers import *


# Create your views here.
class categoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


def register(request):
    if request.method == "POST":
        data = request.data
        data["username"] = data["email"]
        serializer = UserRegistrationSerializer(data=data)