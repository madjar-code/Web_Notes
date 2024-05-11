from uuid import UUID
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from notes.models import Folder
from .serializers import FolderTreeSerializer


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
