from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AudioCategoryViewSet, AudioArtistViewSet, AudioAlbumViewSet, AudioTrackViewSet

app_name = 'audio'

router = DefaultRouter()
router.register(r'categories', AudioCategoryViewSet, basename='audio-category')
router.register(r'artists', AudioArtistViewSet, basename='audio-artist')
router.register(r'albums', AudioAlbumViewSet, basename='audio-album')
router.register(r'tracks', AudioTrackViewSet, basename='audio-track')

urlpatterns = [
    path('', include(router.urls)),
]
