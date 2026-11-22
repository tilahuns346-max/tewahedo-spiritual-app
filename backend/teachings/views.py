from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import TeachingCategory, Lesson, LessonBookmark
from .serializers import (
    TeachingCategorySerializer,
    LessonListSerializer,
    LessonDetailSerializer,
    LessonBookmarkSerializer,
)

class TeachingCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeachingCategory.objects.all().order_by('order', 'id')
    serializer_class = TeachingCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.select_related('category').all().order_by('order', '-created_at')
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'category__slug', 'is_featured']
    search_fields = ['title_amharic', 'title_english', 'summary', 'content_amharic', 'scripture_reference']
    ordering_fields = ['order', 'created_at', 'view_count']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LessonDetailSerializer
        return LessonListSerializer

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_view(self, request, pk=None):
        lesson = self.get_object()
        lesson.view_count += 1
        lesson.save(update_fields=['view_count'])
        return Response({'view_count': lesson.view_count})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_bookmark(self, request, pk=None):
        lesson = self.get_object()
        bookmark = LessonBookmark.objects.filter(user=request.user, lesson=lesson).first()
        if bookmark:
            bookmark.delete()
            return Response({'is_bookmarked': False, 'message': 'Bookmark removed.'})
        else:
            LessonBookmark.objects.create(user=request.user, lesson=lesson)
            return Response({'is_bookmarked': True, 'message': 'Bookmark added.'}, status=status.HTTP_201_CREATED)


class LessonBookmarkListView(generics.ListAPIView):
    serializer_class = LessonBookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LessonBookmark.objects.filter(user=self.request.user).select_related('lesson', 'lesson__category').order_by('-created_at')
