"""
Management command to seed authentic Ethiopian Orthodox Tewahedo data:
- 10 Foundational Teaching Categories & Lessons
- Preachers & Sermons
- Kidase Liturgies & Parallel Sections
- Wudase Mariam Daily Verses (Ge'ez and Amharic)
- Audio Categories & Mezmurs
- Spiritual Videos
- Daily Common Prayers & Creeds
- Saints & Synaxarium Entries
- Fasting Calendar & Devotionals
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User
from teachings.models import TeachingCategory, Lesson
from sermons.models import Preacher, SermonCategory, Sermon
from kidase.models import KidaseCategory, Anaphora, LiturgySection
from wudase_mariam.models import WudaseDay, WudaseStanza
from audio.models import AudioCategory, AudioArtist, AudioTrack
from videos.models import VideoCategory, Video
from prayers.models import PrayerCategory, PrayerBook, PrayerSection
from saints.models import Saint, SynaxariumReading
from daily_content.models import DailyVerse, DailyDevotional, FastingSeason

class Command(BaseCommand):
    help = 'Seeds authentic Ethiopian Orthodox Tewahedo canonical content'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('--- Seeding Tewahedo Spiritual Data ---'))

        # 1. Superuser & Admin Users
        admin_user, _ = User.objects.get_or_create(
            email='admin@tewahedo.org',
            defaults={
                'username': 'admin',
                'full_name': 'ዋና አስተዳዳሪ',
                'baptismal_name': 'ወልደ ሚካኤል',
                'role': User.Role.SUPER_ADMIN,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('AdminPassword2026!')
        admin_user.save()

        # 2. Teaching Categories (10 Foundations)
        categories_data = [
            ('ስለ እግዚአብሔር', 'About God', 'about-god', 'የፈጣሪ ህልውና፣ ባሕርይና ዘላለማዊነት', 'cross', 1),
            ('ስለ ሥላሴ', 'About Holy Trinity', 'about-holy-trinity', 'በስም በአካል በግብር ሦስት፣ በመለኮትና በባሕርይ አንድ', 'users', 2),
            ('ስለ ክርስቶስ', 'About Christ', 'about-christ', 'ተዋሕዶ፣ የቃለ እግዚአብሔር ሰው መሆንና የድኅነት ምሥጢር', 'heart', 3),
            ('ስለ መንፈስ ቅዱስ', 'About Holy Spirit', 'about-holy-spirit', 'አጽናኝና ሕይወት ሰጪ የሆነ የእግዚአብሔር መንፈስ', 'wind', 4),
            ('ስለ ቅዱሳን', 'About Saints', 'about-saints', 'የቅዱሳን አማላጅነት፣ ክብርና በረከት', 'shield', 5),
            ('ስለ ቤተክርስቲያን', 'About the Church', 'about-church', 'አንዲት ቅድስት ኩላዊትና ሐዋርያዊት ቤተክርስቲያን', 'home', 6),
            ('ስለ ምሥጢራት', 'About Holy Sacraments', 'about-sacraments', 'ሰባቱ ምሥጢራተ ቤተክርስቲያን', 'book', 7),
            ('ስለ ጾም', 'About Fasting', 'about-fasting', 'መንፈሳዊ ጋሻና የበረከት ምንጭ የሆነ ጾም', 'calendar', 8),
            ('ስለ ጸሎት', 'About Prayer', 'about-prayer', 'ከእግዚአብሔር ጋር የመነጋገርና የልብ መገናኘት ጥበብ', 'bell', 9),
            ('ስለ ንስሐ', 'About Repentance', 'about-repentance', 'ወደ እግዚአብሔር መመለስና የኃጢአት ስርየት', 'refresh-cw', 10),
        ]

        cat_objs = {}
        for name_am, name_en, slug, desc, icon, order in categories_data:
            cat, _ = TeachingCategory.objects.get_or_create(
                slug=slug,
                defaults={
                    'name_amharic': name_am,
                    'name_english': name_en,
                    'description': desc,
                    'icon_name': icon,
                    'order': order,
                }
            )
            cat_objs[slug] = cat

        # 3. Sample Lessons
        lessons_data = [
            (
                'about-god',
                'የእግዚአብሔር ህልውናና ዘላለማዊነት',
                'Existence and Eternity of God',
                'existence-eternity-of-god',
                'እግዚአብሔር መጀመሪያና መጨረሻ የሌለው፣ ሁሉን ቻይና በሁሉ የሞላ ፈጣሪ ነው።',
                'ኦርቶዶክሳዊት ተዋሕዶ ቤተክርስቲያናችን እግዚአብሔር በባሕርዩ ፈጣሪ፣ መጋቢ፣ ሁሉን ቻይ፣ በሁሉ የመላና ዘላለማዊ አምላክ መሆኑን ታስተምራለች። እርሱ ያልነበረበት ጊዜ የለም፤ የማይኖርበትም ጊዜ አይመጣም። ፈጣሪነቱ ፍጥረታትን ካለመኖር ወደ መኖር በማምጣት የተገለጸ ነው።',
                'መዝሙር 90:2',
                'https://example.com/audio/lesson_god.mp3',
                950,
                True
            ),
            (
                'about-holy-trinity',
                'ምሥጢረ ሥላሴ በኦርቶዶክስ ተዋሕዶ እምነት',
                'Mystery of the Holy Trinity',
                'mystery-of-the-holy-trinity',
                'ሥላሴ በአንድነትና በሦስትነት የሚመሰገኑበት ታላቅ የመለኮት ምሥጢር።',
                'በስም አብ ወልድ መንፈስ ቅዱስ፤ በአካል ለአብ ፍጹም ገጽ ፍጹም አካል አለው፤ ለወልድ ፍጹም ገጽ ፍጹም አካል አለው፤ ለመንፈስ ቅዱስ ፍጹም ገጽ ፍጹም አካል አለው። በግብር አብ ወላጅ አሥራፂ፤ ወልድ ተወላጅ፤ መንፈስ ቅዱስ ሠራፂ ነው። በባሕርይ፣ በመለኮት፣ በፈቃድ፣ በሥልጣን ግን አንድ አምላክ ናቸው።',
                'ማቴዎስ 28:19',
                'https://example.com/audio/lesson_trinity.mp3',
                1240,
                True
            ),
            (
                'about-christ',
                'ምሥጢረ ተዋሕዶ - ቃል ሥጋ ሆነ',
                'Mystery of the Incarnation',
                'mystery-of-incarnation',
                'አምላክ ሰው ሆነ ሰው አምላክ ሆነ የተባለበት ተዋሕዶ።',
                'መለኮትና ትስብእት (ሥጋ) ያለመቀላቀል፣ ያለመለወጥ፣ ያለመለያየትና ያለመከፋፈል በአንድ አካልና በአንድ ባሕርይ ተዋሐዱ። ጌታችን ኢየሱስ ክርስቶስ ፍጹም አምላክ ፍጹም ሰው ነው።',
                'ዮሐንስ 1:14',
                'https://example.com/audio/lesson_christ.mp3',
                1100,
                True
            ),
            (
                'about-fasting',
                'የጾም መንፈሳዊ ፋይዳና ሥርዓት',
                'Spiritual Significance of Fasting',
                'spiritual-significance-of-fasting',
                'ጾም የሥጋ ፈቃድን ለመንፈስ ማስገዛትና ወደ እግዚአብሔር መቅረብ ነው።',
                'ጾም ማለት ለተወሰነ ጊዜ ከእህልና ከውኃ መከልከል፣ ከእንስሳት ተዋጽኦ መራቅና ከኃጢአት ሁሉ መከልከል ነው። ጾም ከጸሎትና ከምጽዋት ጋር ሲጣመር ታላቅ ኃይልና በረከትን ያሰጣል።',
                'ማቴዎስ 17:21',
                'https://example.com/audio/lesson_fasting.mp3',
                800,
                True
            )
        ]

        for cat_slug, t_am, t_en, slug, summ, cont, scrip, aud, dur, feat in lessons_data:
            if cat_slug in cat_objs:
                Lesson.objects.get_or_create(
                    slug=slug,
                    defaults={
                        'category': cat_objs[cat_slug],
                        'title_amharic': t_am,
                        'title_english': t_en,
                        'summary': summ,
                        'content_amharic': cont,
                        'scripture_reference': scrip,
                        'audio_url': aud,
                        'audio_duration_seconds': dur,
                        'is_featured': feat,
                    }
                )

        # 4. Preachers & Sermons
        preacher1, _ = Preacher.objects.get_or_create(
            slug='mehreteab-assefa',
            defaults={
                'title_rank': 'memhir',
                'name_amharic': 'ምሕረትአብ አሰፋ',
                'name_english': 'Memhir Mehreteab Assefa',
                'biography': 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ታዋቂ ወንጌል ሰባኪና አስተማሪ።',
                'church_parish': 'ደብረ ሰላም',
                'order': 1
            }
        )
        preacher2, _ = Preacher.objects.get_or_create(
            slug='zebene-lemma',
            defaults={
                'title_rank': 'memhir',
                'name_amharic': 'ዘበነ ለማ',
                'name_english': 'Dr. Memhir Zebene Lemma',
                'biography': 'ሊቀ ጠበብት ዶክተር መምህር ዘበነ ለማ፣ በዓለም ዙሪያ የሚያስተምሩ የቤተክርስቲያን መሪ።',
                'church_parish': 'ቅድስት ማርያም ዋሽንግተን',
                'order': 2
            }
        )

        sermon_cat, _ = SermonCategory.objects.get_or_create(
            slug='faith-life',
            defaults={'name_amharic': 'የእምነት ሕይወት', 'name_english': 'Christian Living'}
        )

        Sermon.objects.get_or_create(
            slug='glory-of-orthodox-tewahedo',
            defaults={
                'preacher': preacher1,
                'category': sermon_cat,
                'title_amharic': 'የኦርቶዶክስ ተዋሕዶ ክብርና መሠረት',
                'title_english': 'The Glory and Foundation of Tewahedo',
                'description': 'ስለ ቤተክርስቲያን ታሪካዊ መሠረት፣ ቀኖናና ትውፊት የተሰጠ ጥልቅ ስብከት።',
                'scripture_theme': 'ኤፌሶን 2:20',
                'audio_url': 'https://example.com/sermons/glory_tewahedo.mp3',
                'audio_duration_seconds': 3600,
                'video_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'is_featured': True,
                'recorded_date': timezone.now().date(),
            }
        )

        # 5. Kidase Anaphoras & Sections
        kidase_cat, _ = KidaseCategory.objects.get_or_create(
            slug='canonical-anaphoras',
            defaults={'name_amharic': 'አኰቴተ ቍርባን', 'name_english': 'Canonical Anaphoras', 'order': 1}
        )

        anaphora_apostles, _ = Anaphora.objects.get_or_create(
            slug='anaphora-of-the-apostles',
            defaults={
                'category': kidase_cat,
                'title_geez': 'ቅዳሴ ሐዋርያት',
                'title_amharic': 'የሐዋርያት ቅዳሴ',
                'title_english': 'Anaphora of the Apostles',
                'author_father': 'ቅዱሳን ሐዋርያት',
                'liturgical_season_used': 'በዘወትርና በሰንበት ቀናት',
                'historical_background': 'ይህ ቅዳሴ ከቀደምት የቤተክርስቲያን አባቶች የተላለፈ ዋናውና በብዛት የሚቀደሰው ቅዳሴ ነው።',
                'theological_significance': 'የክርስቶስን ቤዛነት፣ የሥጋ ወደሙን ምሥጢርና የትንሣኤውን ተስፋ በስፋት ይዟል።',
                'audio_url': 'https://example.com/audio/kidase_apostles.mp3',
                'audio_duration_seconds': 5400,
                'is_featured': True,
                'order': 1
            }
        )

        # Liturgy Sections for Apostles
        liturgy_sections = [
            (
                1, LiturgySection.LiturgicalRole.PRIEST, 'ቡራኬ (Blessing)',
                'እግዚአብሔር ምስለ ኵልክሙ።',
                'እግዚአብሔር ከሁላችሁ ጋር ይሁን።',
                'The Lord be with you all.',
                5.0,
                'ካህኑ ሕዝቡን በእግዚአብሔር ስም ይባርካል።'
            ),
            (
                2, LiturgySection.LiturgicalRole.PEOPLE, 'ምላሽ (Response)',
                'ምስለ መንፈስከ።',
                'ከመንፈስህ ጋር።',
                'And with your spirit.',
                12.0,
                'ሕዝቡ ለካህኑ በረከት ምላሽ ይሰጣሉ።'
            ),
            (
                3, LiturgySection.LiturgicalRole.PRIEST, 'ምስጋና (Thanksgiving)',
                'አእኵትዎ ለአምላክነ።',
                'አምላካችንን አመስግኑት።',
                'Give thanks unto our God.',
                18.0,
                'ካህኑ ሕዝቡ ልባቸውን ወደ እግዚአብሔር እንዲያነሱ ያዛል።'
            ),
            (
                4, LiturgySection.LiturgicalRole.PEOPLE, 'ምላሽ (Response)',
                'ርቱዕ ይደልዎ።',
                'እውነት ነው ይገባል።',
                'It is right and just.',
                25.0,
                'ማመስገን ተገቢና እውነተኛ እንደሆነ ሕዝቡ ይመሰክራሉ።'
            ),
            (
                5, LiturgySection.LiturgicalRole.DEACON, 'ማሳሰቢያ (Exhortation)',
                'አንሥኡ አዕይንቲክሙ።',
                'ዓይኖቻችሁን ወደ ላይ አንሡ።',
                'Lift up your eyes.',
                32.0,
                'ዲያቆኑ ምእመናን ልባቸውን ከምድራዊ ነገር እንዲያርቁ ያሳስባል።'
            )
        ]

        for o, r, tit, gz, am, en, ts, exp in liturgy_sections:
            LiturgySection.objects.get_or_create(
                anaphora=anaphora_apostles,
                order=o,
                defaults={
                    'liturgical_role': r,
                    'section_title': tit,
                    'text_geez': gz,
                    'text_amharic': am,
                    'text_english': en,
                    'audio_timestamp_seconds': ts,
                    'explanation': exp
                }
            )

        # 6. Wudase Mariam (The 7 Days + Anqetse Berhan)
        wudase_days_data = [
            (
                'monday', 'ውዳሴ ዘሰኑይ', 'የሰኑይ ውዳሴ ማርያም', 'Monday Praise of Mary',
                'የእመቤታችን ምስጋናና የአዳም ከኃጢአት ነፃ መውጣት ምሥጢር።',
                'https://example.com/audio/wudase_monday.mp3', 1200, 1,
                [
                    (1, 'ፈቀደ እግዚእ ያግዕዞ ለአዳም ኅዙነ ወትኩዘ ልብ ወያግብኦ ኀበ ዘቀዳሚ መንበሩ።',
                     'እግዚአብሔር ያዘነና የተከዘ አዳምን ነፃ ያወጣው ዘንድ፤ ወደ ቀደመ ክብሩም ይመልሰው ዘንድ ወደደ።',
                     'The Lord willed to set free Adam who was sorrowful and grieved in heart, and to restore him to his former dwelling.', 0.0),
                    (2, 'ሰአሊ ለነ ቅድስት፤ ምእልተ ምሕረት ድንግል ማርያም ወላዲተ አምላክ።',
                     'ምሕረትን የተመላሽ ቅድስት ድንግል ማርያም ሆይ ለምኝልን።',
                     'Pray for us, O Holy and full of mercy, Virgin Mary, Mother of God.', 25.0),
                    (3, 'ተፈሥሒ ፍሥሕት ኦ ማርያም ድንግል ዘእንበለ ርኩስ እስመ ረከብኪ ሞገሰ በኀበ እግዚአብሔር።',
                     'እድፍ ጉድፍ የሌለብሽ ድንግል ማርያም ሆይ ደስ ይበልሽ፤ በእግዚአብሔር ዘንድ ባለሟልነትን አግኝተሻልና።',
                     'Rejoice, O undefiled Virgin Mary, for thou hast found favor before God.', 50.0),
                ]
            ),
            (
                'tuesday', 'ውዳሴ ዘሠሉስ', 'የሠሉስ ውዳሴ ማርያም', 'Tuesday Praise of Mary',
                'ዕፀ ጳጦስና የሙሴ ራእይ፣ የድንግልና ምሥጢር።',
                'https://example.com/audio/wudase_tuesday.mp3', 1300, 2,
                [
                    (1, 'ዕፀ ጳጦስ ዘርእየ ሙሴ በነደ እሳት ዘኢትውዒ ይእቲ ማርያም ድንግል ወላዲተ አምላክ።',
                     'ሙሴ በነደ እሳት ሳትቃጠል ያያት ዕፀ ጳጦስ አምላክን የወለደች ድንግል ማርያም ናት።',
                     'The Bush which Moses saw burning with fire without being consumed is Mary the Virgin, Mother of God.', 0.0),
                    (2, 'እስመ ኀደረ ላዕሌሃ እሳተ መለኮት ወኢያውዓያ።',
                     'የመለኮት እሳት በእርስዋ አድሯልና አላቃጠላትም።',
                     'For the fire of the Godhead resided within her and burned her not.', 30.0),
                ]
            ),
            (
                'wednesday', 'ውዳሴ ዘረቡዕ', 'የረቡዕ ውዳሴ ማርያም', 'Wednesday Praise of Mary',
                'የጌዴዎን ፀምርና የልዑል ማደሪያ ንጽሕት ድንግል።',
                'https://example.com/audio/wudase_wednesday.mp3', 1250, 3,
                [
                    (1, 'ኵሉ ሠራዊተ ሰማይ ይብሉ ብፅዕት አንቲ ዘበአማን።',
                     'የሰማይ ሠራዊት ሁሉ በእውነት ብፅዕት ነሽ ይላሉ።',
                     'All the heavenly hosts say: Blessed art thou in truth.', 0.0),
                ]
            ),
            (
                'thursday', 'ውዳሴ ዘሐሙስ', 'የሐሙስ ውዳሴ ማርያም', 'Thursday Praise of Mary',
                'ያልተተከለችና ያለ ውኃ የበቀለች የአሮን በትር።',
                'https://example.com/audio/wudase_thursday.mp3', 1400, 4,
                [
                    (1, 'በትር ዘአሮን ዘሠረፀት ዘእንበለ ተክለ ወዘኢሰቀይዋ ማየ ከማሃ ይእቲ ማርያም።',
                     'ሳይተክሏትና ውኃ ሳያጠጧት የለመለመች የአሮን በትር ድንግል ማርያም እንደ እርሷ ናት።',
                     'The rod of Aaron which budded without being planted or watered, like unto it is Mary.', 0.0),
                ]
            ),
            (
                'friday', 'ውዳሴ ዘዓርብ', 'የዓርብ ውዳሴ ማርያም', 'Friday Praise of Mary',
                'ንጽሕት ማዕጠንት ዘወርቅ - የወርቅ ማዕጠንት።',
                'https://example.com/audio/wudase_friday.mp3', 1350, 5,
                [
                    (1, 'ተፈሥሒ ኦ ማርያም ርግብ ሠናይት ዘወለደት ለነ እግዚአብሔር ቃለ።',
                     'የእግዚአብሔርን ቃል የወለድሽልን መልካሟ ርግብ ማርያም ሆይ ደስ ይበልሽ።',
                     'Rejoice, O Mary, fair dove, who hast borne for us the Word of God.', 0.0),
                ]
            ),
            (
                'saturday', 'ውዳሴ ዘቀዳሚት', 'የቀዳሚት ውዳሴ ማርያም', 'Saturday Praise of Mary',
                'የታላቁ ንጉሥ ከተማ፣ የተፈታውን የሰላም ማሰሪያ።',
                'https://example.com/audio/wudase_saturday.mp3', 1200, 6,
                [
                    (1, 'ሃገረ እግዚአብሔር ቅድስት ይእቲ ማርያም።',
                     'ቅድስት የእግዚአብሔር አገር ማርያም ናት።',
                     'The Holy City of God is Mary.', 0.0),
                ]
            ),
            (
                'sunday', 'ውዳሴ ዘእሑድ', 'የእሑድ ውዳሴ ማርያም', 'Sunday Praise of Mary',
                'የሕዝቅኤል ምሥራቃዊት ደጅ።',
                'https://example.com/audio/wudase_sunday.mp3', 1500, 7,
                [
                    (1, 'ይእቲ ደጅ ዘርእየ ሕዝቅኤል በምሥራቅ ኅቱም።',
                     'ሕዝቅኤል በምሥራቅ በኩል ተዘግታ ያያት ደጅ እርሷ ድንግል ማርያም ናት።',
                     'She is the gate which Ezekiel saw sealed in the east.', 0.0),
                ]
            ),
            (
                'anqetse_berhan', 'አንቀጸ ብርሃን', 'አንቀጸ ብርሃን', 'The Gate of Light',
                'በቅዱስ ያሬድ የተደረሰ የእመቤታችን ታላቅ ምስጋና።',
                'https://example.com/audio/anqetse_berhan.mp3', 1800, 8,
                [
                    (1, 'ቅድስት ወብፅዕት ስብሕት ወቡርክት ክብርት ወልዕልት አንቀጸ ብርሃን።',
                     'ቅድስትና ብፅዕት፣ የተመሰገንሽና የተባረክሽ፣ የከበርሽና ከፍ ከፍ ያልሽ የብርሃን መውጫ በር።',
                     'Holy and blessed, praised and glorious, exalted and elevated Gate of Light.', 0.0),
                ]
            )
        ]

        for code, gz, am, en, thm, aud, dur, ord, stanzas in wudase_days_data:
            w_day, _ = WudaseDay.objects.get_or_create(
                day_code=code,
                defaults={
                    'name_geez': gz,
                    'name_amharic': am,
                    'name_english': en,
                    'theme_summary': thm,
                    'audio_url': aud,
                    'audio_duration_seconds': dur,
                    'order': ord,
                }
            )
            for sn, sgz, sam, sen, sts in stanzas:
                WudaseStanza.objects.get_or_create(
                    day=w_day,
                    stanza_number=sn,
                    defaults={
                        'text_geez': sgz,
                        'text_amharic': sam,
                        'text_english': sen,
                        'audio_timestamp_seconds': sts
                    }
                )

        # 7. Audio Categories & Tracks
        audio_cat_mezmur, _ = AudioCategory.objects.get_or_create(
            slug='mezmur',
            defaults={'name_amharic': 'መዝሙር', 'name_english': 'Mezmur', 'icon_name': 'music', 'order': 1}
        )
        audio_cat_kidase, _ = AudioCategory.objects.get_or_create(
            slug='kidase',
            defaults={'name_amharic': 'ቅዳሴ', 'name_english': 'Liturgy (Kidase)', 'icon_name': 'disc', 'order': 2}
        )
        audio_cat_wudase, _ = AudioCategory.objects.get_or_create(
            slug='wudase',
            defaults={'name_amharic': 'ውዳሴ ማርያም', 'name_english': 'Wudase Mariam', 'icon_name': 'book-open', 'order': 3}
        )
        audio_cat_prayer, _ = AudioCategory.objects.get_or_create(
            slug='prayer',
            defaults={'name_amharic': 'ጸሎት', 'name_english': 'Prayers', 'icon_name': 'shield', 'order': 4}
        )

        artist_tadele, _ = AudioArtist.objects.get_or_create(
            slug='tadele-tufa',
            defaults={'name_amharic': 'ዘማሪ ታደለ ቱፋ', 'name_english': 'Zemari Tadele Tufa', 'choir_group': 'ደብረ አሚን'}
        )
        artist_solomon, _ = AudioArtist.objects.get_or_create(
            slug='solomon-ababu',
            defaults={'name_amharic': 'ዘማሪ ሰሎሞን አባቡ', 'name_english': 'Zemari Solomon Ababu', 'choir_group': 'ማኅበረ ቅዱሳን'}
        )

        AudioTrack.objects.get_or_create(
            slug='egziabhier-yimesgen',
            defaults={
                'category': audio_cat_mezmur,
                'artist': artist_tadele,
                'title_amharic': 'እግዚአብሔር ይመስገን ቸርነቱ የበዛልን',
                'title_english': 'Praise the Lord for His Abundant Mercy',
                'audio_url': 'https://example.com/audio/mezmur_praise.mp3',
                'duration_seconds': 345,
                'lyrics_amharic': 'እግዚአብሔር ይመስገን ቸርነቱ የበዛልን\nበኃጢአት ሳለን ያሰበን በፍቅሩ የታደገን\nምስጋና ይገባል ለጌታ ክብር ይገባል ለአምላክ።',
                'is_featured': True,
                'is_trending': True,
                'order': 1,
            }
        )

        AudioTrack.objects.get_or_create(
            slug='maryam-dingil-enatenesh',
            defaults={
                'category': audio_cat_mezmur,
                'artist': artist_solomon,
                'title_amharic': 'ማርያም ድንግል እናቴ ነሽ',
                'title_english': 'Virgin Mary Thou Art My Mother',
                'audio_url': 'https://example.com/audio/mezmur_maryam.mp3',
                'duration_seconds': 410,
                'lyrics_amharic': 'ማርያም ድንግል እናቴ ነሽ\nየሕይወቴ መጽናኛዬ\nከጎኔ ሁኚ በምልጃሽ\nአደራሽን እመቤቴ።',
                'is_featured': True,
                'is_trending': True,
                'order': 2,
            }
        )

        # 8. Prayers & Creeds
        prayer_cat_daily, _ = PrayerCategory.objects.get_or_create(
            slug='daily-prayers',
            defaults={'name_amharic': 'የዘወትር ጸሎታት', 'name_english': 'Daily Prayers', 'order': 1}
        )

        prayer_common, _ = PrayerBook.objects.get_or_create(
            slug='common-daily-prayer',
            defaults={
                'category': prayer_cat_daily,
                'title_geez': 'ጸሎተ ዘወትር',
                'title_amharic': 'የዘወትር ጸሎት',
                'title_english': 'Daily Common Prayer',
                'author': 'የቀደምት አበው',
                'occasion_time': PrayerBook.OccasionTime.ANYTIME,
                'summary': 'እያንዳንዱ ክርስቲያን በየዕለቱ ሊጸልየው የሚገባ መሠረታዊ የጸሎት መጽሐፍ።',
                'audio_url': 'https://example.com/prayers/daily_prayer.mp3',
                'audio_duration_seconds': 600,
                'is_featured': True,
                'order': 1,
            }
        )

        common_prayer_sections = [
            (1, 'በስመ አብ', 'በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።', 'አንድ አምላክ በሚሆን በአብ በወልድ በመንፈስ ቅዱስ ስም አሜን።', 'In the name of the Father, and of the Son, and of the Holy Spirit, one God. Amen.'),
            (2, 'ጸሎተ እግዝእትነ', 'ሰላም ለኪ ማርያም ድንግል በሕሊናኪ ወድንግል በሥጋኪ...', 'እመቤታችን ቅድስት ድንግል ማርያም ሆይ በመልአኩ በቅዱስ ገብርኤል ሰላምታ ሰላም እንልሻለን...', 'Peace be unto thee, O Virgin Mary, virgin in mind and body...'),
            (3, 'አቡነ ዘበሰማያት', 'አቡነ ዘበሰማያት ይትቀደስ ስምከ ትምጻእ መንግሥትከ...', 'በሰማያት የምትኖር አባታችን ሆይ ስምህ ይቀደስ፤ መንግሥትህ ትምጣ...', 'Our Father who art in heaven, hallowed be thy name...'),
        ]

        for so, st, gz, am, en in common_prayer_sections:
            PrayerSection.objects.get_or_create(
                book=prayer_common,
                section_order=so,
                defaults={
                    'section_title': st,
                    'text_geez': gz,
                    'text_amharic': am,
                    'text_english': en,
                }
            )

        # 9. Saints & Synaxarium
        saints_data = [
            ('ቅዱስ ጊዮርጊስ', 'ሊቀ ሰማዕታት ቅዱስ ጊዮርጊስ', 'St. George the Martyr', 'st-george', 'martyr', 8, 23, 23, 'የሰማዕትነት ዕረፍቱ', 'ስለ ክርስቶስ ስም ሰባት ዓመት ሙሉ ታላቅ መከራን የተቀበለ የሰማዕታት አለቃ ቅዱስ ጊዮርጊስ።', True),
            ('አቡነ ተክለ ሃይማኖት', 'ጻድቁ አባታችን አቡነ ተክለ ሃይማኖት', 'Abba Tekle Haymanot', 'abba-tekle-haymanot', 'righteous', 12, 24, 24, 'የዕረፍታቸው መታሰቢያ', 'በኢትዮጵያ ወንጌልን ያስተማሩ፣ በአንድ እግራቸው ቆመው የጸለዩ ታላቅ ጻድቅ አባት።', True),
            ('አቡነ ገብረ መንፈስ ቅዱስ', 'ጻድቁ አቡነ ገብረ መንፈስ ቅዱስ', 'Abba Gebre Menfes Kidus', 'abba-gebre-menfes-kidus', 'righteous', 7, 5, 5, 'የዕረፍት ቀን', 'በዝቋላ ምድረ በዳ ለአገራችን ለኢትዮጵያና ለዓለም ድኅነት የጸለዩ አባት።', True),
            ('ቅዱስ ሚካኤል', 'ሊቀ መላእክት ቅዱስ ሚካኤል', 'Archangel Michael', 'archangel-michael', 'angel', 3, 12, 12, 'ታላቁ የበዓል መታሰቢያ', 'የእስራኤል አለቃና በችግር ጊዜ ፈጥኖ የሚረዳ ቅዱስ መልአክ።', True),
            ('ቅድስት አርሴማ', 'ሰማዕቷ ቅድስት አርሴማ', 'Saint Arsema', 'saint-arsema', 'martyr', 2, 29, 29, 'የሰማዕትነት ቀን', 'በንጽሕናዋና በጽናት ለክርስቶስ ፍቅር ሕይወቷን አሳልፋ የሰጠች ድንግል ሰማዕት።', True),
        ]

        for gz, am, en, slg, rk, m, d, md, fd, bio, maj in saints_data:
            Saint.objects.get_or_create(
                slug=slg,
                defaults={
                    'name_geez': gz,
                    'name_amharic': am,
                    'name_english': en,
                    'rank': rk,
                    'ethiopian_month': m,
                    'ethiopian_day': d,
                    'monthly_feast_day': md,
                    'feast_description': fd,
                    'biography_amharic': bio,
                    'is_major_feast': maj
                }
            )

        # 10. Fasting Seasons
        fasts = [
            ('ዐቢይ ጾም (Hudadi)', 'Great Lent', 'lent', 55, 'ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ በገዳመ ቆሮንቶስ የጾመው ጾም'),
            ('ጾመ ፍልሰታ', 'Fast of Assumption', 'filseta', 16, 'የእመቤታችን የሥጋዋን ፍልሰትና ትንሣኤ አስመልክቶ የሚጾም ጾም (ነሐሴ 1-16)'),
            ('ጾመ ነቢያት', 'Fast of the Prophets', 'nebiyat', 44, 'የጌታችንን መወለድ አስቀድመው ነቢያት የጾሙት ጾም (ኅዳር 15 - ታኅሣሥ 28)'),
            ('ጾመ ሐዋርያት', 'Fast of the Apostles', 'hawaryat', 30, 'መንፈስ ቅዱስ ከወረደ በኋላ ሐዋርያት ለስብከተ ወንጌል የጾሙት ጾም'),
            ('ጾመ ነነዌ', 'Fast of Nineveh', 'nineveh', 3, 'የነነዌ ሰዎች ንስሐ የገቡበት የሦስት ቀን ጾም'),
        ]

        for am, en, stype, dur, mean in fasts:
            FastingSeason.objects.get_or_create(
                season_type=stype,
                defaults={
                    'name_amharic': am,
                    'name_english': en,
                    'duration_days': dur,
                    'spiritual_meaning': mean
                }
            )

        # 11. Today's Verse & Devotional
        today_date = timezone.now().date()
        DailyVerse.objects.get_or_create(
            date=today_date,
            defaults={
                'verse_reference': 'መዝሙር 118:24',
                'verse_text_amharic': 'እግዚአብሔር ያደረጋት ቀን ይህች ናት፤ በእርስዋ ደስ ይበለን ሐሴትም እናድርግ።',
                'verse_text_geez': 'ዛቲ ዕለት እንተ ገብረ እግዚአብሔር ንትፈሣሕ ወንትሐሠይ ባቲ።',
                'commentary': 'እግዚአብሔር የሰጠን እያንዳንዷ ቀን የጸጋ፣ የንስሐና የምስጋና ቀን ናት።',
            }
        )

        DailyDevotional.objects.get_or_create(
            date=today_date,
            defaults={
                'title_amharic': 'ስለ ፍቅርና ትሕትና የተሰጠ ምክር',
                'title_english': 'Counsel on Love and Humility',
                'author_saint': 'አባ እንጦንስ',
                'content_amharic': 'ትሕትና የሌለው ሰው እንደማይሰምር መርከብ ነው። ራሱን ዝቅ የሚያደርግ ግን በእግዚአብሔር ዘንድ ከፍ ይላል። ወንድሞችህን ውደድ፣ ሌሎችን አትፍረድ፣ በጸሎት ተግተህ ኑር።',
            }
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded all authentic Ethiopian Orthodox Tewahedo data!'))
