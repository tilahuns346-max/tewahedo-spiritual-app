from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import AudioCategory, AudioArtist, AudioAlbum, AudioTrack

@admin.register(AudioCategory)
class AudioCategoryAdmin(admin.ModelAdmin):
    list_display = ('name_amharic', 'name_english', 'slug', 'order', 'get_track_count')
    prepopulated_fields = {'slug': ('name_english',)}
    list_editable = ('order',)

    def get_track_count(self, obj):
        return obj.tracks.count()
    get_track_count.short_description = _('የፋይሎች ብዛት')


@admin.register(AudioArtist)
class AudioArtistAdmin(admin.ModelAdmin):
    list_display = ('name_amharic', 'name_english', 'choir_group', 'order', 'get_track_count')
    prepopulated_fields = {'slug': ('name_english',)}
    search_fields = ('name_amharic', 'name_english', 'choir_group', 'bio')
    list_editable = ('order',)

    def get_track_count(self, obj):
        return obj.tracks.count()
    get_track_count.short_description = _('የመዝሙራት ብዛት')


@admin.register(AudioAlbum)
class AudioAlbumAdmin(admin.ModelAdmin):
    list_display = ('title_amharic', 'artist', 'release_year')
    prepopulated_fields = {'slug': ('title_amharic',)}
    search_fields = ('title_amharic', 'title_english', 'artist__name_amharic')


@admin.register(AudioTrack)
class AudioTrackAdmin(admin.ModelAdmin):
    list_display = ('title_amharic', 'category', 'artist', 'duration_seconds', 'is_featured', 'is_trending', 'play_count', 'download_count')
    list_filter = ('category', 'is_featured', 'is_trending', 'created_at')
    list_editable = ('is_featured', 'is_trending')
    search_fields = ('title_amharic', 'title_english', 'lyrics_amharic', 'lyrics_geez', 'artist__name_amharic')
    prepopulated_fields = {'slug': ('title_english',)}

    fieldsets = (
        (_('መሠረታዊ መረጃ (Track Information)'), {
            'fields': ('category', 'artist', 'album', 'title_amharic', 'title_english', 'slug', 'order')
        }),
        (_('የድምፅ ፋይልና ርዝመት (Media & Audio File)'), {
            'fields': ('audio_url', 'duration_seconds', 'cover_image')
        }),
        (_('የስንኞች ጽሑፍ (Lyrics & Verses)'), {
            'fields': ('lyrics_geez', 'lyrics_amharic')
        }),
        (_('ተወዳጅነትና ስታቲስቲክስ (Flags & Counters)'), {
            'fields': ('is_featured', 'is_trending', 'play_count', 'download_count')
        }),
    )
