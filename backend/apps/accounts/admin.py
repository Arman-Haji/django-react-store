from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = ('username', 'email', 'phone_number', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active', 'is_superuser')
    search_fields = ('username', 'email', 'phone_number')
    ordering = ('-date_joined',)

    fieldsets = UserAdmin.fieldsets + (('Extra Info', {'fields': ('phone_number', 'updated_at', 'profile_image')}),)

    add_fieldsets = UserAdmin.add_fieldsets + (('Extra Info', {'fields': ('phone_number',)}),)

    readonly_fields = ('date_joined', 'updated_at')