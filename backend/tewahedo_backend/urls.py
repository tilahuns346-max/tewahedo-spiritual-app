from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # API v1 routes
    path('api/v1/auth/', include('accounts.urls', namespace='accounts')),
    path('api/v1/teachings/', include('teachings.urls', namespace='teachings')),
    path('api/v1/sermons/', include('sermons.urls', namespace='sermons')),
    path('api/v1/kidase/', include('kidase.urls', namespace='kidase')),
    path('api/v1/wudase/', include('wudase_mariam.urls', namespace='wudase_mariam')),
    path('api/v1/audio/', include('audio.urls', namespace='audio')),
    path('api/v1/videos/', include('videos.urls', namespace='videos')),
    path('api/v1/prayers/', include('prayers.urls', namespace='prayers')),
    path('api/v1/saints/', include('saints.urls', namespace='saints')),
    path('api/v1/daily/', include('daily_content.urls', namespace='daily_content')),
    path('api/v1/activity/', include('user_activity.urls', namespace='user_activity')),

    # OpenAPI Schema & Swagger UI Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
