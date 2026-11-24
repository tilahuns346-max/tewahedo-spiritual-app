from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TodayAggregateView,
    EthiopianCalendarView,
    DailyVerseViewSet,
    DailyDevotionalViewSet,
    FastingSeasonViewSet,
)

app_name = 'daily_content'

router = DefaultRouter()
router.register(r'verses', DailyVerseViewSet, basename='daily-verse')
router.register(r'devotionals', DailyDevotionalViewSet, basename='daily-devotional')
router.register(r'fasting', FastingSeasonViewSet, basename='fasting-season')

urlpatterns = [
    path('today/', TodayAggregateView.as_view(), name='today-overview'),
    path('calendar/', EthiopianCalendarView.as_view(), name='calendar-convert'),
    path('', include(router.urls)),
]
