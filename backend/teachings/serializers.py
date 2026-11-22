from rest_framework import serializers
from .models import TeachingCategory, Lesson, LessonBookmark

class TeachingCategorySerializer(serializers.ModelSerializer):
    lesson_count = serializers.IntegerField(source='lessons.count', read_only=True)

    class Meta:
        model = TeachingCategory
        fields = [
            'id', 'name_amharic', 'name_english', 'slug', 'description',
            'icon_name', 'cover_image', 'order', 'lesson_count'
        ]


class LessonListSerializer(serializers.ModelSerializer):
    category_name_amharic = serializers.CharField(source='category.name_amharic', read_only=True)
    category_name_english = serializers.CharField(source='category.name_english', read_only=True)
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id', 'category', 'category_name_amharic', 'category_name_english',
            'title_amharic', 'title_english', 'slug', 'summary',
            'scripture_reference', 'audio_url', 'audio_duration_seconds',
            'video_url', 'cover_image', 'is_featured', 'order', 'view_count',
            'is_bookmarked', 'created_at'
        ]

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(user=request.user).exists()
        return False


class LessonDetailSerializer(serializers.ModelSerializer):
    category = TeachingCategorySerializer(read_only=True)
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id', 'category', 'title_amharic', 'title_english', 'slug',
            'summary', 'content_amharic', 'content_english', 'scripture_reference',
            'audio_url', 'audio_duration_seconds', 'video_url', 'pdf_document',
            'cover_image', 'is_featured', 'view_count', 'is_bookmarked',
            'created_at', 'updated_at'
        ]

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(user=request.user).exists()
        return False


class LessonBookmarkSerializer(serializers.ModelSerializer):
    lesson = LessonListSerializer(read_only=True)
    lesson_id = serializers.PrimaryKeyRelatedField(
        queryset=Lesson.objects.all(), write_only=True, source='lesson'
    )

    class Meta:
        model = LessonBookmark
        fields = ['id', 'lesson', 'lesson_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        bookmark, created = LessonBookmark.objects.get_or_create(
            user=user, lesson=validated_data['lesson']
        )
        return bookmark
