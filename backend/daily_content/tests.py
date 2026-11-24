from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.utils import timezone
import datetime
from .models import DailyVerse, DailyDevotional, FastingSeason
from .ethiopian_calendar import gregorian_to_ethiopian

class DailyContentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.today = timezone.now().date()
        self.verse = DailyVerse.objects.create(
            date=self.today,
            verse_reference='መዝሙር 23:1',
            verse_text_amharic='እግዚአብሔር እረኛዬ ነው የሚያሳጣኝም የለም።',
            verse_text_geez='እግዚአብሔር ይርዕየኒ ወአልቦ ዘየኀጥአኒ።',
            commentary='የዳዊት ምስጋናና የመንፈስ እረፍት'
        )
        self.devotional = DailyDevotional.objects.create(
            date=self.today,
            title_amharic='ስለ ትዕግሥትና እምነት',
            author_saint='ቅዱስ ዮሐንስ አፈወርቅ',
            content_amharic='በፈተና ጊዜ እግዚአብሔርን ማመስገን ታላቅ ክብር ነው።'
        )

    def test_calendar_conversion(self):
        greg_date = datetime.date(2026, 9, 11)
        res = gregorian_to_ethiopian(greg_date)
        self.assertIn('year', res)
        self.assertIn('month', res)
        self.assertIn('day', res)
        self.assertEqual(res['month_name_amharic'], 'መስከረም')

    def test_today_aggregate_view(self):
        url = reverse('daily_content:today-overview')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('ethiopian_calendar', response.data)
        self.assertIn('verse', response.data)
        self.assertEqual(response.data['verse']['verse_reference'], 'መዝሙር 23:1')
        self.assertIn('devotional', response.data)
        self.assertEqual(response.data['devotional']['author_saint'], 'ቅዱስ ዮሐንስ አፈወርቅ')
        self.assertIn('fasting', response.data)

    def test_calendar_api_endpoint(self):
        url = reverse('daily_content:calendar-convert')
        response = self.client.get(url, {'date': '2026-01-07'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('month_name_amharic', response.data)
