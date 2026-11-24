from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KidaseCategoryViewSet, AnaphoraViewSet, LiturgySectionViewSet

app_name = 'kidase'

router = DefaultRouter()
router.register(r'categories', KidaseCategoryViewSet, basename='kidase-category')
router.register(r'anaphoras', AnaphoraViewSet, basename='anaphora')
router.register(r'sections', LiturgySectionViewSet, basename='liturgy-section')

urlpatterns = [
    path('', include(router.urls)),
]
