from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import PrayerCategory, PrayerBook, PrayerSection, PrayerFavorite

class PrayerSectionInline(admin.StackedInline):
    model = PrayerSection
    extra = 1
    fields = ('section_order', 'section_title', 'text_geez', 'text_amharic', 'text_english', 'audio_timestamp_seconds')


@admin.register(PrayerCategory)
class PrayerCategoryAdmin(admin.ModelAdmin):
    list_display = ('name_amharic', 'name_english', 'slug', 'order', 'get_book_count')
    prepopulated_fields = {'slug': ('name_english',)}
    list_editable = ('order',)

    def get_book_count(self, obj):
        return obj.books.count()
    get_book_count.short_description = _('የመጻሕፍት ብዛት')


@admin.register(PrayerBook)
class PrayerBookAdmin(admin.ModelAdmin):
    list_display = ('title_amharic', 'title_geez', 'category', 'occasion_time', 'author', 'order', 'is_featured')
    list_filter = ('category', 'occasion_time', 'is_featured')
    list_editable = ('order', 'is_featured')
    search_fields = ('title_geez', 'title_amharic', 'title_english', 'author', 'summary')
    prepopulated_fields = {'slug': ('title_english',)}
    inlines = [PrayerSectionInline]

    fieldsets = (
        (_('የመጽሐፍ መረጃ (Basic Info)'), {
            'fields': ('category', 'title_geez', 'title_amharic', 'title_english', 'slug', 'author', 'occasion_time', 'order', 'is_featured')
        }),
        (_('መግቢያና በረከት (Summary & Blessing)'), {
            'fields': ('summary', 'cover_image')
        }),
        (_('የድምፅ ጸሎት (Audio Recitation)'), {
            'fields': ('audio_url', 'audio_duration_seconds')
        }),
    )


@admin.register(PrayerSection)
class PrayerSectionAdmin(admin.ModelAdmin):
    list_display = ('book', 'section_order', 'section_title', 'audio_timestamp_seconds')
    list_filter = ('book',)
    list_editable = ('section_order', 'audio_timestamp_seconds')
    search_fields = ('text_geez', 'text_amharic', 'text_english', 'section_title', 'book__title_amharic')


@admin.register(PrayerFavorite)
class PrayerFavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'book__title_amharic')
