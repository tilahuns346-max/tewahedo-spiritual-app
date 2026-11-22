from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import KidaseCategory, Anaphora, LiturgySection
from .serializers import (
    KidaseCategorySerializer,
    AnaphoraListSerializer,
    AnaphoraDetailSerializer,
    LiturgySectionSerializer,
)

class KidaseCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KidaseCategory.objects.all().order_by('order', 'id')
    serializer_class = KidaseCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class AnaphoraViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Anaphora.objects.select_related('category').prefetch_related('sections').all().order_by('order', 'id')
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'category__slug', 'is_featured']
    search_fields = [
        'title_geez', 'title_amharic', 'title_english', 'author_father',
        'liturgical_season_used', 'theological_significance',
        'sections__text_geez', 'sections__text_amharic'
    ]
    ordering_fields = ['order', 'id']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AnaphoraDetailSerializer
        return AnaphoraListSerializer

    @action(detail=True, methods=['get'])
    def sections(self, request, pk=None):
        anaphora = self.get_object()
        role = request.query_params.get('role')
        queryset = anaphora.sections.all().order_by('order', 'id')
        if role:
            queryset = queryset.filter(liturgical_role=role)
        serializer = LiturgySectionSerializer(queryset, many=True)
        return Response(serializer.data)


class LiturgySectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LiturgySection.objects.select_related('anaphora').all().order_by('anaphora', 'order')
    serializer_class = LiturgySectionSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['anaphora', 'liturgical_role']
    search_fields = ['text_geez', 'text_amharic', 'text_english', 'explanation']
