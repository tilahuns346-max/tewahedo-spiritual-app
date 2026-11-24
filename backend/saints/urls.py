from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaintViewSet, SynaxariumReadingViewSet

app_name = 'saints'

router = DefaultRouter()
router.register(r'synaxarium', SynaxariumReadingViewSet, basename='synaxarium')
router.register(r'', SaintViewSet, basename='saint')

urlpatterns = [
    path('', include(router.urls)),
]
