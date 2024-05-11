# from rest_framework import serializers
from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField,
)
from drf_yasg.utils import swagger_serializer_method
from notes.models import Note, Folder


class NoteTreeSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = (
            'id',
            'title',
            # 'body',
            # 'owner',
            # 'folder',
            # 'created_at',
            # 'updated_at',
            # 'is_active',
        )
        read_only_fields = fields


class FolderTreeSerializer(ModelSerializer):
    children = SerializerMethodField()
    # notes = NoteSerializer(many=True)
    class Meta:
        model = Folder
        fields = (
            'id',
            'title',
            'children',
            # 'notes',
            # 'created_at',
            # 'updated_at',
            # 'is_active',
        )
        read_only_fields = fields

    def get_children(self, instance: Folder):
        nested_folders = instance.children.filter(is_active=True)
        folder_serializer = self.__class__(nested_folders, many=True)

        notes = instance.notes.filter(is_active=True)
        note_serializer = NoteTreeSerializer(notes, many=True)

        return folder_serializer.data + note_serializer.data
