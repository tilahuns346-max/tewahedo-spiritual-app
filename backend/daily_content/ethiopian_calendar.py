import datetime

ETHIOPIAN_MONTH_NAMES = [
    '', 'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
    'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
]

ETHIOPIAN_MONTH_NAMES_EN = [
    '', 'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
    'Megabit', 'Miyazya', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
]

WEEKDAY_NAMES_AM = ['ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ', 'እሑድ']

def gregorian_to_ethiopian(greg_date: datetime.date):
    """
    Converts a Gregorian date (datetime.date) to Ethiopian Calendar (year, month, day).
    Accurate for modern dates.
    """
    year = greg_date.year
    month = greg_date.month
    day = greg_date.day

    # Ethiopian new year starts on Sep 11 (or Sep 12 in leap year before Ethiopian leap year)
    is_greg_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
    new_year_day = 12 if is_greg_leap else 11

    # Ethiopian year offset is 7 or 8 years behind
    if (month < 9) or (month == 9 and day < new_year_day):
        eth_year = year - 8
    else:
        eth_year = year - 7

    # Calculate days since start of Ethiopian year
    eth_new_year = datetime.date(year - 1 if (month < 9 or (month == 9 and day < new_year_day)) else year, 9, new_year_day)
    day_diff = (greg_date - eth_new_year).days

    if day_diff < 0:
        day_diff += 365 + (1 if is_greg_leap else 0)

    eth_month = (day_diff // 30) + 1
    eth_day = (day_diff % 30) + 1

    if eth_month > 13:
        eth_month = 13

    return {
        'year': eth_year,
        'month': eth_month,
        'day': eth_day,
        'month_name_amharic': ETHIOPIAN_MONTH_NAMES[eth_month],
        'month_name_english': ETHIOPIAN_MONTH_NAMES_EN[eth_month],
        'weekday_amharic': WEEKDAY_NAMES_AM[greg_date.weekday()],
        'formatted': f"{ETHIOPIAN_MONTH_NAMES[eth_month]} {eth_day} ቀን {eth_year} ዓ.ም."
    }
