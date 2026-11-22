from rest_framework import serializers
from .models import KidaseCategory, Anaphora, LiturgySection

class KidaseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = KidaseCategory
        fields = ['id', 'name_amharic', 'name_english', 'slug', 'description', 'order']


class LiturgySectionSerializer(serializers.ModelSerializer):
    liturgical_role_display = serializers.CharField(source='get_liturgical_role_display', read_only=True)

    class Meta:
        model = LiturgySection
        fields = [
            'id', 'section_title', 'order', 'liturgical_role', 'liturgical_role_display',
            'text_geez', 'text_amharic', 'text_english', 'audio_timestamp_seconds',
            'explanation'
        ]


class AnaphoraListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_amharic', read_only=True)
    sections_count = serializers.IntegerField(source='sections.count', read_only=True)

    class Meta:
        model = Anaphora
        fields = [
            'id', 'category', 'category_name', 'title_geez', 'title_amharic',
            'title_english', 'slug', 'author_father', 'liturgical_season_used',
            'audio_url', 'audio_duration_seconds', 'cover_image', 'order',
            'is_featured', 'sections_count'
        ]


class AnaphoraDetailSerializer(serializers.ModelSerializer):
    category = KidaseCategorySerializer(read_only=True)
    sections = LiturgySectionSerializer(many=True, read_only=True)

    class Meta:
        model = Anaphora
        fields = [
            'id', 'category', 'title_geez', 'title_amharic', 'title_english',
            'slug', 'author_father', 'liturgical_season_used', 'historical_background',
            'theological_significance', 'audio_url', 'audio_duration_seconds',
            'cover_image', 'order', 'is_featured', 'sections', 'created_at'
        ]
