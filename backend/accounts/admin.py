from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'full_name', 'baptismal_name', 'role', 'preferred_language', 'is_staff', 'is_active')
    list_filter = ('role', 'preferred_language', 'theme_preference', 'is_staff', 'is_active')
    search_fields = ('email', 'full_name', 'baptismal_name', 'phone_number')
    ordering = ('-date_joined',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('የግል መረጃ (Personal Info)'), {
            'fields': ('full_name', 'baptismal_name', 'phone_number', 'avatar', 'bio')
        }),
        (_('መንፈሳዊና ገጽታ ምርጫዎች (Preferences)'), {
            'fields': ('role', 'preferred_language', 'theme_preference')
        }),
        (_('ፈቃዶች (Permissions)'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        (_('ቀናት (Important dates)'), {
            'fields': ('last_login', 'date_joined')
        }),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'full_name', 'baptismal_name', 'role', 'preferred_language'),
        }),
    )
