from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import VideoCategory, Video, VideoFavorite
from .serializers import (
    VideoCategorySerializer,
    VideoListSerializer,
    VideoDetailSerializer,
    VideoFavoriteSerializer,
)

class VideoCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VideoCategory.objects.all().order_by('order', 'id')
    serializer_class = VideoCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class VideoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Video.objects.select_related('category').all().order_by('-is_featured', '-created_at')
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'category__slug', 'is_featured']
    search_fields = ['title_amharic', 'title_english', 'description', 'speaker_teacher']
    ordering_fields = ['view_count', 'created_at', 'duration_seconds']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return VideoDetailSerializer
        return VideoListSerializer

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_view(self, request, pk=None):
        video = self.get_object()
        video.view_count += 1
        video.save(update_fields=['view_count'])
        return Response({'view_count': video.view_count})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_favorite(self, request, pk=None):
        video = self.get_object()
        fav = VideoFavorite.objects.filter(user=request.user, video=video).first()
        if fav:
            fav.delete()
            return Response({'is_favorite': False, 'message': 'Removed from favorites.'})
        else:
            VideoFavorite.objects.create(user=request.user, video=video)
            return Response({'is_favorite': True, 'message': 'Added to favorites.'}, status=status.HTTP_201_CREATED)


class VideoFavoriteListView(generics.ListAPIView):
    serializer_class = VideoFavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return VideoFavorite.objects.filter(user=self.request.user).select_related('video', 'video__category').order_by('-created_at')
