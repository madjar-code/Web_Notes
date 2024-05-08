from django.db import models
from django.contrib.auth import get_user_model
from markdownx.models import MarkdownxField
from common.mixins.models import BaseModel


class Note(BaseModel):
    title = models.CharField(max_length=255)
    body = MarkdownxField(
        blank=True,
        null=True
    )
    folder = models.ForeignKey(
        to='Folder',
        blank=True,
        null=True,
        on_delete=models.CASCADE,
    )
    owner = models.ForeignKey(
        to=get_user_model(),
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
    )

    class Meta:
        verbose_name = 'Note'
        verbose_name_plural = 'Notes'

    def __str__(self) -> str:
        return self.title


class Folder(BaseModel):
    title = models.CharField(max_length=255)
    owner = models.ForeignKey(
        to=get_user_model(),
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
    )
    parent = models.ForeignKey(
        to='self',
        blank=True,
        null=True,
        related_name='children',
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = 'Folder'
        verbose_name_plural = 'Folders'

    def __str__(self) -> str:
        return self.title
