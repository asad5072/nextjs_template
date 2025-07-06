from django.contrib import admin
from .models import *


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "name")  # Optional: show fields in admin list


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")  # ✅ Now "name" will show properly


# admin.site.register(Category)  # Register Category without custom admin class
