from rest_framework import serializers
from .models import Preacher, SermonCategory, Sermon, SermonFavorite

class PreacherSerializer(serializers.ModelSerializer):
    sermon_count = serializers.IntegerField(source='sermons.count', read_only=True)
    title_rank_display = serializers.CharField(source='get_title_rank_display', read_only=True)

    class Meta:
        model = Preacher
        fields = [
            'id', 'title_rank', 'title_rank_display', 'name_amharic', 'name_english',
            'slug', 'biography', 'church_parish', 'photo', 'order', 'sermon_count'
        ]


class SermonCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SermonCategory
        fields = ['id', 'name_amharic', 'name_english', 'slug', 'description', 'icon_name']


class SermonListSerializer(serializers.ModelSerializer):
    preacher_name = serializers.CharField(source='preacher.name_amharic', read_only=True)
    preacher_title = serializers.CharField(source='preacher.get_title_rank_display', read_only=True)
    preacher_photo = serializers.ImageField(source='preacher.photo', read_only=True)
    category_name = serializers.CharField(source='category.name_amharic', read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Sermon
        fields = [
            'id', 'preacher', 'preacher_name', 'preacher_title', 'preacher_photo',
            'category', 'category_name', 'title_amharic', 'title_english', 'slug',
            'scripture_theme', 'audio_url', 'audio_duration_seconds',
            'video_url', 'youtube_video_id', 'recorded_date', 'location_church',
            'cover_image', 'is_featured', 'play_count', 'download_count', 'is_favorite'
        ]

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False


class SermonDetailSerializer(serializers.ModelSerializer):
    preacher = PreacherSerializer(read_only=True)
    category = SermonCategorySerializer(read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Sermon
        fields = [
            'id', 'preacher', 'category', 'title_amharic', 'title_english', 'slug',
            'description', 'scripture_theme', 'audio_url', 'audio_duration_seconds',
            'video_url', 'youtube_video_id', 'recorded_date', 'location_church',
            'cover_image', 'is_featured', 'play_count', 'download_count', 'is_favorite',
            'created_at', 'updated_at'
        ]

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False


class SermonFavoriteSerializer(serializers.ModelSerializer):
    sermon = SermonListSerializer(read_only=True)
    sermon_id = serializers.PrimaryKeyRelatedField(
        queryset=Sermon.objects.all(), write_only=True, source='sermon'
    )

    class Meta:
        model = SermonFavorite
        fields = ['id', 'sermon', 'sermon_id', 'created_at']
        read_only_fields = ['id', 'created_at']
