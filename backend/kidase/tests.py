from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import KidaseCategory, Anaphora, LiturgySection

class KidaseTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = KidaseCategory.objects.create(
            name_amharic='ዋና ቅዳሴያት',
            name_english='Main Anaphoras',
            slug='main-anaphoras',
            order=1
        )
        self.anaphora = Anaphora.objects.create(
            category=self.category,
            title_geez='ቅዳሴ ሐዋርያት',
            title_amharic='የሐዋርያት ቅዳሴ',
            title_english='Anaphora of the Apostles',
            slug='anaphora-of-the-apostles',
            author_father='ቅዱሳን ሐዋርያት',
            liturgical_season_used='በዘወትርና በሰንበት',
            audio_url='https://example.com/audio/kidase_apostles.mp3',
            audio_duration_seconds=5400,
            is_featured=True,
            order=1
        )
        self.section_priest = LiturgySection.objects.create(
            anaphora=self.anaphora,
            order=1,
            liturgical_role=LiturgySection.LiturgicalRole.PRIEST,
            text_geez='እግዚአብሔር ምስለ ኵልክሙ።',
            text_amharic='እግዚአብሔር ከሁላችሁ ጋር ይሁን።',
            text_english='The Lord be with you all.',
            audio_timestamp_seconds=12.5
        )
        self.section_people = LiturgySection.objects.create(
            anaphora=self.anaphora,
            order=2,
            liturgical_role=LiturgySection.LiturgicalRole.PEOPLE,
            text_geez='ምስለ መንፈስከ።',
            text_amharic='ከመንፈስህ ጋር።',
            text_english='And with your spirit.',
            audio_timestamp_seconds=15.0
        )

    def test_list_anaphoras(self):
        url = reverse('kidase:anaphora-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title_geez'], 'ቅዳሴ ሐዋርያት')

    def test_retrieve_anaphora_with_sections(self):
        url = reverse('kidase:anaphora-detail', kwargs={'pk': self.anaphora.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['sections']), 2)
        self.assertEqual(response.data['sections'][0]['text_geez'], 'እግዚአብሔር ምስለ ኵልክሙ።')

    def test_filter_sections_by_role(self):
        url = reverse('kidase:anaphora-sections', kwargs={'pk': self.anaphora.pk})
        response = self.client.get(url, {'role': 'PRIEST'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['liturgical_role'], 'PRIEST')
