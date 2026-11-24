from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import PrayerCategory, PrayerBook, PrayerSection, PrayerFavorite
from .serializers import (
    PrayerCategorySerializer,
    PrayerBookListSerializer,
    PrayerBookDetailSerializer,
    PrayerSectionSerializer,
    PrayerFavoriteSerializer,
)

class PrayerCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PrayerCategory.objects.all().order_by('order', 'id')
    serializer_class = PrayerCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class PrayerBookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PrayerBook.objects.select_related('category').prefetch_related('sections').all().order_by('order', 'id')
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'category__slug', 'occasion_time', 'is_featured']
    search_fields = ['title_geez', 'title_amharic', 'title_english', 'author', 'summary', 'sections__text_geez', 'sections__text_amharic']
    ordering_fields = ['order', 'created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PrayerBookDetailSerializer
        return PrayerBookListSerializer

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_favorite(self, request, pk=None):
        book = self.get_object()
        fav = PrayerFavorite.objects.filter(user=request.user, book=book).first()
        if fav:
            fav.delete()
            return Response({'is_favorite': False, 'message': 'Removed from favorites.'})
        else:
            PrayerFavorite.objects.create(user=request.user, book=book)
            return Response({'is_favorite': True, 'message': 'Added to favorites.'}, status=status.HTTP_201_CREATED)


class PrayerSectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PrayerSection.objects.select_related('book').all().order_by('book', 'section_order')
    serializer_class = PrayerSectionSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['book']
    search_fields = ['text_geez', 'text_amharic', 'text_english', 'section_title']


class PrayerFavoriteListView(generics.ListAPIView):
    serializer_class = PrayerFavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PrayerFavorite.objects.filter(user=self.request.user).select_related('book', 'book__category').order_by('-created_at')
