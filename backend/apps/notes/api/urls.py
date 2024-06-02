from django.urls import path
from .views import (
    FolderTreeView,
    CurrentUserRootTreeView,
    CreateFolderView,
    CreateNoteView,
    DeleteNoteView,
    DeleteFolderView,
    delete_item,
    move_item,
    update_titles,
)


app_name = 'notes'


urlpatterns = [
    path('notes/root/', CurrentUserRootTreeView.as_view(), name='root_folder_details'),
    path('notes/<str:id>/', FolderTreeView.as_view(), name='folder_details'),    
    path('folders/', CreateFolderView.as_view(), name='create_folder'),
    path('notes/', CreateNoteView.as_view(), name='create_note'),
    path('notes/delete/<str:id>/', DeleteNoteView.as_view(), name='delete_note'),
    path('folders/delete/<str:id>/', DeleteFolderView.as_view(), name='delete_folder'),
    path('items/delete/<str:id>/', delete_item, name='delete_item'),
    path('items/update-titles/', update_titles, name='update_titles'),
    path('items/move/<str:item_id>/<str:new_parent_id>/', move_item, name='move_item'),
]
