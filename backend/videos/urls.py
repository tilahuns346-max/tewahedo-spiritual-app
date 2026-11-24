from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoCategoryViewSet, VideoViewSet, VideoFavoriteListView

app_name = 'videos'

router = DefaultRouter()
router.register(r'categories', VideoCategoryViewSet, basename='video-category')
router.register(r'', VideoViewSet, basename='video')

urlpatterns = [
    path('', include(router.urls)),
    path('favorites/list/', VideoFavoriteListView.as_view(), name='favorites-list'),
]
