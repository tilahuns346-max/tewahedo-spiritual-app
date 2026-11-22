from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import User

class AccountsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('accounts:register')
        self.login_url = reverse('accounts:token_obtain_pair')
        self.profile_url = reverse('accounts:profile')
        self.user_data = {
            'email': 'orthodox_user@tewahedo.org',
            'full_name': 'ዮሐንስ ገብረ ማርያም',
            'baptismal_name': 'ወልደ ሥላሴ',
            'phone_number': '+251911223344',
            'preferred_language': 'am',
            'theme_preference': 'burgundy_gold',
            'password': 'StrongSpiritualPassword123!',
            'confirm_password': 'StrongSpiritualPassword123!',
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertEqual(response.data['user']['email'], self.user_data['email'])

    def test_user_login(self):
        # Register first
        self.client.post(self.register_url, self.user_data, format='json')
        # Login
        login_data = {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['baptismal_name'], 'ወልደ ሥላሴ')

    def test_user_profile_authenticated(self):
        reg = self.client.post(self.register_url, self.user_data, format='json')
        token = reg.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['full_name'], 'ዮሐንስ ገብረ ማርያም')
