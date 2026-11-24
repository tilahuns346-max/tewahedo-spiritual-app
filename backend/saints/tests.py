from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Saint, SynaxariumReading

class SaintsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.saint = Saint.objects.create(
            name_geez='አቡነ ተክለ ሃይማኖት',
            name_amharic='አቡነ ተክለ ሃይማኖት',
            name_english='Abba Tekle Haymanot',
            slug='abba-tekle-haymanot',
            rank='righteous',
            ethiopian_month=12,
            ethiopian_day=24,
            monthly_feast_day=24,
            feast_description='ዕረፍታቸው (Repose)',
            biography_amharic='ኢትዮጵያዊው ጻድቅና ሐዋርያዊ አባት አቡነ ተክለ ሃይማኖት...',
            is_major_feast=True
        )
        self.reading = SynaxariumReading.objects.create(
            saint=self.saint,
            ethiopian_month=12,
            ethiopian_day=24,
            title_amharic='ዝክረ ዕረፍቱ ለአቡነ ተክለ ሃይማኖት',
            content_amharic='በዚች ቀን ጻድቁ አባታችን ተክለ ሃይማኖት አረፉ።'
        )

    def test_list_saints(self):
        url = reverse('saints:saint-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['name_amharic'], 'አቡነ ተክለ ሃይማኖት')

    def test_retrieve_saint_detail(self):
        url = reverse('saints:saint-detail', kwargs={'pk': self.saint.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['synaxarium_readings']), 1)
        self.assertEqual(response.data['synaxarium_readings'][0]['title_amharic'], 'ዝክረ ዕረፍቱ ለአቡነ ተክለ ሃይማኖት')

    def test_monthly_feast_filter(self):
        url = reverse('saints:saint-monthly-feasts')
        response = self.client.get(url, {'day': 24})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
