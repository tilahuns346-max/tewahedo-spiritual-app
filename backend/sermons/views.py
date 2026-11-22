from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Preacher, SermonCategory, Sermon, SermonFavorite
from .serializers import (
    PreacherSerializer,
    SermonCategorySerializer,
    SermonListSerializer,
    SermonDetailSerializer,
    SermonFavoriteSerializer,
)

class PreacherViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Preacher.objects.all().order_by('order', 'name_amharic')
    serializer_class = PreacherSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter]
    search_fields = ['name_amharic', 'name_english', 'church_parish']


class SermonCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SermonCategory.objects.all()
    serializer_class = SermonCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class SermonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sermon.objects.select_related('preacher', 'category').all().order_by('-recorded_date', '-created_at')
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['preacher', 'preacher__slug', 'category', 'category__slug', 'is_featured']
    search_fields = [
        'title_amharic', 'title_english', 'description', 'scripture_theme',
        'preacher__name_amharic', 'preacher__name_english', 'location_church'
    ]
    ordering_fields = ['recorded_date', 'play_count', 'download_count', 'created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SermonDetailSerializer
        return SermonListSerializer

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_play(self, request, pk=None):
        sermon = self.get_object()
        sermon.play_count += 1
        sermon.save(update_fields=['play_count'])
        return Response({'play_count': sermon.play_count})

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_download(self, request, pk=None):
        sermon = self.get_object()
        sermon.download_count += 1
        sermon.save(update_fields=['download_count'])
        return Response({'download_count': sermon.download_count})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_favorite(self, request, pk=None):
        sermon = self.get_object()
        fav = SermonFavorite.objects.filter(user=request.user, sermon=sermon).first()
        if fav:
            fav.delete()
            return Response({'is_favorite': False, 'message': 'Removed from favorites.'})
        else:
            SermonFavorite.objects.create(user=request.user, sermon=sermon)
            return Response({'is_favorite': True, 'message': 'Added to favorites.'}, status=status.HTTP_201_CREATED)


class SermonFavoriteListView(generics.ListAPIView):
    serializer_class = SermonFavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SermonFavorite.objects.filter(user=self.request.user).select_related('sermon', 'sermon__preacher').order_by('-created_at')
