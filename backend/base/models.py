from django.db import models
from django.contrib.auth.models import AbstractUser
import time
import random


# Create your models here.
def generate_unique_id():
    return int(time.time() * 1) + random.randint(0, 999)


class User(AbstractUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    id = models.BigIntegerField(
        primary_key=True,
        default=generate_unique_id,
        editable=False,
    )

    def __str__(self):
        return self.name + " (" + self.email + ")"

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.first_name + " " + self.last_name
        super().save(*args, **kwargs)


class Category(models.Model):
    id = models.BigIntegerField(
        primary_key=True, default=generate_unique_id, editable=False
    )
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
