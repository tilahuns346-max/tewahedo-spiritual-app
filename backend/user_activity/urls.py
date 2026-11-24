from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlaylistViewSet,
    ListeningHistoryViewSet,
    ReadingProgressViewSet,
    DownloadRecordViewSet,
)

app_name = 'user_activity'

router = DefaultRouter()
router.register(r'playlists', PlaylistViewSet, basename='playlist')
router.register(r'history', ListeningHistoryViewSet, basename='history')
router.register(r'reading-progress', ReadingProgressViewSet, basename='reading-progress')
router.register(r'downloads', DownloadRecordViewSet, basename='download')

urlpatterns = [
    path('', include(router.urls)),
]
