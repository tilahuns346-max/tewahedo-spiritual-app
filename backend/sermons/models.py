from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class Preacher(models.Model):
    TITLE_CHOICES = [
        ('abune', 'ብፁዕ አቡነ (His Grace Archbishop)'),
        ('kesis', 'ቀሲስ (Priest)'),
        ('deacon', 'ዲያቆን (Deacon)'),
        ('memhir', 'መምህር (Teacher / Scholar)'),
        ('liqe_tibebat', 'ሊቀ ጥበባት (Master of Wisdom)'),
        ('dr', 'ዶክተር (Doctor of Divinity)'),
        ('other', 'የቤተክርስቲያን መምህር'),
    ]

    title_rank = models.CharField(_('Title Rank (የማዕረግ ስም)'), max_length=50, choices=TITLE_CHOICES, default='memhir')
    name_amharic = models.CharField(_('Name in Amharic (ስም በግዕዝ/አማርኛ)'), max_length=200)
    name_english = models.CharField(_('Name in English'), max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    biography = models.TextField(_('Biography (የመምህሩ ታሪክ)'), blank=True)
    church_parish = models.CharField(_('Church / Parish (የሚያገለግሉበት ደብር)'), max_length=255, blank=True)
    photo = models.ImageField(upload_to='sermons/preachers/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Preacher (ሰባኪ / መምህር)')
        verbose_name_plural = _('Preachers (ሰባክያን / መምህራን)')
        ordering = ['order', 'name_amharic']

    def __str__(self):
        return f"{self.get_title_rank_display()} {self.name_amharic}"


class SermonCategory(models.Model):
    name_amharic = models.CharField(_('Amharic Name'), max_length=150)
    name_english = models.CharField(_('English Name'), max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, default='mic')

    class Meta:
        verbose_name = _('Sermon Topic Category')
        verbose_name_plural = _('Sermon Topic Categories')

    def __str__(self):
        return self.name_amharic


class Sermon(models.Model):
    preacher = models.ForeignKey(Preacher, on_delete=models.CASCADE, related_name='sermons')
    category = models.ForeignKey(SermonCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='sermons')
    title_amharic = models.CharField(_('Sermon Title in Amharic (የስብከቱ ርእስ)'), max_length=255)
    title_english = models.CharField(_('Sermon Title in English'), max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(_('Sermon Summary / Synopsis (ማብራሪያ)'), blank=True)
    scripture_theme = models.CharField(_('Scripture Reading (መነሻ ጥቅስ)'), max_length=255, blank=True)
    audio_url = models.URLField(_('Audio Streaming URL'), blank=True)
    audio_duration_seconds = models.PositiveIntegerField(_('Audio Duration in Seconds'), default=0)
    video_url = models.URLField(_('Video URL / YouTube Link'), blank=True)
    youtube_video_id = models.CharField(_('YouTube ID'), max_length=50, blank=True)
    recorded_date = models.DateField(_('Recorded Date (የተሰበከበት ቀን)'), null=True, blank=True)
    location_church = models.CharField(_('Place of Sermon (የተሰበከበት ቦታ)'), max_length=255, blank=True)
    cover_image = models.ImageField(upload_to='sermons/covers/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    play_count = models.PositiveIntegerField(default=0)
    download_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Sermon (ስብከት)')
        verbose_name_plural = _('Sermons (ስብከቶች / ስብሐታት)')
        ordering = ['-recorded_date', '-created_at']

    def __str__(self):
        return f"{self.title_amharic} - {self.preacher.name_amharic}"


class SermonFavorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sermon_favorites')
    sermon = models.ForeignKey(Sermon, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'sermon')
        verbose_name = _('Favorite Sermon')
        verbose_name_plural = _('Favorite Sermons')
