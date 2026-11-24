from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import AudioCategory, AudioArtist, AudioTrack

class AudioTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = AudioCategory.objects.create(
            name_amharic='መዝሙር',
            name_english='Mezmur',
            slug='mezmur',
            order=1
        )
        self.artist = AudioArtist.objects.create(
            name_amharic='ዘማሪ ታደለ ቱፋ',
            name_english='Zemari Tadele Tufa',
            slug='tadele-tufa'
        )
        self.track = AudioTrack.objects.create(
            category=self.category,
            artist=self.artist,
            title_amharic='እግዚአብሔር ይመስገን',
            title_english='Praise the Lord',
            slug='praise-the-lord',
            audio_url='https://example.com/audio/mezmur1.mp3',
            duration_seconds=320,
            lyrics_amharic='እግዚአብሔር ይመስገን ቸርነቱ የበዛልን...',
            is_featured=True
        )

    def test_list_audio_categories(self):
        url = reverse('audio:audio-category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'mezmur')

    def test_list_tracks(self):
        url = reverse('audio:audio-track-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title_amharic'], 'እግዚአብሔር ይመስገን')

    def test_increment_play_counter(self):
        url = reverse('audio:audio-track-increment-play', kwargs={'pk': self.track.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.track.refresh_from_db()
        self.assertEqual(self.track.play_count, 1)

    def test_stream_queue(self):
        url = reverse('audio:audio-track-stream-queue')
        response = self.client.get(url, {'category': 'mezmur'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
