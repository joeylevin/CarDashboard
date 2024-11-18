# models.py
# This file defines the data models for the Django application.
# It contains models for car makes and car models,
# which are related to each other using a foreign key.
# These models are used for storing and retrieving car-related
# information in the database.

from django.db import models
# from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import AbstractUser, BaseUserManager


class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name  # Return the name as the string representation


class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    # Many-to-One relationship
    name = models.CharField(max_length=100)
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
    ]
    type = models.CharField(max_length=10, choices=CAR_TYPES, default='SUV')
    year = models.IntegerField(default=2023,
                               validators=[
                                    MaxValueValidator(2025),
                                    MinValueValidator(2000)
                                ])

    def __str__(self):
        return self.name  # Return the name as the string representation


class CustomUserManager(BaseUserManager):
    def create_user(self,
                    username,
                    password=None,
                    user_type='user',
                    dealer_id=None,
                    **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username,
                          user_type=user_type,
                          **extra_fields)

        if user_type == 'dealer' and dealer_id is not None:
            user.dealer_id = dealer_id
        else:
            user.dealer_id = None

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self,
                         username,
                         password=None,
                         user_type='admin',
                         dealer_id=None,
                         **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, user_type, dealer_id,
                                **extra_fields)


class CustomUser(AbstractUser):
    user_type_choices = [
        ('user', 'User'),
        ('admin', 'Admin'),
        ('dealer', 'Dealer'),
    ]

    user_type = models.CharField(max_length=10,
                                 choices=user_type_choices,
                                 default='user')
    dealer_id = models.PositiveIntegerField(null=True, blank=True)

    def is_admin(self):
        return self.user_type == 'admin'

    def is_dealer(self):
        return self.user_type == 'dealer'

    def is_user(self):
        return self.user_type == 'user'

    def __str__(self):
        return self.username

    # Add the dealer relationship
    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        if self.user_type != 'dealer':
            self.dealer_id = None  # Ensure dealer_id is null for non-dealers
        super().save(*args, **kwargs)
