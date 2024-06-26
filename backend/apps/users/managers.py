from pydantic import EmailStr
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):

    """
    Custom User Model Manager where email is the unique for authentication.
    """

    def create_user(
            self,
            email: EmailStr,
            password: str,
            first_name: str,
            last_name: str,
            **extra_fields,
        ) -> 'CustomUser':
        """
        Create and save a user with the given email
        address, date of birth, country and password.
        """
        from .models import CustomUser
    
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user: CustomUser = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save()
        return user

    def create_superuser(
            self,
            email: EmailStr,
            password: str,
            first_name: str,
            last_name: str,
            **extra_fields
        ) -> 'CustomUser':
        """
        Create and save a superuser with the given email
        address and password.
        """
        from .models import CustomUser

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))

        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(
            email,
            password,
            first_name,
            last_name,
            **extra_fields,
        )
