from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django.utils import timezone
from .models import WudaseDay, WudaseStanza, WudaseBookmark
from .serializers import (
    WudaseDayListSerializer,
    WudaseDayDetailSerializer,
    WudaseStanzaSerializer,
    WudaseBookmarkSerializer,
)

class WudaseDayViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WudaseDay.objects.prefetch_related('stanzas').all().order_by('order', 'id')
    permission_classes = [permissions.AllowAny]
    pagination_class = None
    lookup_field = 'day_code'

    def get_serializer_class(self):
        if self.action in ['retrieve', 'today']:
            return WudaseDayDetailSerializer
        return WudaseDayListSerializer

    @action(detail=False, methods=['get'])
    def today(self, request):
        # 0: Monday, 1: Tuesday, 2: Wednesday, 3: Thursday, 4: Friday, 5: Saturday, 6: Sunday
        weekday_map = {
            0: 'monday',
            1: 'tuesday',
            2: 'wednesday',
            3: 'thursday',
            4: 'friday',
            5: 'saturday',
            6: 'sunday'
        }
        current_day_code = weekday_map.get(timezone.now().weekday(), 'monday')
        day_obj = WudaseDay.objects.filter(day_code=current_day_code).first()
        if not day_obj:
            day_obj = WudaseDay.objects.first()
        serializer = WudaseDayDetailSerializer(day_obj)
        return Response(serializer.data)


class WudaseStanzaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WudaseStanza.objects.select_related('day').all().order_by('day__order', 'stanza_number')
    serializer_class = WudaseStanzaSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [SearchFilter]
    search_fields = ['text_geez', 'text_amharic', 'text_english', 'spiritual_meaning']


class WudaseBookmarkViewSet(viewsets.ModelViewSet):
    serializer_class = WudaseBookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WudaseBookmark.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
