from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class PrayerCategory(models.Model):
    name_amharic = models.CharField(_('Amharic Category Name (የጸሎት ክፍል)'), max_length=150)
    name_english = models.CharField(_('English Category Name'), max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _('Prayer Category (የጸሎት ምድብ)')
        verbose_name_plural = _('Prayer Categories (የጸሎት ምድቦች)')
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.name_amharic} ({self.name_english})"


class PrayerBook(models.Model):
    class OccasionTime(models.TextChoices):
        MORNING = 'MORNING', _('የማለዳ ጸሎት (Morning Prayer)')
        EVENING = 'EVENING', _('የሠርክ ጸሎት (Evening Prayer)')
        NIGHT = 'NIGHT', _('የሌሊት ጸሎት / ሰዓታት (Night Prayer / Hours)')
        ANYTIME = 'ANYTIME', _('የዘወትር ጸሎት (Daily / Anytime Prayer)')

    category = models.ForeignKey(PrayerCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='books')
    title_geez = models.CharField(_('Ge\'ez Title (ርእስ በግዕዝ)'), max_length=255)
    title_amharic = models.CharField(_('Amharic Title (ርእስ በአማርኛ)'), max_length=255)
    title_english = models.CharField(_('English Title'), max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True)
    author = models.CharField(_('Author / Saint (ደራሲው)'), max_length=255, blank=True)
    occasion_time = models.CharField(_('Time of Prayer (የጸሎቱ ወቅት)'), max_length=20, choices=OccasionTime.choices, default=OccasionTime.ANYTIME)
    summary = models.TextField(_('Summary / Introduction (መግቢያና በረከት)'), blank=True)
    audio_url = models.URLField(_('Audio Recitation URL (የድምፅ ጸሎት)'), blank=True)
    audio_duration_seconds = models.PositiveIntegerField(default=0)
    cover_image = models.ImageField(upload_to='prayers/covers/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Prayer Book (የጸሎት መጽሐፍ)')
        verbose_name_plural = _('Prayer Books (የጸሎት መጻሕፍት)')
        ordering = ['order', 'id']

    def __str__(self):
        return self.title_amharic


class PrayerSection(models.Model):
    book = models.ForeignKey(PrayerBook, on_delete=models.CASCADE, related_name='sections')
    section_order = models.PositiveIntegerField(default=0)
    section_title = models.CharField(_('Section Title (የአንቀጹ ርእስ)'), max_length=255, blank=True)
    text_geez = models.TextField(_('Ge\'ez Prayer Text (የግዕዝ ጸሎት)'))
    text_amharic = models.TextField(_('Amharic Prayer Text (የአማርኛ ጸሎት)'))
    text_english = models.TextField(_('English Translation'), blank=True)
    audio_timestamp_seconds = models.FloatField(_('Audio Timestamp (Seconds)'), default=0.0)

    class Meta:
        verbose_name = _('Prayer Section (የጸሎት አንቀጽ)')
        verbose_name_plural = _('Prayer Sections (የጸሎት አንቀጾች)')
        ordering = ['book', 'section_order', 'id']

    def __str__(self):
        return f"{self.book.title_amharic} - #{self.section_order}"


class PrayerFavorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='prayer_favorites')
    book = models.ForeignKey(PrayerBook, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')
        verbose_name = _('Favorite Prayer')
        verbose_name_plural = _('Favorite Prayers')
