from django.contrib import admin
from common.mixins.admin import ReadOnlyFieldsAdmin
from .models import Note


@admin.register(Note)
class NoteAdmin(ReadOnlyFieldsAdmin):
    list_display = (
        'title',
        'owner',
        'updated_at',
        'created_at',
        'is_active',
    )
    list_filter = (
        'owner',
    )
    search_fields = (
        'title',
        'body',
        'owner',
    )
