from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from markdownx import urls as markdownx_urls
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from .yasg import info


schema_view = get_schema_view(
    info,
    public=True,
    permission_classes=[permissions.AllowAny],
)

API_PREFIX = 'api/v1'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('markdownx/', include(markdownx_urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT
    )

# API Docs
urlpatterns += [
    path('swagger<str:format>/', schema_view.without_ui(), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger'), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc'), name='schema-redoc'),
]
