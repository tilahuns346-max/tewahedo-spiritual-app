from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import WudaseDay, WudaseStanza, WudaseBookmark

class WudaseStanzaInline(admin.StackedInline):
    model = WudaseStanza
    extra = 1
    fields = ('stanza_number', 'text_geez', 'text_amharic', 'text_english', 'audio_timestamp_seconds', 'spiritual_meaning')


@admin.register(WudaseDay)
class WudaseDayAdmin(admin.ModelAdmin):
    list_display = ('name_amharic', 'name_geez', 'day_code', 'order', 'get_stanza_count')
    list_editable = ('order',)
    search_fields = ('name_geez', 'name_amharic', 'name_english', 'theme_summary')
    inlines = [WudaseStanzaInline]

    def get_stanza_count(self, obj):
        return obj.stanzas.count()
    get_stanza_count.short_description = _('የአንቀጾች ብዛት')


@admin.register(WudaseStanza)
class WudaseStanzaAdmin(admin.ModelAdmin):
    list_display = ('day', 'stanza_number', 'audio_timestamp_seconds')
    list_filter = ('day',)
    list_editable = ('audio_timestamp_seconds',)
    search_fields = ('text_geez', 'text_amharic', 'text_english', 'spiritual_meaning')


@admin.register(WudaseBookmark)
class WudaseBookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'day', 'stanza', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'day__name_amharic')
