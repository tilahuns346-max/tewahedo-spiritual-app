from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class TeachingCategory(models.Model):
    name_amharic = models.CharField(_('Amharic Name (የምድብ ስም)'), max_length=200)
    name_english = models.CharField(_('English Name'), max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(_('Description'), blank=True)
    icon_name = models.CharField(_('Icon Identifier'), max_length=100, default='cross')
    cover_image = models.ImageField(upload_to='teachings/categories/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Teaching Category (የትምህርት ምድብ)')
        verbose_name_plural = _('Teaching Categories (የትምህርት ምድቦች)')
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.name_amharic} ({self.name_english})"


class Lesson(models.Model):
    category = models.ForeignKey(TeachingCategory, on_delete=models.CASCADE, related_name='lessons')
    title_amharic = models.CharField(_('Title (ርእስ)'), max_length=255)
    title_english = models.CharField(_('English Title'), max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True)
    summary = models.TextField(_('Summary / አጭር መግለጫ'))
    content_amharic = models.TextField(_('Full Amharic Teaching (ሙሉ ትምህርት በጽሑፍ)'))
    content_english = models.TextField(_('English Teaching Text'), blank=True)
    scripture_reference = models.CharField(_('Scripture Reference (የመጽሐፍ ቅዱስ ጥቅስ)'), max_length=255, blank=True)
    audio_url = models.URLField(_('Audio Lesson URL (የድምፅ ትምህርት)'), blank=True)
    audio_duration_seconds = models.PositiveIntegerField(_('Audio Duration (Seconds)'), default=0)
    video_url = models.URLField(_('Video Lesson URL (የቪዲዮ ትምህርት)'), blank=True)
    pdf_document = models.FileField(_('Study PDF Document'), upload_to='teachings/pdfs/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='teachings/lessons/', blank=True, null=True)
    is_featured = models.BooleanField(_('Featured on Home'), default=False)
    order = models.PositiveIntegerField(default=0)
    view_count = models.PositiveIntegerField(default=0)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='authored_lessons')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Lesson (ትምህርት)')
        verbose_name_plural = _('Lessons (ትምህርቶች)')
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title_amharic


class LessonBookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lesson_bookmarks')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')
        verbose_name = _('Lesson Bookmark')
        verbose_name_plural = _('Lesson Bookmarks')

    def __str__(self):
        return f"{self.user} - {self.lesson.title_amharic}"
