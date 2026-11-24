from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class WudaseDay(models.Model):
    DAY_CODES = [
        ('monday', 'ሰኑይ (Monday)'),
        ('tuesday', 'ሠሉስ (Tuesday)'),
        ('wednesday', 'ረቡዕ (Wednesday)'),
        ('thursday', 'ሐሙስ (Thursday)'),
        ('friday', 'ዓርብ (Friday)'),
        ('saturday', 'ቀዳሚት (Saturday)'),
        ('sunday', 'እሑድ (Sunday)'),
        ('anqetse_berhan', 'አንቀጸ ብርሃን (The Gate of Light)'),
        ('yewedeswa', 'ይዌድስዋ መላእክት (The Angels Praise Her)'),
    ]

    day_code = models.CharField(_('Day Identifier'), max_length=30, choices=DAY_CODES, unique=True)
    name_geez = models.CharField(_('Ge\'ez Name (ስም በግዕዝ)'), max_length=150)
    name_amharic = models.CharField(_('Amharic Name (ስም በአማርኛ)'), max_length=150)
    name_english = models.CharField(_('English Name'), max_length=150)
    theme_summary = models.TextField(_('Theological Theme Summary (መንፈሳዊ ጭብጥ)'), blank=True)
    audio_url = models.URLField(_('Audio Recitation URL (የዜማ ድምፅ)'), blank=True)
    audio_duration_seconds = models.PositiveIntegerField(_('Duration in Seconds'), default=0)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _('Wudase Mariam Day (የውዳሴ ማርያም ዕለት)')
        verbose_name_plural = _('Wudase Mariam Days (የውዳሴ ማርያም ዕለታት)')
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.name_geez} - {self.name_amharic}"


class WudaseStanza(models.Model):
    day = models.ForeignKey(WudaseDay, on_delete=models.CASCADE, related_name='stanzas')
    stanza_number = models.PositiveIntegerField(_('Stanza Number (ቁጥር)'))
    text_geez = models.TextField(_('Ge\'ez Verse (የግዕዝ ጽሑፍ)'))
    text_amharic = models.TextField(_('Amharic Translation (የአማርኛ ትርጉም)'))
    text_english = models.TextField(_('English Translation'), blank=True)
    audio_timestamp_seconds = models.FloatField(_('Audio Sync Timestamp (Seconds)'), default=0.0)
    spiritual_meaning = models.TextField(_('Tergum / Spiritual Commentary (ምሥጢራዊ ትርጓሜ)'), blank=True)

    class Meta:
        verbose_name = _('Wudase Stanza (የውዳሴ አንቀጽ)')
        verbose_name_plural = _('Wudase Stanzas (የውዳሴ አንቀጾች)')
        ordering = ['day', 'stanza_number']
        unique_together = ('day', 'stanza_number')

    def __str__(self):
        return f"{self.day.name_amharic} - አንቀጽ {self.stanza_number}"


class WudaseBookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wudase_bookmarks')
    day = models.ForeignKey(WudaseDay, on_delete=models.CASCADE)
    stanza = models.ForeignKey(WudaseStanza, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Wudase Bookmark')
        verbose_name_plural = _('Wudase Bookmarks')
