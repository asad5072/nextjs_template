from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("email", "username", "password", "first_name", "last_name")
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {"required": False},
        }

    def create(self, validated_data):
        user = User(
            email=validated_data["email"],
            username=validated_data.get("username", validated_data["email"]),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user