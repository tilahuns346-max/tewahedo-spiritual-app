from django.db import models
from django.utils.translation import gettext_lazy as _

ETHIOPIAN_MONTHS = [
    (1, 'መስከረም (Meskerem)'),
    (2, 'ጥቅምት (Tikimt)'),
    (3, 'ኅዳር (Hidar)'),
    (4, 'ታኅሣሥ (Tahsas)'),
    (5, 'ጥር (Tir)'),
    (6, 'የካቲት (Yekatit)'),
    (7, 'መጋቢት (Megabit)'),
    (8, 'ሚያዝያ (Miyazya)'),
    (9, 'ግንቦት (Ginbot)'),
    (10, 'ሰኔ (Sene)'),
    (11, 'ሐምሌ (Hamle)'),
    (12, 'ነሐሴ (Nehase)'),
    (13, 'ጳጉሜን (Pagume)'),
]

class Saint(models.Model):
    SAINT_RANKS = [
        ('saint', 'ቅዱስ / ቅድስት (Saint)'),
        ('martyr', 'ሰማዕት (Martyr)'),
        ('righteous', 'ጻድቅ / ጻድቅት (Righteous)'),
        ('apostle', 'ሐዋርያ (Apostle)'),
        ('prophet', 'ነቢይ (Prophet)'),
        ('angel', 'ቅዱስ መልአክ (Holy Angel / Archangel)'),
        ('patriarch', 'ሊቀ ጳጳስ / አበው (Patriarch / Church Father)'),
    ]

    name_geez = models.CharField(_('Name in Ge\'ez (ስም በግዕዝ)'), max_length=200)
    name_amharic = models.CharField(_('Name in Amharic (ስም በአማርኛ)'), max_length=200)
    name_english = models.CharField(_('Name in English'), max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    rank = models.CharField(_('Rank / Title'), max_length=30, choices=SAINT_RANKS, default='saint')
    ethiopian_month = models.PositiveSmallIntegerField(_('Ethiopian Month (የኢትዮጵያ ወር)'), choices=ETHIOPIAN_MONTHS, default=1)
    ethiopian_day = models.PositiveSmallIntegerField(_('Ethiopian Day (ቀን 1-30)'), default=1)
    monthly_feast_day = models.PositiveSmallIntegerField(_('Monthly Commemoration (የወር በዓል ቀን)'), null=True, blank=True)
    feast_description = models.CharField(_('Feast Description (የበዓሉ ምክንያት)'), max_length=255, blank=True)
    biography_amharic = models.TextField(_('Life & Struggle in Amharic (ገድልና ተጋድሎ በአማርኛ)'))
    biography_english = models.TextField(_('Life & Struggle in English'), blank=True)
    icon_image = models.ImageField(upload_to='saints/icons/', blank=True, null=True)
    is_major_feast = models.BooleanField(_('Major Church Feast (ታላቅ የቤተክርስቲያን በዓል)'), default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Saint (ቅዱስ / ቅድስት)')
        verbose_name_plural = _('Saints (ቅዱሳን)')
        ordering = ['ethiopian_month', 'ethiopian_day', 'name_amharic']

    def __str__(self):
        return f"{self.get_rank_display()} {self.name_amharic}"


class SynaxariumReading(models.Model):
    saint = models.ForeignKey(Saint, on_delete=models.SET_NULL, null=True, blank=True, related_name='synaxarium_readings')
    ethiopian_month = models.PositiveSmallIntegerField(_('Month'), choices=ETHIOPIAN_MONTHS, default=1)
    ethiopian_day = models.PositiveSmallIntegerField(_('Day'), default=1)
    title_amharic = models.CharField(_('Synaxarium Title (የስንክሳር ርእስ)'), max_length=255)
    content_geez = models.TextField(_('Ge\'ez Text (የስንክሳሩ ጽሑፍ በግዕዝ)'), blank=True)
    content_amharic = models.TextField(_('Amharic Reading (የዕለቱ ስንክሳር በአማርኛ)'))
    salutation_verse_geez = models.TextField(_('Salutation Hymn / ሰላምታ በግዕዝ'), blank=True)

    class Meta:
        verbose_name = _('Synaxarium Entry (የዕለቱ ስንክሳር)')
        verbose_name_plural = _('Synaxarium Entries (የስንክሳር ምንባባት)')
        ordering = ['ethiopian_month', 'ethiopian_day', 'id']

    def __str__(self):
        return f"{self.get_ethiopian_month_display()} {self.ethiopian_day} - {self.title_amharic}"
