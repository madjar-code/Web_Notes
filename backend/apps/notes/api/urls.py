from django.urls import path
from .views import (
    FolderTreeView,
    CreateFolderView,
    CreateNoteView,
    DeleteNoteView,
    DeleteFolderView,
    delete_item,
)


app_name = 'notes'


urlpatterns = [
    path('notes/<str:id>/', FolderTreeView.as_view(), name='folder_details'),
    path('folders/', CreateFolderView.as_view(), name='create_folder'),
    path('notes/', CreateNoteView.as_view(), name='create_note'),
    path('notes/delete/<str:id>/', DeleteNoteView.as_view(), name='delete_note'),
    path('folders/delete/<str:id>/', DeleteFolderView.as_view(), name='delete_folder'),
    path('items/delete/<str:id>/', delete_item, name='delete_item'),
]
