from rest_framework import serializers
from .models import WudaseDay, WudaseStanza, WudaseBookmark

class WudaseStanzaSerializer(serializers.ModelSerializer):
    class Meta:
        model = WudaseStanza
        fields = [
            'id', 'stanza_number', 'text_geez', 'text_amharic', 'text_english',
            'audio_timestamp_seconds', 'spiritual_meaning'
        ]


class WudaseDayListSerializer(serializers.ModelSerializer):
    stanza_count = serializers.IntegerField(source='stanzas.count', read_only=True)

    class Meta:
        model = WudaseDay
        fields = [
            'id', 'day_code', 'name_geez', 'name_amharic', 'name_english',
            'theme_summary', 'audio_url', 'audio_duration_seconds', 'order', 'stanza_count'
        ]


class WudaseDayDetailSerializer(serializers.ModelSerializer):
    stanzas = WudaseStanzaSerializer(many=True, read_only=True)

    class Meta:
        model = WudaseDay
        fields = [
            'id', 'day_code', 'name_geez', 'name_amharic', 'name_english',
            'theme_summary', 'audio_url', 'audio_duration_seconds', 'order', 'stanzas'
        ]


class WudaseBookmarkSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='day.name_amharic', read_only=True)

    class Meta:
        model = WudaseBookmark
        fields = ['id', 'day', 'day_name', 'stanza', 'created_at']
        read_only_fields = ['id', 'created_at']
