from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrayerCategoryViewSet, PrayerBookViewSet, PrayerSectionViewSet, PrayerFavoriteListView

app_name = 'prayers'

router = DefaultRouter()
router.register(r'categories', PrayerCategoryViewSet, basename='prayer-category')
router.register(r'books', PrayerBookViewSet, basename='prayer-book')
router.register(r'sections', PrayerSectionViewSet, basename='prayer-section')

urlpatterns = [
    path('', include(router.urls)),
    path('favorites/', PrayerFavoriteListView.as_view(), name='favorites-list'),
]
