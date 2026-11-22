from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import TeachingCategory, Lesson, LessonBookmark

@admin.register(TeachingCategory)
class TeachingCategoryAdmin(admin.ModelAdmin):
    list_display = ('name_amharic', 'name_english', 'slug', 'order', 'get_lesson_count')
    list_editable = ('order',)
    prepopulated_fields = {'slug': ('name_english',)}
    search_fields = ('name_amharic', 'name_english', 'description')

    def get_lesson_count(self, obj):
        return obj.lessons.count()
    get_lesson_count.short_description = _('የትምህርቶች ብዛት (Lessons Count)')


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title_amharic', 'category', 'is_featured', 'view_count', 'order', 'created_at')
    list_filter = ('category', 'is_featured', 'created_at')
    list_editable = ('is_featured', 'order')
    search_fields = ('title_amharic', 'title_english', 'summary', 'content_amharic', 'scripture_reference')
    prepopulated_fields = {'slug': ('title_english',)}
    fieldsets = (
        (_('መሠረታዊ መረጃ (Basic Info)'), {
            'fields': ('category', 'title_amharic', 'title_english', 'slug', 'order', 'is_featured')
        }),
        (_('የይዘት ጽሑፍ (Teaching Content)'), {
            'fields': ('summary', 'content_amharic', 'content_english', 'scripture_reference')
        }),
        (_('ሚዲያና ሰነዶች (Media & Attachments)'), {
            'fields': ('audio_url', 'audio_duration_seconds', 'video_url', 'pdf_document', 'cover_image')
        }),
        (_('ስታቲስቲክስና ደራሲ (Metadata)'), {
            'fields': ('author', 'view_count')
        }),
    )


@admin.register(LessonBookmark)
class LessonBookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'lesson__title_amharic')
