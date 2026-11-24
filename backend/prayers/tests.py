from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from .models import PrayerCategory, PrayerBook, PrayerSection

class PrayersTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='pray@tewahedo.org',
            password='TestPassword123!',
            full_name='ወለተ ማርያም'
        )
        self.category = PrayerCategory.objects.create(
            name_amharic='የዘወትር ጸሎታት',
            name_english='Daily Prayers',
            slug='daily-prayers'
        )
        self.book = PrayerBook.objects.create(
            category=self.category,
            title_geez='ጸሎተ ዘወትር',
            title_amharic='የዘወትር ጸሎት',
            title_english='Daily Common Prayer',
            slug='daily-common-prayer',
            occasion_time=PrayerBook.OccasionTime.ANYTIME,
            is_featured=True
        )
        self.section = PrayerSection.objects.create(
            book=self.book,
            section_order=1,
            section_title='በስመ አብ',
            text_geez='በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።',
            text_amharic='አንድ አምላክ በሚሆን በአብ በወልድ በመንፈስ ቅዱስ ስም አሜን።',
            text_english='In the name of the Father, and of the Son, and of the Holy Spirit, one God. Amen.'
        )

    def test_list_prayer_books(self):
        url = reverse('prayers:prayer-book-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title_amharic'], 'የዘወትር ጸሎት')

    def test_retrieve_prayer_book_detail(self):
        url = reverse('prayers:prayer-book-detail', kwargs={'pk': self.book.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['sections']), 1)
        self.assertEqual(response.data['sections'][0]['text_geez'], 'በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።')

    def test_toggle_favorite_prayer(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('prayers:prayer-book-toggle-favorite', kwargs={'pk': self.book.pk})
        res1 = self.client.post(url)
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res1.data['is_favorite'])
        res2 = self.client.post(url)
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertFalse(res2.data['is_favorite'])
