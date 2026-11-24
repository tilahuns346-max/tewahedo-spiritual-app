from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import AudioCategory, AudioArtist, AudioAlbum, AudioTrack
from .serializers import (
    AudioCategorySerializer,
    AudioArtistSerializer,
    AudioAlbumSerializer,
    AudioTrackListSerializer,
    AudioTrackDetailSerializer,
)

class AudioCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AudioCategory.objects.all().order_by('order', 'id')
    serializer_class = AudioCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class AudioArtistViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AudioArtist.objects.all().order_by('order', 'name_amharic')
    serializer_class = AudioArtistSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter]
    search_fields = ['name_amharic', 'name_english', 'choir_group']


class AudioAlbumViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AudioAlbum.objects.select_related('artist').all().order_by('-created_at')
    serializer_class = AudioAlbumSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['artist']
    search_fields = ['title_amharic', 'title_english']


class AudioTrackViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AudioTrack.objects.select_related('category', 'artist', 'album').all().order_by('order', '-play_count', '-created_at')
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'category__slug', 'artist', 'album', 'is_featured', 'is_trending']
    search_fields = ['title_amharic', 'title_english', 'lyrics_amharic', 'lyrics_geez', 'artist__name_amharic', 'artist__choir_group']
    ordering_fields = ['play_count', 'download_count', 'created_at', 'duration_seconds']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AudioTrackDetailSerializer
        return AudioTrackListSerializer

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_play(self, request, pk=None):
        track = self.get_object()
        track.play_count += 1
        track.save(update_fields=['play_count'])
        return Response({'play_count': track.play_count})

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_download(self, request, pk=None):
        track = self.get_object()
        track.download_count += 1
        track.save(update_fields=['download_count'])
        return Response({'download_count': track.download_count})

    @action(detail=False, methods=['get'])
    def stream_queue(self, request):
        category_slug = request.query_params.get('category')
        queryset = self.get_queryset()
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        tracks = queryset[:50]
        serializer = AudioTrackListSerializer(tracks, many=True, context={'request': request})
        return Response(serializer.data)
