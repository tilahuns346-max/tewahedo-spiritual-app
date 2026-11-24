from rest_framework import serializers
from .models import PrayerCategory, PrayerBook, PrayerSection, PrayerFavorite

class PrayerCategorySerializer(serializers.ModelSerializer):
    book_count = serializers.IntegerField(source='books.count', read_only=True)

    class Meta:
        model = PrayerCategory
        fields = ['id', 'name_amharic', 'name_english', 'slug', 'description', 'order', 'book_count']


class PrayerSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrayerSection
        fields = ['id', 'section_order', 'section_title', 'text_geez', 'text_amharic', 'text_english', 'audio_timestamp_seconds']


class PrayerBookListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_amharic', read_only=True)
    occasion_time_display = serializers.CharField(source='get_occasion_time_display', read_only=True)
    section_count = serializers.IntegerField(source='sections.count', read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = PrayerBook
        fields = [
            'id', 'category', 'category_name', 'title_geez', 'title_amharic',
            'title_english', 'slug', 'author', 'occasion_time', 'occasion_time_display',
            'summary', 'audio_url', 'audio_duration_seconds', 'cover_image',
            'is_featured', 'order', 'section_count', 'is_favorite'
        ]

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False


class PrayerBookDetailSerializer(serializers.ModelSerializer):
    category = PrayerCategorySerializer(read_only=True)
    occasion_time_display = serializers.CharField(source='get_occasion_time_display', read_only=True)
    sections = PrayerSectionSerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = PrayerBook
        fields = [
            'id', 'category', 'title_geez', 'title_amharic', 'title_english',
            'slug', 'author', 'occasion_time', 'occasion_time_display', 'summary',
            'audio_url', 'audio_duration_seconds', 'cover_image', 'is_featured',
            'order', 'sections', 'is_favorite', 'created_at'
        ]

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False


class PrayerFavoriteSerializer(serializers.ModelSerializer):
    book = PrayerBookListSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=PrayerBook.objects.all(), write_only=True, source='book'
    )

    class Meta:
        model = PrayerFavorite
        fields = ['id', 'book', 'book_id', 'created_at']
        read_only_fields = ['id', 'created_at']
