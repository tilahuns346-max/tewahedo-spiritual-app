from rest_framework import serializers
from .models import Playlist, PlaylistItem, ListeningHistory, ReadingProgress, DownloadRecord
from audio.serializers import AudioTrackListSerializer
from audio.models import AudioTrack

class PlaylistItemSerializer(serializers.ModelSerializer):
    track = AudioTrackListSerializer(read_only=True)
    track_id = serializers.PrimaryKeyRelatedField(
        queryset=AudioTrack.objects.all(), write_only=True, source='track'
    )

    class Meta:
        model = PlaylistItem
        fields = ['id', 'playlist', 'track', 'track_id', 'order', 'added_at']
        read_only_fields = ['id', 'playlist', 'added_at']


class PlaylistSerializer(serializers.ModelSerializer):
    items = PlaylistItemSerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(source='items.count', read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'title', 'description', 'is_public', 'item_count', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        return Playlist.objects.create(user=user, **validated_data)


class ListeningHistorySerializer(serializers.ModelSerializer):
    track = AudioTrackListSerializer(read_only=True)
    track_id = serializers.PrimaryKeyRelatedField(
        queryset=AudioTrack.objects.all(), write_only=True, source='track'
    )

    class Meta:
        model = ListeningHistory
        fields = ['id', 'track', 'track_id', 'last_position_seconds', 'is_completed', 'listened_at']
        read_only_fields = ['id', 'listened_at']

    def create(self, validated_data):
        user = self.context['request'].user
        track = validated_data['track']
        history, created = ListeningHistory.objects.update_or_create(
            user=user,
            track=track,
            defaults={
                'last_position_seconds': validated_data.get('last_position_seconds', 0),
                'is_completed': validated_data.get('is_completed', False),
            }
        )
        return history


class ReadingProgressSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = ReadingProgress
        fields = ['id', 'category', 'category_display', 'item_id', 'item_title', 'last_position', 'completion_percentage', 'updated_at']
        read_only_fields = ['id', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        progress, created = ReadingProgress.objects.update_or_create(
            user=user,
            category=validated_data['category'],
            item_id=validated_data['item_id'],
            defaults={
                'item_title': validated_data.get('item_title', ''),
                'last_position': validated_data.get('last_position', ''),
                'completion_percentage': validated_data.get('completion_percentage', 0.0),
            }
        )
        return progress


class DownloadRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DownloadRecord
        fields = ['id', 'item_type', 'item_id', 'title', 'file_size_bytes', 'local_path', 'downloaded_at']
        read_only_fields = ['id', 'downloaded_at']

    def create(self, validated_data):
        user = self.context['request'].user
        return DownloadRecord.objects.create(user=user, **validated_data)
