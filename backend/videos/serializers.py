from rest_framework import serializers
from .models import VideoCategory, Video, VideoFavorite

class VideoCategorySerializer(serializers.ModelSerializer):
    video_count = serializers.IntegerField(source='videos.count', read_only=True)

    class Meta:
        model = VideoCategory
        fields = ['id', 'name_amharic', 'name_english', 'slug', 'description', 'order', 'video_count']


class VideoListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_amharic', read_only=True)
    is_favorite = serializers.SerializerMethodField()
    display_thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id', 'category', 'category_name', 'title_amharic', 'title_english',
            'slug', 'video_url', 'youtube_video_id', 'duration_seconds',
            'thumbnail', 'thumbnail_url', 'display_thumbnail', 'speaker_teacher',
            'is_featured', 'view_count', 'is_favorite', 'created_at'
        ]

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False

    def get_display_thumbnail(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.thumbnail.url) if request else obj.thumbnail.url
        if obj.thumbnail_url:
            return obj.thumbnail_url
        if obj.youtube_video_id:
            return f"https://img.youtube.com/vi/{obj.youtube_video_id}/hqdefault.jpg"
        return None


class VideoDetailSerializer(serializers.ModelSerializer):
    category = VideoCategorySerializer(read_only=True)
    is_favorite = serializers.SerializerMethodField()
    display_thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id', 'category', 'title_amharic', 'title_english', 'slug',
            'description', 'video_url', 'youtube_video_id', 'duration_seconds',
            'thumbnail', 'thumbnail_url', 'display_thumbnail', 'speaker_teacher',
            'is_featured', 'view_count', 'is_favorite', 'created_at', 'updated_at'
        ]

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False

    def get_display_thumbnail(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.thumbnail.url) if request else obj.thumbnail.url
        if obj.thumbnail_url:
            return obj.thumbnail_url
        if obj.youtube_video_id:
            return f"https://img.youtube.com/vi/{obj.youtube_video_id}/hqdefault.jpg"
        return None


class VideoFavoriteSerializer(serializers.ModelSerializer):
    video = VideoListSerializer(read_only=True)
    video_id = serializers.PrimaryKeyRelatedField(
        queryset=Video.objects.all(), write_only=True, source='video'
    )

    class Meta:
        model = VideoFavorite
        fields = ['id', 'video', 'video_id', 'created_at']
        read_only_fields = ['id', 'created_at']
