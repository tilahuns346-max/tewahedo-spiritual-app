from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
import datetime
from .models import DailyVerse, DailyDevotional, FastingSeason
from .serializers import DailyVerseSerializer, DailyDevotionalSerializer, FastingSeasonSerializer
from .ethiopian_calendar import gregorian_to_ethiopian
from saints.models import Saint
from saints.serializers import SaintListSerializer

class TodayAggregateView(APIView):
    """
    Returns full daily spiritual dashboard payload:
    - Ethiopian Calendar conversion for today
    - Today's Saint (የዕለቱ ቅዱስ)
    - Today's Bible Verse (የዕለቱ የመጽሐፍ ቅዱስ ጥቅስ)
    - Daily Devotional Message (ምክረ አበው)
    - Fasting Day Status (የጾም ቀን መሆን አለመሆኑ)
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        today_greg = timezone.now().date()
        eth_info = gregorian_to_ethiopian(today_greg)

        # Today's Verse
        verse = DailyVerse.objects.filter(date=today_greg).first()
        if not verse:
            verse = DailyVerse.objects.order_by('-date').first()

        # Today's Devotional
        devotional = DailyDevotional.objects.filter(date=today_greg).first()
        if not devotional:
            devotional = DailyDevotional.objects.order_by('-date').first()

        # Today's Saints (by Ethiopian Month & Day, or monthly feast)
        saints = Saint.objects.filter(
            ethiopian_month=eth_info['month'],
            ethiopian_day=eth_info['day']
        )
        if not saints.exists():
            saints = Saint.objects.filter(monthly_feast_day=eth_info['day'])
        if not saints.exists():
            saints = Saint.objects.filter(is_major_feast=True)[:3]

        # Check if fasting day (Wednesday=2, Friday=4 in Python weekday 0-6)
        is_wed_or_fri = today_greg.weekday() in (2, 4)
        fasting_info = {
            'is_fasting_day': is_wed_or_fri,
            'fast_name': 'ጾመ ድኅነት (ረቡዕና ዓርብ)' if is_wed_or_fri else 'የማይጾምበት ዕለት',
            'season': None
        }

        # Check Active Fasting Season
        active_season = FastingSeason.objects.filter(
            start_ethiopian_month__lte=eth_info['month'],
            end_ethiopian_month__gte=eth_info['month']
        ).first()
        if active_season:
            fasting_info['is_fasting_day'] = True
            fasting_info['fast_name'] = active_season.name_amharic
            fasting_info['season'] = FastingSeasonSerializer(active_season).data

        return Response({
            'gregorian_date': today_greg.isoformat(),
            'ethiopian_calendar': eth_info,
            'verse': DailyVerseSerializer(verse).data if verse else None,
            'devotional': DailyDevotionalSerializer(devotional).data if devotional else None,
            'saints': SaintListSerializer(saints, many=True, context={'request': request}).data,
            'fasting': fasting_info
        })


class EthiopianCalendarView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        date_str = request.query_params.get('date')
        if date_str:
            try:
                target_date = datetime.date.fromisoformat(date_str)
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            target_date = timezone.now().date()

        info = gregorian_to_ethiopian(target_date)
        return Response(info)


class DailyVerseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DailyVerse.objects.all().order_by('-date')
    serializer_class = DailyVerseSerializer
    permission_classes = [permissions.AllowAny]


class DailyDevotionalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DailyDevotional.objects.all().order_by('-date')
    serializer_class = DailyDevotionalSerializer
    permission_classes = [permissions.AllowAny]


class FastingSeasonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FastingSeason.objects.all()
    serializer_class = FastingSeasonSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
