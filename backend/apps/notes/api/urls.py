from django.urls import path
from .views import FolderTreeView


app_name = 'notes'


urlpatterns = [
    path('<str:id>/', FolderTreeView.as_view(), name='folder_details'),
]
