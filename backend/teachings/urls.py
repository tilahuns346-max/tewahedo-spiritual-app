from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeachingCategoryViewSet, LessonViewSet, LessonBookmarkListView

app_name = 'teachings'

router = DefaultRouter()
router.register(r'categories', TeachingCategoryViewSet, basename='category')
router.register(r'lessons', LessonViewSet, basename='lesson')

urlpatterns = [
    path('', include(router.urls)),
    path('bookmarks/', LessonBookmarkListView.as_view(), name='bookmarks-list'),
]
