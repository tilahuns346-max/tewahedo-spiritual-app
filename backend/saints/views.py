from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Saint, SynaxariumReading
from .serializers import SaintListSerializer, SaintDetailSerializer, SynaxariumReadingSerializer

class SaintViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Saint.objects.prefetch_related('synaxarium_readings').all().order_by('ethiopian_month', 'ethiopian_day', 'name_amharic')
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['ethiopian_month', 'ethiopian_day', 'monthly_feast_day', 'rank', 'is_major_feast']
    search_fields = ['name_geez', 'name_amharic', 'name_english', 'biography_amharic', 'feast_description']
    ordering_fields = ['ethiopian_month', 'ethiopian_day', 'name_amharic']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SaintDetailSerializer
        return SaintListSerializer

    @action(detail=False, methods=['get'])
    def monthly_feasts(self, request):
        day = request.query_params.get('day')
        queryset = self.get_queryset()
        if day:
            queryset = queryset.filter(monthly_feast_day=day)
        serializer = SaintListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class SynaxariumReadingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SynaxariumReading.objects.select_related('saint').all().order_by('ethiopian_month', 'ethiopian_day')
    serializer_class = SynaxariumReadingSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['ethiopian_month', 'ethiopian_day', 'saint']
    search_fields = ['title_amharic', 'content_amharic', 'content_geez']
