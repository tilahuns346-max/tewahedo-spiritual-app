from rest_framework import serializers
from .models import DailyVerse, DailyDevotional, FastingSeason

class DailyVerseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyVerse
        fields = ['id', 'date', 'verse_reference', 'verse_text_amharic', 'verse_text_geez', 'commentary']


class DailyDevotionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyDevotional
        fields = ['id', 'date', 'title_amharic', 'title_english', 'author_saint', 'content_amharic', 'audio_url']


class FastingSeasonSerializer(serializers.ModelSerializer):
    season_type_display = serializers.CharField(source='get_season_type_display', read_only=True)

    class Meta:
        model = FastingSeason
        fields = [
            'id', 'name_amharic', 'name_english', 'season_type', 'season_type_display',
            'duration_days', 'spiritual_meaning', 'start_ethiopian_month',
            'start_ethiopian_day', 'end_ethiopian_month', 'end_ethiopian_day'
        ]
