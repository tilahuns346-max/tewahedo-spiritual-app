from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from audio.models import AudioTrack

class Playlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='playlists')
    title = models.CharField(_('Playlist Title (የዝርዝር ስም)'), max_length=200)
    description = models.TextField(_('Description'), blank=True)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Playlist (የተመረጡ መዝሙራት)')
        verbose_name_plural = _('Playlists (የተመረጡ መዝሙራት ዝርዝር)')
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user} - {self.title}"


class PlaylistItem(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='items')
    track = models.ForeignKey(AudioTrack, on_delete=models.CASCADE, related_name='playlist_items')
    order = models.PositiveIntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'added_at']
        unique_together = ('playlist', 'track')

    def __str__(self):
        return f"{self.playlist.title} - {self.track.title_amharic}"


class ListeningHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listening_history')
    track = models.ForeignKey(AudioTrack, on_delete=models.CASCADE, related_name='history_entries')
    last_position_seconds = models.PositiveIntegerField(_('Last Position (Seconds)'), default=0)
    is_completed = models.BooleanField(default=False)
    listened_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-listened_at']
        unique_together = ('user', 'track')
        verbose_name = _('Listening History (የተደመጡ መዝሙራት)')
        verbose_name_plural = _('Listening History (የማዳመጥ ታሪክ)')

    def __str__(self):
        return f"{self.user} listened to {self.track.title_amharic}"


class ReadingProgress(models.Model):
    class ContentCategory(models.TextChoices):
        LESSON = 'LESSON', _('Spiritual Lesson (ትምህርት)')
        PRAYER = 'PRAYER', _('Prayer Book (ጸሎት)')
        WUDASE = 'WUDASE', _('Wudase Mariam (ውዳሴ ማርያም)')
        KIDASE = 'KIDASE', _('Divine Liturgy (ቅዳሴ)')

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reading_progress')
    category = models.CharField(max_length=20, choices=ContentCategory.choices)
    item_id = models.PositiveIntegerField()
    item_title = models.CharField(max_length=255)
    last_position = models.CharField(max_length=100, blank=True)
    completion_percentage = models.FloatField(default=0.0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        unique_together = ('user', 'category', 'item_id')
        verbose_name = _('Reading Progress (የንባብ ደረጃ)')
        verbose_name_plural = _('Reading Progress (የንባብ ደረጃዎች)')


class DownloadRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='downloads')
    item_type = models.CharField(max_length=50) # audio, sermon, pdf, liturgy
    item_id = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    file_size_bytes = models.BigIntegerField(default=0)
    local_path = models.CharField(max_length=500, blank=True)
    downloaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-downloaded_at']
        verbose_name = _('Download Record (የወረዱ ፋይሎች)')
        verbose_name_plural = _('Download Records')
