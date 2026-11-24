import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// In Android emulator localhost is 10.0.2.2, for web and ios simulator localhost is 127.0.0.1
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `${DEFAULT_HOST}/api/v1`;

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@tewahedo_access_token');
    } catch {
      return null;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
      } catch {}
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  }

  // Auth Endpoints
  async register(data: any) {
    return this.request('/auth/register/', { method: 'POST', body: JSON.stringify(data) });
  }

  async login(credentials: { email: string; password: string }) {
    const res: any = await this.request('/auth/login/', { method: 'POST', body: JSON.stringify(credentials) });
    if (res.tokens?.access) {
      await AsyncStorage.setItem('@tewahedo_access_token', res.tokens.access);
      await AsyncStorage.setItem('@tewahedo_refresh_token', res.tokens.refresh);
      await AsyncStorage.setItem('@tewahedo_user', JSON.stringify(res.user));
    }
    return res;
  }

  async logout() {
    try {
      const refresh = await AsyncStorage.getItem('@tewahedo_refresh_token');
      if (refresh) {
        await this.request('/auth/logout/', { method: 'POST', body: JSON.stringify({ refresh }) });
      }
    } catch {}
    await AsyncStorage.removeItem('@tewahedo_access_token');
    await AsyncStorage.removeItem('@tewahedo_refresh_token');
    await AsyncStorage.removeItem('@tewahedo_user');
  }

  async getProfile() {
    return this.request('/auth/profile/');
  }

  // Daily Dashboard
  async getTodayOverview() {
    return this.request<any>('/daily/today/');
  }

  async getCalendar(date?: string) {
    const query = date ? `?date=${date}` : '';
    return this.request<any>(`/daily/calendar/${query}`);
  }

  // Teachings
  async getTeachingCategories() {
    return this.request<any[]>('/teachings/categories/');
  }

  async getLessons(params?: { category?: string; search?: string; is_featured?: boolean }) {
    const q = new URLSearchParams();
    if (params?.category) q.append('category__slug', params.category);
    if (params?.search) q.append('search', params.search);
    if (params?.is_featured !== undefined) q.append('is_featured', String(params.is_featured));
    return this.request<any>(`/teachings/lessons/?${q.toString()}`);
  }

  async getLessonDetail(id: number) {
    return this.request<any>(`/teachings/lessons/${id}/`);
  }

  async toggleLessonBookmark(id: number) {
    return this.request<any>(`/teachings/lessons/${id}/toggle_bookmark/`, { method: 'POST' });
  }

  // Sermons
  async getSermons(params?: { preacher?: number; category?: string; search?: string }) {
    const q = new URLSearchParams();
    if (params?.preacher) q.append('preacher', String(params.preacher));
    if (params?.category) q.append('category__slug', params.category);
    if (params?.search) q.append('search', params.search);
    return this.request<any>(`/sermons/sermons/?${q.toString()}`);
  }

  async getPreachers() {
    return this.request<any>('/sermons/preachers/');
  }

  async getSermonDetail(id: number) {
    return this.request<any>(`/sermons/sermons/${id}/`);
  }

  async toggleSermonFavorite(id: number) {
    return this.request<any>(`/sermons/sermons/${id}/toggle_favorite/`, { method: 'POST' });
  }

  // Kidase
  async getAnaphoras() {
    return this.request<any>('/kidase/anaphoras/');
  }

  async getAnaphoraDetail(id: number) {
    return this.request<any>(`/kidase/anaphoras/${id}/`);
  }

  async getAnaphoraSections(id: number, role?: string) {
    const q = role ? `?role=${role}` : '';
    return this.request<any[]>(`/kidase/anaphoras/${id}/sections/${q}`);
  }

  // Wudase Mariam
  async getWudaseDays() {
    return this.request<any[]>('/wudase/days/');
  }

  async getWudaseDayDetail(dayCode: string) {
    return this.request<any>(`/wudase/days/${dayCode}/`);
  }

  async getTodayWudase() {
    return this.request<any>('/wudase/days/today/');
  }

  // Audio Streaming
  async getAudioCategories() {
    return this.request<any[]>('/audio/categories/');
  }

  async getAudioTracks(params?: { category?: string; search?: string; is_featured?: boolean }) {
    const q = new URLSearchParams();
    if (params?.category) q.append('category__slug', params.category);
    if (params?.search) q.append('search', params.search);
    if (params?.is_featured !== undefined) q.append('is_featured', String(params.is_featured));
    return this.request<any>(`/audio/tracks/?${q.toString()}`);
  }

  async getStreamQueue(categorySlug?: string) {
    const q = categorySlug ? `?category=${categorySlug}` : '';
    return this.request<any[]>(`/audio/tracks/stream_queue/${q}`);
  }

  async incrementPlayCount(trackId: number) {
    return this.request<any>(`/audio/tracks/${trackId}/increment_play/`, { method: 'POST' });
  }

  // Videos
  async getVideos(params?: { category?: string; search?: string }) {
    const q = new URLSearchParams();
    if (params?.category) q.append('category__slug', params.category);
    if (params?.search) q.append('search', params.search);
    return this.request<any>(`/videos/?${q.toString()}`);
  }

  async getVideoDetail(id: number) {
    return this.request<any>(`/videos/${id}/`);
  }

  // Prayers
  async getPrayerBooks(params?: { occasion?: string; search?: string }) {
    const q = new URLSearchParams();
    if (params?.occasion) q.append('occasion_time', params.occasion);
    if (params?.search) q.append('search', params.search);
    return this.request<any>(`/prayers/books/?${q.toString()}`);
  }

  async getPrayerBookDetail(id: number) {
    return this.request<any>(`/prayers/books/${id}/`);
  }

  // Saints & Synaxarium
  async getSaints(params?: { month?: number; day?: number; search?: string }) {
    const q = new URLSearchParams();
    if (params?.month) q.append('ethiopian_month', String(params.month));
    if (params?.day) q.append('ethiopian_day', String(params.day));
    if (params?.search) q.append('search', params.search);
    return this.request<any>(`/saints/?${q.toString()}`);
  }

  async getSaintDetail(id: number) {
    return this.request<any>(`/saints/${id}/`);
  }

  // Activity & Playlists
  async getPlaylists() {
    return this.request<any>('/activity/playlists/');
  }

  async createPlaylist(title: string, description?: string) {
    return this.request<any>('/activity/playlists/', {
      method: 'POST',
      body: JSON.stringify({ title, description, is_public: false }),
    });
  }

  async addTrackToPlaylist(playlistId: number, trackId: number) {
    return this.request<any>(`/activity/playlists/${playlistId}/add_track/`, {
      method: 'POST',
      body: JSON.stringify({ track_id: trackId }),
    });
  }

  async saveListeningHistory(trackId: number, positionSeconds: number, isCompleted: boolean = false) {
    return this.request<any>('/activity/history/', {
      method: 'POST',
      body: JSON.stringify({ track_id: trackId, last_position_seconds: positionSeconds, is_completed: isCompleted }),
    });
  }

  async saveReadingProgress(category: string, itemId: number, title: string, position: string, percent: number) {
    return this.request<any>('/activity/reading-progress/', {
      method: 'POST',
      body: JSON.stringify({
        category,
        item_id: itemId,
        item_title: title,
        last_position: position,
        completion_percentage: percent,
      }),
    });
  }
}

export const api = new ApiService();
export default api;
