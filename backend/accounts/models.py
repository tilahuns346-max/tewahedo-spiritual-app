from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.SUPER_ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', _('Super Admin (ዋና አስተዳዳሪ)')
        CONTENT_MANAGER = 'CONTENT_MANAGER', _('Content Manager (የይዘት መሪ)')
        EDITOR = 'EDITOR', _('Editor (አዘጋጅ / አራሚ)')
        NORMAL_USER = 'NORMAL_USER', _('Spiritual Seeker (ምእመን)')

    class Language(models.TextChoices):
        AMHARIC = 'am', _('Amharic (አማርኛ)')
        GEEZ = 'gez', _('Ge\'ez (ግዕዝ)')
        ENGLISH = 'en', _('English')

    class ThemePreference(models.TextChoices):
        BURGUNDY_GOLD = 'burgundy_gold', _('Burgundy & Gold (ስብሐት)')
        DARK_LITURGICAL = 'dark_liturgical', _('Dark Liturgical (ዋዜማ)')
        LIGHT_PARCHMENT = 'light_parchment', _('Warm Parchment (ብርሃን)')

    username = models.CharField(_('Username'), max_length=150, unique=True, blank=True, null=True)
    email = models.EmailField(_('Email address'), unique=True)
    full_name = models.CharField(_('Full Name (ሙሉ ስም)'), max_length=255, blank=True)
    phone_number = models.CharField(_('Phone Number'), max_length=30, blank=True)
    baptismal_name = models.CharField(_('Baptismal Name (የክርስትና ስም)'), max_length=150, blank=True)
    role = models.CharField(_('Role'), max_length=30, choices=Role.choices, default=Role.NORMAL_USER)
    preferred_language = models.CharField(_('Language'), max_length=10, choices=Language.choices, default=Language.AMHARIC)
    theme_preference = models.CharField(_('Theme'), max_length=30, choices=ThemePreference.choices, default=ThemePreference.BURGUNDY_GOLD)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(_('Spiritual Bio'), blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = _('User (ተጠቃሚ)')
        verbose_name_plural = _('Users (ተጠቃሚዎች)')
        ordering = ['-date_joined']

    def __str__(self):
        return self.full_name or self.email
