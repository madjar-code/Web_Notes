from django.contrib import admin
from common.mixins.admin import ReadOnlyFieldsAdmin
from .models import Note, Folder


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


@admin.register(Folder)
class FolderAdmin(ReadOnlyFieldsAdmin):
    list_display = (
        'title',
        'owner',
        'parent',
        'updated_at',
        'created_at',
        'is_active',
    )
    list_filder = (
        'owner',
        'parent',
    )
    search_fields = (
        'title',
        'parent__title',
        'owner',
    )
