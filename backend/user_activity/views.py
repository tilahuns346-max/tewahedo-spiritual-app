from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Playlist, PlaylistItem, ListeningHistory, ReadingProgress, DownloadRecord
from .serializers import (
    PlaylistSerializer,
    PlaylistItemSerializer,
    ListeningHistorySerializer,
    ReadingProgressSerializer,
    DownloadRecordSerializer,
)
from audio.models import AudioTrack

class PlaylistViewSet(viewsets.ModelViewSet):
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Playlist.objects.filter(user=self.request.user).prefetch_related('items', 'items__track')

    @action(detail=True, methods=['post'])
    def add_track(self, request, pk=None):
        playlist = self.get_object()
        track_id = request.data.get('track_id')
        if not track_id:
            return Response({'error': 'track_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            track = AudioTrack.objects.get(pk=track_id)
        except AudioTrack.DoesNotExist:
            return Response({'error': 'Track not found.'}, status=status.HTTP_404_NOT_FOUND)

        next_order = playlist.items.count() + 1
        item, created = PlaylistItem.objects.get_or_create(
            playlist=playlist, track=track, defaults={'order': next_order}
        )
        playlist.refresh_from_db()
        return Response(PlaylistSerializer(playlist, context={'request': request}).data)

    @action(detail=True, methods=['post'])
    def remove_track(self, request, pk=None):
        playlist = self.get_object()
        track_id = request.data.get('track_id')
        PlaylistItem.objects.filter(playlist=playlist, track_id=track_id).delete()
        return Response(PlaylistSerializer(playlist, context={'request': request}).data)


class ListeningHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = ListeningHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ListeningHistory.objects.filter(user=self.request.user).select_related('track', 'track__artist')[:50]


class ReadingProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ReadingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ReadingProgress.objects.filter(user=self.request.user)


class DownloadRecordViewSet(viewsets.ModelViewSet):
    serializer_class = DownloadRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DownloadRecord.objects.filter(user=self.request.user)
