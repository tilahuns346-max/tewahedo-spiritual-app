from django.contrib import admin
from .models import Playlist, PlaylistItem, ListeningHistory, ReadingProgress, DownloadRecord

class PlaylistItemInline(admin.TabularInline):
    model = PlaylistItem
    extra = 1


@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'is_public', 'created_at')
    list_filter = ('is_public', 'created_at')
    search_fields = ('title', 'user__email')
    inlines = [PlaylistItemInline]


@admin.register(ListeningHistory)
class ListeningHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'track', 'last_position_seconds', 'is_completed', 'listened_at')
    list_filter = ('is_completed', 'listened_at')
    search_fields = ('user__email', 'track__title_amharic')


@admin.register(ReadingProgress)
class ReadingProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'item_title', 'completion_percentage', 'updated_at')
    list_filter = ('category', 'updated_at')
    search_fields = ('user__email', 'item_title')


@admin.register(DownloadRecord)
class DownloadRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'item_type', 'title', 'file_size_bytes', 'downloaded_at')
    list_filter = ('item_type', 'downloaded_at')
    search_fields = ('user__email', 'title')
