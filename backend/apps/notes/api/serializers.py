from rest_framework import serializers
from rest_framework.serializers import (
    Serializer,
    ModelSerializer,
    SerializerMethodField,
)
from drf_yasg.utils import swagger_serializer_method
from notes.models import Note, Folder


class MessageResponseSerializer(Serializer):
    message = serializers.CharField()


class ErrorResponseSerializer(Serializer):
    error = serializers.CharField()


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
        nested_folders = instance.children.filter(is_active=True).order_by('title')
        folder_serializer = self.__class__(nested_folders, many=True)

        notes = instance.notes.filter(is_active=True).order_by('title')
        note_serializer = NoteTreeSerializer(notes, many=True)

        return folder_serializer.data + note_serializer.data


class CreateFolderSerializer(ModelSerializer):
    class Meta:
        model = Folder
        fields = (
            'id',
            'title',
            'owner',
            'parent',
        )
        read_only_fields = ('id',)


class CreateNoteSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = (
            'id',
            'title',
            'folder',
            'owner',
        )
        read_only_fields = ('id',)


class UpdateTitleSerializer(Serializer):
    id = serializers.UUIDField(format='hex_verbose')
    title = serializers.CharField(max_length=255)


class UpdateTitlesRequestSerializer(Serializer):
    updates = serializers.ListField(
        child=UpdateTitleSerializer()
    )
