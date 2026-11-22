from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from .models import Preacher, Sermon, SermonFavorite

class SermonsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='deacon@tewahedo.org',
            password='TestPassword123!',
            full_name='ዲያቆን ሄኖክ'
        )
        self.preacher = Preacher.objects.create(
            title_rank='memhir',
            name_amharic='ምሕረትአብ አሰፋ',
            name_english='Mehreteab Assefa',
            slug='mehreteab-assefa',
            church_parish='ደብረ ሲና'
        )
        self.sermon = Sermon.objects.create(
            preacher=self.preacher,
            title_amharic='የመስቀሉ ኃይልና ክብር',
            title_english='Power and Glory of the Cross',
            slug='power-glory-of-cross',
            scripture_theme='1ኛ ቆሮ 1:18',
            audio_url='https://example.com/audio/cross.mp3',
            audio_duration_seconds=3600,
            is_featured=True
        )

    def test_list_preachers(self):
        url = reverse('sermons:preacher-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['name_amharic'], 'ምሕረትአብ አሰፋ')

    def test_list_sermons(self):
        url = reverse('sermons:sermon-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title_amharic'], self.sermon.title_amharic)

    def test_increment_play(self):
        url = reverse('sermons:sermon-increment-play', kwargs={'pk': self.sermon.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.sermon.refresh_from_db()
        self.assertEqual(self.sermon.play_count, 1)

    def test_toggle_favorite(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('sermons:sermon-toggle-favorite', kwargs={'pk': self.sermon.pk})
        res1 = self.client.post(url)
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res1.data['is_favorite'])
        res2 = self.client.post(url)
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertFalse(res2.data['is_favorite'])
