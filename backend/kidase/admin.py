from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import KidaseCategory, Anaphora, LiturgySection

class LiturgySectionInline(admin.StackedInline):
    model = LiturgySection
    extra = 1
    fields = ('order', 'liturgical_role', 'section_title', 'text_geez', 'text_amharic', 'audio_timestamp_seconds', 'explanation')


@admin.register(KidaseCategory)
class KidaseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name_amharic', 'name_english', 'slug', 'order')
    prepopulated_fields = {'slug': ('name_english',)}
    list_editable = ('order',)


@admin.register(Anaphora)
class AnaphoraAdmin(admin.ModelAdmin):
    list_display = ('title_amharic', 'title_geez', 'author_father', 'liturgical_season_used', 'order', 'is_featured')
    list_filter = ('category', 'is_featured')
    list_editable = ('order', 'is_featured')
    search_fields = ('title_geez', 'title_amharic', 'title_english', 'author_father', 'historical_background')
    prepopulated_fields = {'slug': ('title_english',)}
    inlines = [LiturgySectionInline]

    fieldsets = (
        (_('የቅዳሴው መረጃ (Anaphora Info)'), {
            'fields': ('category', 'title_geez', 'title_amharic', 'title_english', 'slug', 'order', 'is_featured')
        }),
        (_('ደራሲና ወቅት (Author & Liturgical Season)'), {
            'fields': ('author_father', 'liturgical_season_used', 'cover_image')
        }),
        (_('ታሪክና ምሥጢር (Background & Theology)'), {
            'fields': ('historical_background', 'theological_significance')
        }),
        (_('የድምፅ ቅዳሴ (Audio Liturgy)'), {
            'fields': ('audio_url', 'audio_duration_seconds')
        }),
    )


@admin.register(LiturgySection)
class LiturgySectionAdmin(admin.ModelAdmin):
    list_display = ('anaphora', 'order', 'liturgical_role', 'section_title', 'audio_timestamp_seconds')
    list_filter = ('anaphora', 'liturgical_role')
    list_editable = ('order', 'liturgical_role', 'audio_timestamp_seconds')
    search_fields = ('text_geez', 'text_amharic', 'text_english', 'explanation', 'anaphora__title_amharic')
