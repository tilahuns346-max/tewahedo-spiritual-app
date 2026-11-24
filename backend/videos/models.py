import re
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class VideoCategory(models.Model):
    name_amharic = models.CharField(_('Amharic Category Name (የቪዲዮ ምድብ ስም)'), max_length=150)
    name_english = models.CharField(_('English Category Name'), max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _('Video Category (የቪዲዮ ምድብ)')
        verbose_name_plural = _('Video Categories (የቪዲዮ ምድቦች)')
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.name_amharic} ({self.name_english})"


class Video(models.Model):
    category = models.ForeignKey(VideoCategory, on_delete=models.CASCADE, related_name='videos')
    title_amharic = models.CharField(_('Video Title in Amharic (የቪዲዮ ርእስ)'), max_length=255)
    title_english = models.CharField(_('Video Title in English'), max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(_('Description (ዝርዝር ማብራሪያ)'), blank=True)
    video_url = models.URLField(_('Video URL / YouTube Link'))
    youtube_video_id = models.CharField(_('YouTube Video ID'), max_length=50, blank=True)
    duration_seconds = models.PositiveIntegerField(_('Duration in Seconds'), default=0)
    thumbnail = models.ImageField(upload_to='videos/thumbnails/', blank=True, null=True)
    thumbnail_url = models.URLField(blank=True)
    speaker_teacher = models.CharField(_('Speaker / Preacher (አስተማሪ / ሰባኪ)'), max_length=255, blank=True)
    is_featured = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Spiritual Video (መንፈሳዊ ቪዲዮ)')
        verbose_name_plural = _('Spiritual Videos (መንፈሳዊ ቪዲዮዎች)')
        ordering = ['-is_featured', '-created_at']

    def __str__(self):
        return self.title_amharic

    def save(self, *args, **kwargs):
        if self.video_url and not self.youtube_video_id:
            patterns = [
                r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
                r'youtu\.be\/([0-9A-Za-z_-]{11})',
            ]
            for pattern in patterns:
                match = re.search(pattern, self.video_url)
                if match:
                    self.youtube_video_id = match.group(1)
                    if not self.thumbnail_url:
                        self.thumbnail_url = f"https://img.youtube.com/vi/{self.youtube_video_id}/hqdefault.jpg"
                    break
        super().save(*args, **kwargs)


class VideoFavorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='video_favorites')
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'video')
        verbose_name = _('Favorite Video')
        verbose_name_plural = _('Favorite Videos')
