from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from .models import VideoCategory, Video

class VideoTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='viewer@tewahedo.org',
            password='TestPassword123!',
            full_name='ሀብተ ማርያም'
        )
        self.category = VideoCategory.objects.create(
            name_amharic='ትምህርት',
            name_english='Teachings',
            slug='teachings'
        )
        self.video = Video.objects.create(
            category=self.category,
            title_amharic='የተዋሕዶ እምነት መሠረቶች',
            title_english='Foundations of Tewahedo Faith',
            slug='foundations-tewahedo-faith',
            video_url='https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            speaker_teacher='መምህር ዘበነ ለማ',
            is_featured=True
        )

    def test_youtube_id_extraction(self):
        self.assertEqual(self.video.youtube_video_id, 'dQw4w9WgXcQ')
        self.assertIn('dQw4w9WgXcQ', self.video.thumbnail_url)

    def test_list_videos(self):
        url = reverse('videos:video-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title_amharic'], 'የተዋሕዶ እምነት መሠረቶች')

    def test_increment_view(self):
        url = reverse('videos:video-increment-view', kwargs={'pk': self.video.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.video.refresh_from_db()
        self.assertEqual(self.video.view_count, 1)

    def test_toggle_favorite(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('videos:video-toggle-favorite', kwargs={'pk': self.video.pk})
        res1 = self.client.post(url)
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res1.data['is_favorite'])
        res2 = self.client.post(url)
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertFalse(res2.data['is_favorite'])
