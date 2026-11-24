from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from .models import WudaseDay, WudaseStanza

class WudaseMariamTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='reader@tewahedo.org',
            password='TestPassword123!',
            full_name='ተክለ ማርያም'
        )
        self.monday = WudaseDay.objects.create(
            day_code='monday',
            name_geez='ውዳሴ ዘሰኑይ',
            name_amharic='የሰኑይ ውዳሴ ማርያም',
            name_english='Monday Praise',
            theme_summary='የእመቤታችን ምስጋናና የአዳም ድኅነት',
            audio_url='https://example.com/audio/wudase_monday.mp3',
            audio_duration_seconds=1200,
            order=1
        )
        self.stanza = WudaseStanza.objects.create(
            day=self.monday,
            stanza_number=1,
            text_geez='ፈቀደ እግዚእ ያግዕዞ ለአዳም ኅዙነ ወትኩዘ ልብ...',
            text_amharic='ያዘነና የተከዘ አዳምን ነፃ ያወጣው ዘንድ እግዚአብሔር ወደደ...',
            text_english='The Lord desired to deliver sorrowful and grieving Adam...',
            audio_timestamp_seconds=0.0
        )

    def test_list_wudase_days(self):
        url = reverse('wudase_mariam:wudase-day-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name_geez'], 'ውዳሴ ዘሰኑይ')

    def test_retrieve_by_day_code(self):
        url = reverse('wudase_mariam:wudase-day-detail', kwargs={'day_code': 'monday'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['stanzas']), 1)
        self.assertEqual(response.data['stanzas'][0]['stanza_number'], 1)

    def test_today_endpoint(self):
        url = reverse('wudase_mariam:wudase-day-today')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('stanzas', response.data)
