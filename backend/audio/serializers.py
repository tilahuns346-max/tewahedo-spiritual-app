from rest_framework import serializers
from .models import AudioCategory, AudioArtist, AudioAlbum, AudioTrack

class AudioCategorySerializer(serializers.ModelSerializer):
    track_count = serializers.IntegerField(source='tracks.count', read_only=True)

    class Meta:
        model = AudioCategory
        fields = ['id', 'name_amharic', 'name_english', 'slug', 'description', 'icon_name', 'cover_image', 'order', 'track_count']


class AudioArtistSerializer(serializers.ModelSerializer):
    track_count = serializers.IntegerField(source='tracks.count', read_only=True)

    class Meta:
        model = AudioArtist
        fields = ['id', 'name_amharic', 'name_english', 'slug', 'choir_group', 'photo', 'bio', 'order', 'track_count']


class AudioAlbumSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source='artist.name_amharic', read_only=True)
    track_count = serializers.IntegerField(source='tracks.count', read_only=True)

    class Meta:
        model = AudioAlbum
        fields = ['id', 'artist', 'artist_name', 'title_amharic', 'title_english', 'slug', 'cover_image', 'release_year', 'track_count']


class AudioTrackListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_amharic', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    artist_name = serializers.CharField(source='artist.name_amharic', read_only=True)
    artist_photo = serializers.ImageField(source='artist.photo', read_only=True)

    class Meta:
        model = AudioTrack
        fields = [
            'id', 'category', 'category_name', 'category_slug',
            'artist', 'artist_name', 'artist_photo', 'album',
            'title_amharic', 'title_english', 'slug', 'audio_url',
            'duration_seconds', 'cover_image', 'is_featured', 'is_trending',
            'play_count', 'download_count', 'order', 'created_at'
        ]


class AudioTrackDetailSerializer(serializers.ModelSerializer):
    category = AudioCategorySerializer(read_only=True)
    artist = AudioArtistSerializer(read_only=True)
    album = AudioAlbumSerializer(read_only=True)

    class Meta:
        model = AudioTrack
        fields = [
            'id', 'category', 'artist', 'album', 'title_amharic', 'title_english',
            'slug', 'audio_url', 'duration_seconds', 'lyrics_geez', 'lyrics_amharic',
            'cover_image', 'is_featured', 'is_trending', 'play_count',
            'download_count', 'order', 'created_at'
        ]
