from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PreacherViewSet, SermonCategoryViewSet, SermonViewSet, SermonFavoriteListView

app_name = 'sermons'

router = DefaultRouter()
router.register(r'preachers', PreacherViewSet, basename='preacher')
router.register(r'categories', SermonCategoryViewSet, basename='sermon-category')
router.register(r'sermons', SermonViewSet, basename='sermon')

urlpatterns = [
    path('', include(router.urls)),
    path('favorites/', SermonFavoriteListView.as_view(), name='favorites-list'),
]
