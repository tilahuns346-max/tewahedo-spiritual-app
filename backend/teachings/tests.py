from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from .models import TeachingCategory, Lesson, LessonBookmark

class TeachingsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='believer@tewahedo.org',
            password='TestPassword123!',
            full_name='ተክለ ሃይማኖት'
        )
        self.category = TeachingCategory.objects.create(
            name_amharic='ስለ ሥላሴ',
            name_english='About Holy Trinity',
            slug='about-holy-trinity',
            description='የአንድነታቸውና የሦስትነታቸው ምሥጢር',
            order=1
        )
        self.lesson = Lesson.objects.create(
            category=self.category,
            title_amharic='ምሥጢረ ሥላሴ በኦርቶዶክስ ተዋሕዶ',
            title_english='Mystery of the Holy Trinity',
            slug='mystery-of-holy-trinity',
            summary='በአንድነት በሦስትነት የሚመሰገኑ እግዚአብሔር አብ፣ ወልድ፣ መንፈስ ቅዱስ',
            content_amharic='ኦርቶዶክሳዊት ተዋሕዶ ቤተክርስቲያን በስም፣ በአካል፣ በግብር ሦስት፤ በባሕርይ፣ በህልውና፣ በፈቃድ፣ በመለኮት አንድ ብላ ታምናለች።',
            scripture_reference='ማቴ 28:19',
            is_featured=True,
            order=1
        )

    def test_list_categories(self):
        url = reverse('teachings:category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name_amharic'], 'ስለ ሥላሴ')

    def test_list_lessons(self):
        url = reverse('teachings:lesson-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title_amharic'], self.lesson.title_amharic)

    def test_retrieve_lesson_detail(self):
        url = reverse('teachings:lesson-detail', kwargs={'pk': self.lesson.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['scripture_reference'], 'ማቴ 28:19')

    def test_increment_view_count(self):
        url = reverse('teachings:lesson-increment-view', kwargs={'pk': self.lesson.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.lesson.refresh_from_db()
        self.assertEqual(self.lesson.view_count, 1)

    def test_toggle_bookmark(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('teachings:lesson-toggle-bookmark', kwargs={'pk': self.lesson.pk})
        # Add bookmark
        res1 = self.client.post(url)
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res1.data['is_bookmarked'])
        # Remove bookmark
        res2 = self.client.post(url)
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertFalse(res2.data['is_bookmarked'])
