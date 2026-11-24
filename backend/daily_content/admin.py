from django.contrib import admin
from .models import DailyVerse, DailyDevotional, FastingSeason

@admin.register(DailyVerse)
class DailyVerseAdmin(admin.ModelAdmin):
    list_display = ('date', 'verse_reference', 'verse_text_amharic')
    list_filter = ('date',)
    search_fields = ('verse_reference', 'verse_text_amharic', 'verse_text_geez', 'commentary')


@admin.register(DailyDevotional)
class DailyDevotionalAdmin(admin.ModelAdmin):
    list_display = ('date', 'title_amharic', 'author_saint')
    list_filter = ('date',)
    search_fields = ('title_amharic', 'title_english', 'author_saint', 'content_amharic')


@admin.register(FastingSeason)
class FastingSeasonAdmin(admin.ModelAdmin):
    list_display = ('name_amharic', 'name_english', 'season_type', 'duration_days')
    list_filter = ('season_type',)
