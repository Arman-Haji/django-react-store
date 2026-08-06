from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True, verbose_name="Phone Number")
    email = models.EmailField(unique=True, null=True, blank=True, verbose_name="Email")
    updated_at = models.DateTimeField(auto_now=True, verbose_name= "Updated At")
    profile_image = models.ImageField(upload_to='profiles/', null=True,blank=True, verbose_name="Profile image")

    class Meta:
            verbose_name = "User"
            verbose_name_plural = "Users"
            ordering = ['-date_joined']

    def clean(self):
        super().clean()
        if not self.email and not self.phone_number:
            raise ValidationError("At least one of email or phone number must be provided.")
        
    def __str__(self):
        return self.get_full_name() or self.username