from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import VideoCategory, Video, VideoFavorite

@admin.register(VideoCategory)
class VideoCategoryAdmin(admin.ModelAdmin):
    list_display = ('name_amharic', 'name_english', 'slug', 'order', 'get_video_count')
    prepopulated_fields = {'slug': ('name_english',)}
    list_editable = ('order',)

    def get_video_count(self, obj):
        return obj.videos.count()
    get_video_count.short_description = _('የቪዲዮዎች ብዛት')


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title_amharic', 'category', 'speaker_teacher', 'duration_seconds', 'is_featured', 'view_count', 'created_at')
    list_filter = ('category', 'is_featured', 'created_at')
    list_editable = ('is_featured',)
    search_fields = ('title_amharic', 'title_english', 'description', 'speaker_teacher')
    prepopulated_fields = {'slug': ('title_english',)}

    fieldsets = (
        (_('የቪዲዮ መረጃ (Basic Info)'), {
            'fields': ('category', 'title_amharic', 'title_english', 'slug', 'speaker_teacher', 'is_featured')
        }),
        (_('ማብራሪያና ይዘት (Description)'), {
            'fields': ('description',)
        }),
        (_('ሊንክና ምስል (Media & Streaming)'), {
            'fields': ('video_url', 'youtube_video_id', 'duration_seconds', 'thumbnail', 'thumbnail_url')
        }),
        (_('ስታቲስቲክስ (Analytics)'), {
            'fields': ('view_count',)
        }),
    )


@admin.register(VideoFavorite)
class VideoFavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'video', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'video__title_amharic')
