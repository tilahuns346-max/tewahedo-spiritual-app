from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .ethiopian_calendar import gregorian_to_ethiopian

class DailyVerse(models.Model):
    date = models.DateField(_('Date (ቀን)'), default=timezone.now, unique=True)
    verse_reference = models.CharField(_('Verse Reference (የጥቅሱ መገኛ)'), max_length=150)
    verse_text_amharic = models.TextField(_('Verse in Amharic (የዕለቱ ጥቅስ በአማርኛ)'))
    verse_text_geez = models.TextField(_('Verse in Ge\'ez (ጥቅስ በግዕዝ)'), blank=True)
    commentary = models.TextField(_('Orthodox Commentary (የአንድምታ ትርጓሜ)'), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Daily Bible Verse (የዕለቱ የመጽሐፍ ቅዱስ ጥቅስ)')
        verbose_name_plural = _('Daily Bible Verses (የዕለቱ ጥቅሶች)')
        ordering = ['-date']

    def __str__(self):
        return f"{self.date} - {self.verse_reference}"


class DailyDevotional(models.Model):
    date = models.DateField(_('Date (ቀን)'), default=timezone.now, unique=True)
    title_amharic = models.CharField(_('Title (ርእስ)'), max_length=255)
    title_english = models.CharField(_('English Title'), max_length=255, blank=True)
    author_saint = models.CharField(_('Church Father / Author (የተናገረው አባት)'), max_length=200, default='የቤተክርስቲያን አባቶች')
    content_amharic = models.TextField(_('Spiritual Reflection (የዕለቱ መንፈሳዊ ትምህርት / ምክረ አበው)'))
    audio_url = models.URLField(_('Audio Narration URL'), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Daily Devotional (የዕለቱ መንፈሳዊ መልእክት)')
        verbose_name_plural = _('Daily Devotionals (የዕለቱ መንፈሳዊ መልእክታት)')
        ordering = ['-date']

    def __str__(self):
        return f"{self.date} - {self.title_amharic}"


class FastingSeason(models.Model):
    SEASON_CHOICES = [
        ('lent', 'ዐቢይ ጾም (Great Lent / Hudadi)'),
        ('filseta', 'ጾመ ፍልሰታ (Assumption of St. Mary)'),
        ('nebiyat', 'ጾመ ነቢያት (Advent / Fast of the Prophets)'),
        ('hawaryat', 'ጾመ ሐዋርያት (Fast of the Apostles)'),
        ('nineveh', 'ጾመ ነነዌ (Fast of Nineveh)'),
        ('gehad', 'ጾመ ጋድ (Gehad / Eve Fast)'),
        ('wed_fri', 'ጾመ ድኅነት - ረቡዕና ዓርብ (Wed & Fri Fast)'),
    ]

    name_amharic = models.CharField(_('Fasting Season Name (የጾሙ ስም)'), max_length=150)
    name_english = models.CharField(_('English Name'), max_length=150)
    season_type = models.CharField(max_length=30, choices=SEASON_CHOICES, unique=True)
    duration_days = models.PositiveIntegerField(_('Number of Days (የቀናት ብዛት)'), default=1)
    spiritual_meaning = models.TextField(_('Spiritual Meaning & Canonical Rule (ሥርዓተ ጾም)'))
    start_ethiopian_month = models.PositiveSmallIntegerField(null=True, blank=True)
    start_ethiopian_day = models.PositiveSmallIntegerField(null=True, blank=True)
    end_ethiopian_month = models.PositiveSmallIntegerField(null=True, blank=True)
    end_ethiopian_day = models.PositiveSmallIntegerField(null=True, blank=True)

    class Meta:
        verbose_name = _('Fasting Season (የአጽዋማት ሥርዓት)')
        verbose_name_plural = _('Fasting Seasons (አጽዋማት)')

    def __str__(self):
        return self.name_amharic
