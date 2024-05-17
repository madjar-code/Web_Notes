from uuid import UUID
from typing import Optional
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import (
    RetrieveAPIView,
    CreateAPIView,
    GenericAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from notes.models import Folder, Note
from .serializers import (
    FolderTreeSerializer,
    CreateFolderSerializer,
    CreateNoteSerializer,
)


class FolderTreeView(RetrieveAPIView):
    serializer_class = FolderTreeSerializer
    queryset = Folder.active_objects.all()
    # permission_classes = (IsAuthenticated,)
    lookup_field = 'id'

    @swagger_auto_schema(
        operation_id='folder_tree_view',
        responses={
            status.HTTP_200_OK: openapi.Response(
                description='Successful response',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(type=openapi.TYPE_STRING),
                        'title': openapi.Schema(type=openapi.TYPE_STRING),
                        'children': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(type=openapi.TYPE_OBJECT)
                        )
                    }
                )
            )
        }
    )
    def get(
            self,
            request: Request,
            id: UUID,
        ) -> Response:
        folder: Folder | None = self.queryset.filter(id=id).first()
        if not folder:
            return Response(
                {'error': 'No folder with given `id`'},
                status.HTTP_404_NOT_FOUND
            )
        serializer: FolderTreeSerializer = self.serializer_class(folder)
        return Response(
            serializer.data,
            status.HTTP_200_OK,
        )


class CreateFolderView(CreateAPIView):
    serializer_class = CreateFolderSerializer
    # permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(operation_id='create_folder')
    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            serializer.data,
            status.HTTP_200_OK,
        )


class CreateNoteView(CreateAPIView):
    serializer_class = CreateNoteSerializer
    # permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(operation_id='create_note')
    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            serializer.data,
            status.HTTP_200_OK,
        )


class DeleteNoteView(GenericAPIView):
    # permission_classes = (IsAuthenticated,)
    queryset = Note.active_objects.all()

    @swagger_auto_schema(operation_id='delete_note')
    def delete(self, request: Request, id: UUID) -> Response:
        note: Note = self.queryset.filter(id=id).first()
        if not note:
            return Response(
                {'error': 'No note with given `id`'},
                status.HTTP_404_NOT_FOUND,
            )
        note.soft_delete()
        return Response(
            {'message': 'Deletion complete'},
            status.HTTP_204_NO_CONTENT,
        )


class DeleteFolderView(GenericAPIView):
    # permission_classes = (IsAuthenticated,)
    queryset = Folder.active_objects.all()

    @swagger_auto_schema(operation_id='delete_folder')
    def delete(self, request: Request, id: UUID) -> Response:
        folder: Note = self.queryset.filter(id=id).first()
        if not folder:
            return Response(
                {'error': 'No folder with given `id`'},
                status.HTTP_404_NOT_FOUND,
            )
        folder.soft_delete()
        return Response(
            {'message': 'Deletion complete'},
            status.HTTP_204_NO_CONTENT,
        )


@api_view(['DELETE'])
def delete_item(request: Request, id: UUID) -> Response:
    """
    Deletes a note or folder based on the provided ID.

    Arguments:
        request: The incoming DELETE request.
        id: The ID of the note or folder to be deleted.

    Returns:
        A JSON response with a success message on deletion (204 No Content)
        or an error message (404 Not Found or 400 Bad Request).
    """
    note = Note.active_objects.filter(id=id).first()
    folder = Folder.active_objects.filter(id=id).first()
    item: Optional[Folder | Note] = note or folder


    if not item:
        return Response(
            {'error': 'No item with given `id`'},
            status.HTTP_404_NOT_FOUND,
        )

    if not isinstance(item, (Note, Folder)):
        raise ValidationError({'error': 'Invalid item type'})

    item.soft_delete()
    return Response(
        {'message': 'Deletion complete'},
        status.HTTP_204_NO_CONTENT,
    )
