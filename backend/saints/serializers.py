from rest_framework import serializers
from .models import Saint, SynaxariumReading

class SynaxariumReadingSerializer(serializers.ModelSerializer):
    month_name = serializers.CharField(source='get_ethiopian_month_display', read_only=True)

    class Meta:
        model = SynaxariumReading
        fields = [
            'id', 'ethiopian_month', 'month_name', 'ethiopian_day',
            'title_amharic', 'content_geez', 'content_amharic', 'salutation_verse_geez'
        ]


class SaintListSerializer(serializers.ModelSerializer):
    rank_display = serializers.CharField(source='get_rank_display', read_only=True)
    month_name = serializers.CharField(source='get_ethiopian_month_display', read_only=True)

    class Meta:
        model = Saint
        fields = [
            'id', 'name_geez', 'name_amharic', 'name_english', 'slug',
            'rank', 'rank_display', 'ethiopian_month', 'month_name',
            'ethiopian_day', 'monthly_feast_day', 'feast_description',
            'icon_image', 'is_major_feast'
        ]


class SaintDetailSerializer(serializers.ModelSerializer):
    rank_display = serializers.CharField(source='get_rank_display', read_only=True)
    month_name = serializers.CharField(source='get_ethiopian_month_display', read_only=True)
    synaxarium_readings = SynaxariumReadingSerializer(many=True, read_only=True)

    class Meta:
        model = Saint
        fields = [
            'id', 'name_geez', 'name_amharic', 'name_english', 'slug',
            'rank', 'rank_display', 'ethiopian_month', 'month_name',
            'ethiopian_day', 'monthly_feast_day', 'feast_description',
            'biography_amharic', 'biography_english', 'icon_image',
            'is_major_feast', 'synaxarium_readings', 'created_at'
        ]
