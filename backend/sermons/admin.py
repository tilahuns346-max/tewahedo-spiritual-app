from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Preacher, SermonCategory, Sermon, SermonFavorite

@admin.register(Preacher)
class PreacherAdmin(admin.ModelAdmin):
    list_display = ('name_amharic', 'title_rank', 'name_english', 'church_parish', 'get_sermon_count', 'order')
    list_filter = ('title_rank',)
    search_fields = ('name_amharic', 'name_english', 'church_parish', 'biography')
    prepopulated_fields = {'slug': ('name_english',)}
    list_editable = ('order',)

    def get_sermon_count(self, obj):
        return obj.sermons.count()
    get_sermon_count.short_description = _('የስብከቶች ብዛት')


@admin.register(SermonCategory)
class SermonCategoryAdmin(admin.ModelAdmin):
    list_display = ('name_amharic', 'name_english', 'slug')
    prepopulated_fields = {'slug': ('name_english',)}


@admin.register(Sermon)
class SermonAdmin(admin.ModelAdmin):
    list_display = ('title_amharic', 'preacher', 'category', 'recorded_date', 'play_count', 'download_count', 'is_featured')
    list_filter = ('preacher', 'category', 'is_featured', 'recorded_date')
    list_editable = ('is_featured',)
    search_fields = ('title_amharic', 'title_english', 'description', 'scripture_theme', 'preacher__name_amharic')
    prepopulated_fields = {'slug': ('title_english',)}
    fieldsets = (
        (_('የስብከት መረጃ (Sermon Info)'), {
            'fields': ('title_amharic', 'title_english', 'slug', 'preacher', 'category', 'is_featured')
        }),
        (_('መጽሐፍ ቅዱሳዊ ይዘት (Biblical Theme & Synopsis)'), {
            'fields': ('scripture_theme', 'description', 'recorded_date', 'location_church')
        }),
        (_('የድምፅና ቪዲዮ ሚዲያ (Media Streaming)'), {
            'fields': ('audio_url', 'audio_duration_seconds', 'video_url', 'youtube_video_id', 'cover_image')
        }),
        (_('ስታቲስቲክስ (Analytics)'), {
            'fields': ('play_count', 'download_count')
        }),
    )


@admin.register(SermonFavorite)
class SermonFavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'sermon', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'sermon__title_amharic')
