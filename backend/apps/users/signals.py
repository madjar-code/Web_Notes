from django.dispatch import receiver
from django.db.models.signals import post_save
from notes.models import Folder
from .models import CustomUser


@receiver(post_save, sender=CustomUser)
def create_root_folder(sender, instance, created, **kwargs):
    if created:
        Folder.active_objects.create(
            title='Your Notes',
            owner=instance
        )
