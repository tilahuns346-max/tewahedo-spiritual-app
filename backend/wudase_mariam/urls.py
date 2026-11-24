from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WudaseDayViewSet, WudaseStanzaViewSet, WudaseBookmarkViewSet

app_name = 'wudase_mariam'

router = DefaultRouter()
router.register(r'days', WudaseDayViewSet, basename='wudase-day')
router.register(r'stanzas', WudaseStanzaViewSet, basename='wudase-stanza')
router.register(r'bookmarks', WudaseBookmarkViewSet, basename='wudase-bookmark')

urlpatterns = [
    path('', include(router.urls)),
]
