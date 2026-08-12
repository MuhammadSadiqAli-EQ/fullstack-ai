from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.users.manager import UserManager
from utils.db.models import BaseModel


class User(AbstractUser, BaseModel):
    name = models.CharField(max_length=255)
    email = models.EmailField(_("email address"), unique=True)
    organization = models.ForeignKey(
        "users.Organization",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="users",
    )
    first_name = None
    last_name = None
    username = None
    pwd_reset_required = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = UserManager()

    class Meta:
        ordering = [
            "name",
            "email",
        ]


class Organization(BaseModel):
    name = models.CharField(max_length=255)


class PasswordResetToken(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reset_tokens")
    token = models.CharField(max_length=255, unique=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
