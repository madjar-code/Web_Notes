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
