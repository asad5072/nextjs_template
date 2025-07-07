from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from rest_framework.exceptions import ValidationError
from django.contrib.auth.hashers import make_password


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ["groups", "user_permissions"]
        # fields = '__all__'
        extra_kwargs = {
            "password": {"write_only": True},
            # 'username': {'read_only': True},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError({"error": "This email is already registered."})
        return value

    def create(self, validated_data):
        # Hash the password
        validated_data["password"] = make_password(validated_data["password"])
        return User.objects.create(**validated_data)

    def to_representation(self, instance):
        """Customize the serialized output."""
        representation = super().to_representation(instance)
        # Remove the password field from the output
        representation.pop("password", None)
        return representation
