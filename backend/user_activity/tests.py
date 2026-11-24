from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from audio.models import AudioCategory, AudioTrack
from .models import Playlist, ListeningHistory, ReadingProgress

class UserActivityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='believer_activity@tewahedo.org',
            password='TestPassword123!',
            full_name='ገብረ ማርያም'
        )
        self.category = AudioCategory.objects.create(name_amharic='መዝሙር', slug='mezmur')
        self.track = AudioTrack.objects.create(
            category=self.category,
            title_amharic='ማርያም ድንግል',
            title_english='Virgin Mary',
            slug='virgin-mary',
            audio_url='https://example.com/audio/maryam.mp3',
            duration_seconds=240
        )
        self.client.force_authenticate(user=self.user)

    def test_create_playlist_and_add_track(self):
        # Create playlist
        url = reverse('user_activity:playlist-list')
        response = self.client.post(url, {'title': 'የእመቤታችን መዝሙራት', 'is_public': True})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        playlist_id = response.data['id']

        # Add track to playlist
        add_url = reverse('user_activity:playlist-add-track', kwargs={'pk': playlist_id})
        add_res = self.client.post(add_url, {'track_id': self.track.id})
        self.assertEqual(add_res.status_code, status.HTTP_200_OK)
        self.assertEqual(add_res.data['item_count'], 1)

    def test_listening_history_save(self):
        url = reverse('user_activity:history-list')
        response = self.client.post(url, {
            'track_id': self.track.id,
            'last_position_seconds': 120,
            'is_completed': False
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['last_position_seconds'], 120)

    def test_reading_progress_save(self):
        url = reverse('user_activity:reading-progress-list')
        response = self.client.post(url, {
            'category': 'WUDASE',
            'item_id': 1,
            'item_title': 'የሰኑይ ውዳሴ ማርያም',
            'last_position': 'አንቀጽ 3',
            'completion_percentage': 45.0
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['completion_percentage'], 45.0)
