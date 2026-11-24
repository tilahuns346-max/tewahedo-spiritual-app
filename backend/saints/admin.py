from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Saint, SynaxariumReading

class SynaxariumReadingInline(admin.StackedInline):
    model = SynaxariumReading
    extra = 1
    fields = ('ethiopian_month', 'ethiopian_day', 'title_amharic', 'content_geez', 'content_amharic', 'salutation_verse_geez')


@admin.register(Saint)
class SaintAdmin(admin.ModelAdmin):
    list_display = ('name_amharic', 'name_geez', 'rank', 'ethiopian_month', 'ethiopian_day', 'monthly_feast_day', 'is_major_feast')
    list_filter = ('rank', 'ethiopian_month', 'is_major_feast')
    search_fields = ('name_geez', 'name_amharic', 'name_english', 'biography_amharic', 'feast_description')
    prepopulated_fields = {'slug': ('name_english',)}
    inlines = [SynaxariumReadingInline]

    fieldsets = (
        (_('የቅዱሱ መረጃ (Saint Details)'), {
            'fields': ('name_geez', 'name_amharic', 'name_english', 'slug', 'rank', 'icon_image')
        }),
        (_('የበዓል ቀንና መታሰቢያ (Feast Day & Commemoration)'), {
            'fields': ('ethiopian_month', 'ethiopian_day', 'monthly_feast_day', 'feast_description', 'is_major_feast')
        }),
        (_('ገድልና ታሪክ (Biography & Struggles)'), {
            'fields': ('biography_amharic', 'biography_english')
        }),
    )


@admin.register(SynaxariumReading)
class SynaxariumReadingAdmin(admin.ModelAdmin):
    list_display = ('title_amharic', 'ethiopian_month', 'ethiopian_day', 'saint')
    list_filter = ('ethiopian_month',)
    search_fields = ('title_amharic', 'content_amharic', 'content_geez')
