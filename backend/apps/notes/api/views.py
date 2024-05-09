from rest_framework.generics import RetrieveAPIView
from notes.models import Folder
from .serializers import FolderTreeSerializer


class FolderTreeView(RetrieveAPIView):
    queryset = Folder.active_objects.all()
    serializer_class = FolderTreeSerializer
    lookup_field = 'id'
