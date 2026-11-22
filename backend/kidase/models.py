from django.db import models
from django.utils.translation import gettext_lazy as _

class KidaseCategory(models.Model):
    name_amharic = models.CharField(_('Amharic Name'), max_length=150)
    name_english = models.CharField(_('English Name'), max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _('Kidase Category (የቅዳሴ ክፍል)')
        verbose_name_plural = _('Kidase Categories (የቅዳሴ ክፍሎች)')
        ordering = ['order', 'id']

    def __str__(self):
        return self.name_amharic


class Anaphora(models.Model):
    category = models.ForeignKey(KidaseCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='anaphoras')
    title_geez = models.CharField(_('Ge\'ez Title (ርእስ በግዕዝ)'), max_length=255)
    title_amharic = models.CharField(_('Amharic Title (ርእስ በአማርኛ)'), max_length=255)
    title_english = models.CharField(_('English Title'), max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True)
    author_father = models.CharField(_('Author / Church Father (ደራሲው አባት)'), max_length=255)
    liturgical_season_used = models.CharField(_('Liturgical Season (የሚቀደስበት ወቅት)'), max_length=255, blank=True)
    historical_background = models.TextField(_('Historical Background (ታሪካዊ አመጣጥ)'), blank=True)
    theological_significance = models.TextField(_('Theological Significance (መንፈሳዊና ምስጢራዊ ትርጓሜ)'), blank=True)
    audio_url = models.URLField(_('Audio Liturgy URL (የድምፅ ቅዳሴ)'), blank=True)
    audio_duration_seconds = models.PositiveIntegerField(_('Audio Duration in Seconds'), default=0)
    cover_image = models.ImageField(upload_to='kidase/covers/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Anaphora / Kidase (አኰቴተ ቍርባን / ቅዳሴ)')
        verbose_name_plural = _('Anaphoras / Kidase (ቅዳሴያት)')
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.title_geez} - {self.title_amharic}"


class LiturgySection(models.Model):
    class LiturgicalRole(models.TextChoices):
        PRIEST = 'PRIEST', _('ካህን (Priest)')
        DEACON = 'DEACON', _('ዲያቆን (Deacon)')
        PEOPLE = 'PEOPLE', _('ሕዝብ (Congregation / People)')
        ASSISTANT_PRIEST = 'ASSISTANT_PRIEST', _('ንፍቅ ካህን (Assistant Priest)')
        SUBDEACON = 'SUBDEACON', _('ንፍቅ ዲያቆን (Subdeacon)')

    anaphora = models.ForeignKey(Anaphora, on_delete=models.CASCADE, related_name='sections')
    section_title = models.CharField(_('Section / Chapter Title'), max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    liturgical_role = models.CharField(_('Liturgical Speaker (የሚጸልየው አካል)'), max_length=30, choices=LiturgicalRole.choices, default=LiturgicalRole.PRIEST)
    text_geez = models.TextField(_('Ge\'ez Liturgical Text (የግዕዝ ጸሎት/ዜማ)'))
    text_amharic = models.TextField(_('Amharic Translation (የአማርኛ ትርጉም)'))
    text_english = models.TextField(_('English Translation'), blank=True)
    audio_timestamp_seconds = models.FloatField(_('Audio Timestamp (Seconds) for sync'), default=0.0)
    explanation = models.TextField(_('Theological & Liturgical Explanation (ምሥጢራዊ ማብራሪያ)'), blank=True)

    class Meta:
        verbose_name = _('Liturgy Section (ክፍለ ቅዳሴ)')
        verbose_name_plural = _('Liturgy Sections (ክፍላተ ቅዳሴ)')
        ordering = ['anaphora', 'order', 'id']

    def __str__(self):
        return f"{self.anaphora.title_amharic} - {self.get_liturgical_role_display()} (#{self.order})"
