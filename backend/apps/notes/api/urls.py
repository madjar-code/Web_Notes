from django.urls import path
from .views import (
    FolderTreeView,
    CreateFolderView,
)


app_name = 'notes'


urlpatterns = [
    path('notes/<str:id>/', FolderTreeView.as_view(), name='folder_details'),
    path('folders/', CreateFolderView.as_view(), name='create_folder'),
]
