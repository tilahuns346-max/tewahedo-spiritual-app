from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class AudioCategory(models.Model):
    name_amharic = models.CharField(_('Amharic Name (የድምፅ ምድብ ስም)'), max_length=150)
    name_english = models.CharField(_('English Name'), max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, default='music')
    cover_image = models.ImageField(upload_to='audio/categories/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _('Audio Category (የድምፅ ምድብ)')
        verbose_name_plural = _('Audio Categories (የድምፅ ምድቦች)')
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.name_amharic} ({self.name_english})"


class AudioArtist(models.Model):
    name_amharic = models.CharField(_('Artist/Singer Name in Amharic (የዘማሪ/አንባቢ ስም)'), max_length=200)
    name_english = models.CharField(_('English Name'), max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    choir_group = models.CharField(_('Choir / Sunday School (ሰንበት ት/ቤት / ማኅበር)'), max_length=255, blank=True)
    photo = models.ImageField(upload_to='audio/artists/', blank=True, null=True)
    bio = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _('Audio Artist / Singer (ዘማሪ / ሰንበት ት/ቤት)')
        verbose_name_plural = _('Audio Artists / Singers (ዘማሪያን / አገልጋዮች)')
        ordering = ['order', 'name_amharic']

    def __str__(self):
        return self.name_amharic


class AudioAlbum(models.Model):
    artist = models.ForeignKey(AudioArtist, on_delete=models.CASCADE, related_name='albums', null=True, blank=True)
    title_amharic = models.CharField(_('Album Title in Amharic (የአልበም ስም)'), max_length=200)
    title_english = models.CharField(_('English Title'), max_length=200, blank=True)
    slug = models.SlugField(max_length=200, unique=True)
    cover_image = models.ImageField(upload_to='audio/albums/', blank=True, null=True)
    release_year = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Audio Album (የመዝሙር አልበም)')
        verbose_name_plural = _('Audio Albums (የመዝሙር አልበሞች)')

    def __str__(self):
        return self.title_amharic


class AudioTrack(models.Model):
    category = models.ForeignKey(AudioCategory, on_delete=models.CASCADE, related_name='tracks')
    artist = models.ForeignKey(AudioArtist, on_delete=models.SET_NULL, null=True, blank=True, related_name='tracks')
    album = models.ForeignKey(AudioAlbum, on_delete=models.SET_NULL, null=True, blank=True, related_name='tracks')
    title_amharic = models.CharField(_('Track Title in Amharic (ርእስ በአማርኛ)'), max_length=255)
    title_english = models.CharField(_('Track Title in English'), max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True)
    audio_url = models.URLField(_('Audio Streaming URL (የድምፅ አድራሻ)'))
    duration_seconds = models.PositiveIntegerField(_('Duration in Seconds (ርዝመት በሰከንድ)'), default=0)
    lyrics_geez = models.TextField(_('Ge\'ez Verses / Lyrics (ግዕዝ ስንኞች)'), blank=True)
    lyrics_amharic = models.TextField(_('Amharic Verses / Lyrics (አማርኛ ስንኞች)'), blank=True)
    cover_image = models.ImageField(upload_to='audio/tracks/', blank=True, null=True)
    is_featured = models.BooleanField(_('Featured on Home (ዋና ገጽ ላይ የሚታይ)'), default=False)
    is_trending = models.BooleanField(_('Trending (ተወዳጅ)'), default=False)
    play_count = models.PositiveIntegerField(default=0)
    download_count = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Audio Track (የድምፅ ፋይል / መዝሙር)')
        verbose_name_plural = _('Audio Tracks (የድምፅ ፋይሎች / መዝሙራት)')
        ordering = ['order', '-play_count', '-created_at']

    def __str__(self):
        return self.title_amharic
