export type ReligionId =
  | 'christianity'
  | 'islam'
  | 'judaism'
  | 'hinduism'
  | 'buddhism'
  | 'sikhism'
  | 'interfaith';

export interface SpiritualDesire {
  id: string;
  name: string;
  category: 'charity' | 'integrity' | 'contemplation' | 'moderation' | 'service';
  description: string;
  scriptureAnchor: string;
  currentProgress: number;
  targetGoal: number;
  unit: string;
  isFulfilled: boolean;
  rewardSerenity: number;
  actionLabel?: string;
  actionCostCash?: number;
}

export interface ScheduledPrayer {
  id: string;
  name: string;
  arabicOrNativeName?: string;
  standardTime: string; // e.g. "05:30"
  scheduledTime: string; // customizable by user: "HH:MM"
  windowLabel: string; // e.g. "Dawn / Morning", "Noon", "Sunset"
  enabled: boolean;
  completedToday: boolean;
  scriptureText: string;
  englishTranslation: string;
  guidance: string;
  lastCompletedDate?: string;
}

export interface ScriptureVerse {
  id: string;
  reference: string;
  title: string;
  originalOrPhonetic?: string;
  text: string;
  translationNotes?: string;
  topic: 'Wealth & Stewardship' | 'Charity & Mercy' | 'Honesty & Labor' | 'Peace & Contentment' | 'Universal Justice';
  themeSummary: string;
}

export interface ReputableStudyLink {
  id: string;
  name: string;
  url: string;
  description: string;
  badge: string;
  recommendedChapters: string[];
  authorityNotes: string;
}

export interface StudyNote {
  id: string;
  title: string;
  passageRef: string;
  authorOrSource: string;
  content: string;
  timestamp: number;
  isUserNote?: boolean;
}

export interface ReligionState {
  religionId: ReligionId;
  serenity: number; // 0 to 100
  totalPrayersCompleted: number;
  totalCharityGiven: number;
  scheduledPrayers: ScheduledPrayer[];
  desires: SpiritualDesire[];
  studyNotes: StudyNote[];
  notificationsEnabled: boolean;
  chimeSoundEnabled: boolean;
  lastPrayerNotificationKey?: string;
}

export interface ReligionDefinition {
  id: ReligionId;
  name: string;
  emblem: string;
  tradition: string;
  sacredTextName: string;
  tagline: string;
  frontPageExplanation: string;
  teachingsOnWealth: string;
  coreDesiresSummary: string;
  defaultPrayers: Omit<ScheduledPrayer, 'completedToday' | 'lastCompletedDate'>[];
  initialDesires: SpiritualDesire[];
  inGameScriptures: ScriptureVerse[];
  reputableStudyLinks: ReputableStudyLink[];
  scholarlyStudyNotes: StudyNote[];
}

export const RELIGION_DEFINITIONS: Record<ReligionId, ReligionDefinition> = {
  christianity: {
    id: 'christianity',
    name: 'Christianity',
    emblem: '✝️',
    tradition: 'Biblical & Apostolic Faith',
    sacredTextName: 'The Holy Bible (Old & New Testaments)',
    tagline: 'Faith, Hope, and Love — Faithful Stewardship & Compassion',
    frontPageExplanation:
      'In Christian teachings, all silver and gold belong ultimately to God (Haggai 2:8); humanity is entrusted as stewards rather than absolute owners. Wealth is viewed not as intrinsic evil, but as a severe spiritual test and opportunity. Jesus taught that one cannot serve both God and Mammon (Matthew 6:24), urging believers to lay up treasures in heaven through generous giving to the poor, widow, and orphan. The Christian path brings holy daily prayers (Morning Devotion, Noon Grace, Evening Vespers), a commitment to tithing and honest labor, and deep study of the Gospels and Proverbs.',
    teachingsOnWealth:
      'Wealth must be acquired without usury or deceit, held with open hands, and actively deployed to relieve human suffering. Generosity (Caritas) is the hallmark of true discipleship.',
    coreDesiresSummary:
      'Tithing & Charity (Caritas), Honest Labor & Fair Wages, Sabbath Rest & Spiritual Renewal, Overcoming Greed with Contentment.',
    defaultPrayers: [
      {
        id: 'c-morning',
        name: 'Morning Devotion & Lord’s Prayer',
        arabicOrNativeName: 'Pater Noster',
        standardTime: '06:30',
        scheduledTime: '06:30',
        windowLabel: 'Morning Awakening',
        enabled: true,
        scriptureText:
          'Our Father which art in heaven, Hallowed be thy name. Thy kingdom come. Thy will be done in earth, as it is in heaven. Give us this day our daily bread. And forgive us our debts, as we forgive our debtors. And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.',
        englishTranslation:
          'Traditional recitation from Matthew 6:9-13. Reorients the soul at dawn toward divine provision, forgiveness, and deliverance from worldly snares.',
        guidance:
          'Take three slow breaths. Reflect on the blessing of life, asking for guidance to treat employees, competitors, and customers with fairness today.',
      },
      {
        id: 'c-noon',
        name: 'Midday Grace & Peace Prayer',
        arabicOrNativeName: 'Prayer of St. Francis',
        standardTime: '12:00',
        scheduledTime: '12:00',
        windowLabel: 'Midday Pause',
        enabled: true,
        scriptureText:
          'Lord, make me an instrument of your peace: where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; where there is sadness, joy. O Divine Master, grant that I may not so much seek to be consoled as to console, to be understood as to understand, to be loved as to love. For it is in giving that we receive; it is in pardoning that we are pardoned; and it is in dying that we are born to eternal life.',
        englishTranslation:
          'Classic Franciscan prayer invoking humility and service in the midst of daily commerce and busy transactions.',
        guidance:
          'Step away from screens and financial tickers for 60 seconds. Release any anger or frantic anxiety about worldly profits.',
      },
      {
        id: 'c-evening',
        name: 'Evening Vespers & Magnificat',
        arabicOrNativeName: 'Vesperae & Canticum Mariae',
        standardTime: '18:30',
        scheduledTime: '18:30',
        windowLabel: 'Sunset / Evening',
        enabled: true,
        scriptureText:
          'My soul doth magnify the Lord, and my spirit hath rejoiced in God my Saviour. For he hath regarded the low estate of his handmaiden. He hath put down the mighty from their seats, and exalted them of low degree. He hath filled the hungry with good things; and the rich he hath sent empty away. (Luke 1:46-53)',
        englishTranslation:
          'Mary’s song of praise acknowledging that worldly power and riches are fleeting, while divine justice lifts up the humble.',
        guidance:
          'Examine your dealings of the day. Consider whether any surplus earned today can bless someone who is struggling.',
      },
      {
        id: 'c-night',
        name: 'Night Compline & Protection',
        arabicOrNativeName: 'Completorium (Psalm 91)',
        standardTime: '21:30',
        scheduledTime: '21:30',
        windowLabel: 'Night Rest',
        enabled: true,
        scriptureText:
          'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the Lord, He is my refuge and my fortress: my God; in him will I trust. He shall cover thee with his feathers, and under his wings shalt thou trust.',
        englishTranslation:
          'Psalm 91:1-4. Bedtime prayer resting in divine security rather than anxiety over earthly possessions.',
        guidance:
          'Surrender the day’s work into God’s care. Rest knowing that our worth is not measured by bank account figures.',
      },
    ],
    initialDesires: [
      {
        id: 'c-desire-tithe',
        name: 'Tithing & Charitable Giving (Caritas)',
        category: 'charity',
        description: 'Give generously to the poor, orphan, and community relief without seeking public acclaim.',
        scriptureAnchor: 'Proverbs 19:17 & 2 Corinthians 9:7',
        currentProgress: 0,
        targetGoal: 10000,
        unit: 'USD Donated',
        isFulfilled: false,
        rewardSerenity: 25,
        actionLabel: 'Donate $2,500 to Community Food Bank',
        actionCostCash: 2500,
      },
      {
        id: 'c-desire-labor',
        name: 'Fair Wages & Ethical Stewardship',
        category: 'integrity',
        description: 'Ensure honest accounts, paying workers promptly and refusing fraudulent exploitation.',
        scriptureAnchor: 'James 5:4 & Leviticus 19:13',
        currentProgress: 1,
        targetGoal: 1,
        unit: 'Pledge Kept',
        isFulfilled: true,
        rewardSerenity: 20,
        actionLabel: 'Verify Fair Enterprise Ledger',
      },
      {
        id: 'c-desire-sabbath',
        name: 'Sabbath Day of Spiritual Rest',
        category: 'contemplation',
        description: 'Set aside commercial hustle for a quiet period of holy reflection, worship, and family care.',
        scriptureAnchor: 'Exodus 20:8-11',
        currentProgress: 0,
        targetGoal: 1,
        unit: 'Sabbath Observed',
        isFulfilled: false,
        rewardSerenity: 20,
        actionLabel: 'Observe Holy Sabbath Silence',
      },
      {
        id: 'c-desire-humility',
        name: 'Guarding Against the Love of Money',
        category: 'moderation',
        description: 'Guard your heart against arrogance and the illusion that riches guarantee happiness.',
        scriptureAnchor: '1 Timothy 6:10, 17-19',
        currentProgress: 0,
        targetGoal: 3,
        unit: 'Prayers Offered',
        isFulfilled: false,
        rewardSerenity: 20,
      },
    ],
    inGameScriptures: [
      {
        id: 'c-scrip-1',
        reference: 'Matthew 6:19-21, 24',
        title: 'Treasures on Earth and in Heaven',
        text: 'Lay not up for yourselves treasures upon earth, where moth and rust doth corrupt, and where thieves break through and steal: But lay up for yourselves treasures in heaven... For where your treasure is, there will your heart be also. No man can serve two masters: for either he will hate the one, and love the other; or else he will hold to the one, and despise the other. Ye cannot serve God and mammon.',
        topic: 'Wealth & Stewardship',
        themeSummary: 'Wealth must never become an idol; ultimate security lies beyond worldly accumulation.',
      },
      {
        id: 'c-scrip-2',
        reference: 'Luke 12:15-21',
        title: 'The Parable of the Rich Fool',
        text: 'And he said unto them, Take heed, and beware of covetousness: for a man’s life consisteth not in the abundance of the things which he possesseth. And he spake a parable unto them, saying, The ground of a certain rich man brought forth plentifully: And he thought within himself... I will pull down my barns, and build greater... But God said unto him, Thou fool, this night thy soul shall be required of thee: then whose shall those things be, which thou hast provided? So is he that layeth up treasure for himself, and is not rich toward God.',
        topic: 'Wealth & Stewardship',
        themeSummary: 'Hoarding without spiritual generosity leaves the soul impoverished before eternity.',
      },
      {
        id: 'c-scrip-3',
        reference: '1 Timothy 6:17-19',
        title: 'Instruction to the Rich in This Present Age',
        text: 'Charge them that are rich in this world, that they be not highminded, nor trust in uncertain riches, but in the living God, who giveth us richly all things to enjoy; That they do good, that they be rich in good works, ready to distribute, willing to communicate; Laying up in store for themselves a good foundation against the time to come, that they may lay hold on eternal life.',
        topic: 'Charity & Mercy',
        themeSummary: 'Those blessed with earthly riches are commanded to be rich in good deeds, humble and generous.',
      },
      {
        id: 'c-scrip-4',
        reference: 'Proverbs 3:9-10 & 11:24-25',
        title: 'Honoring the Lord with Firstfruits & Generosity',
        text: 'Honour the Lord with thy substance, and with the firstfruits of all thine increase: So shall thy barns be filled with plenty... There is that scattereth, and yet increaseth; and there is that withholdeth more than is meet, but it tendeth to poverty. The liberal soul shall be made fat: and he that watereth shall be watered also himself.',
        topic: 'Charity & Mercy',
        themeSummary: 'Giving unselfishly brings spiritual abundance and communal prosperity.',
      },
      {
        id: 'c-scrip-5',
        reference: 'James 2:14-17',
        title: 'Faith without Works is Dead',
        text: 'What doth it profit, my brethren, though a man say he hath faith, and have not works? can faith save him? If a brother or sister be naked, and destitute of daily food, And one of you say unto them, Depart in peace, be ye warmed and filled; notwithstanding ye give them not those things which are needful to the body; what doth it profit? Even so faith, if it hath not works, is dead, being alone.',
        topic: 'Universal Justice',
        themeSummary: 'True spiritual devotion requires tangible material aid for those in desperate need.',
      },
    ],
    reputableStudyLinks: [
      {
        id: 'c-link-1',
        name: 'BibleGateway.com (Scholarly Multilingual Archive)',
        url: 'https://www.biblegateway.com',
        description:
          'Global standard searchable scripture portal featuring dozens of authentic translations (NIV, ESV, KJV, NRSV, Latin Vulgate), verse-by-verse concordances, and audio narrations.',
        badge: 'Authoritative Open Scripture',
        recommendedChapters: ['Gospel of Matthew 5-7', 'Proverbs 1-12', 'James 1-5', '1 Timothy 6'],
        authorityNotes: 'Widely used by academic seminaries, universities, and Christian churches worldwide.',
      },
      {
        id: 'c-link-2',
        name: 'Blue Letter Bible (Lexicon & Hebrew/Greek Concordance)',
        url: 'https://www.blueletterbible.org',
        description:
          'Scholarly in-depth study platform with Strong’s Concordance, original Hebrew and Greek morphology, line-by-line parsing, and classical commentaries.',
        badge: 'Original Language Concordance',
        recommendedChapters: ['Luke 12 (Wealth parables)', '1 Corinthians 13 (Charity)', 'Psalm 23 & 91'],
        authorityNotes: 'Invaluable for investigating the exact historical Greek terms such as Mammonas, Agape, and Oikonomia (stewardship).',
      },
      {
        id: 'c-link-3',
        name: 'Vatican Archive & United States Conference of Catholic Bishops',
        url: 'https://bible.usccb.org',
        description:
          'Official liturgical readings, encyclicals on social justice and labor (Rerum Novarum, Laudato Si’), and verified biblical commentary.',
        badge: 'Social Doctrine & Liturgy',
        recommendedChapters: ['Beatitudes (Matthew 5)', 'Book of Sirach (Ecclesiasticus) on money and wisdom'],
        authorityNotes: 'Authoritative source for Christian social teaching on the universal destination of earthly goods.',
      },
    ],
    scholarlyStudyNotes: [
      {
        id: 'c-note-1',
        title: 'Oikonomia: The Greek Root of Stewardship and Economy',
        passageRef: 'Luke 16:1-13 & 1 Peter 4:10',
        authorOrSource: 'Historical & Theological Commentary',
        content:
          'The English word "economy" derives from the Greek "oikonomia" (oikos = house + nomos = law/management). In the ancient New Testament world, an "oikonomos" was not the owner of the estate, but a trusted steward hired to manage resources for the welfare of the household. Therefore, from a Christian perspective, an entrepreneur or investor is never an absolute monarch over their wealth, but an accountable manager reporting to the ultimate Landowner.',
        timestamp: 1726800000000,
      },
      {
        id: 'c-note-2',
        title: 'The Danger of Mammon: Idolatry vs. Instrument',
        passageRef: 'Matthew 6:24',
        authorOrSource: 'Biblical Hermeneutics',
        content:
          'Jesus personifies wealth as "Mammon" (Aramaic for riches/property), placing it in direct rivalry with God. Money possesses a spiritual gravity that demands trust, loyalty, and worship. The solution proposed in Scripture is not necessarily destitution, but radical generosity: by freely giving money away to those who cannot repay you, you break money’s hold over your soul and transform a potential idol into an instrument of love.',
        timestamp: 1726801000000,
      },
    ],
  },

  islam: {
    id: 'islam',
    name: 'Islam',
    emblem: '☪️',
    tradition: 'Quranic Revelation & Prophetic Sunnah',
    sacredTextName: 'The Holy Qur’an & Sahih Hadith',
    tagline: 'Submission to Allah, Justice (Adl), Purification through Zakat, and Excellence (Ihsan)',
    frontPageExplanation:
      'In Islam, absolute sovereignty over all wealth and provision belongs to Allah alone (Surah Al-Hadid 57:7). Humans hold material possessions as a sacred trust (Amanah). Wealth must be earned through lawful (Halal) means, free from usury/interest (Riba), deception (Gharar), and exploitation. Zakat (compulsory purifying almsgiving) is one of the Five Pillars of Islam, purifying both the wealth and the soul from greed. Islam introduces the sacred rhythm of the Five Daily Prayers (Fajr, Dhuhr, Asr, Maghrib, Isha), turning the heart toward the Creator throughout the day.',
    teachingsOnWealth:
      'Money is a means to achieve social justice, support one’s family, and uplift the poor. Hoarding gold and silver without giving due charity is severely warned against, while generous voluntary charity (Sadaqah) multiplies blessings tenfold.',
    coreDesiresSummary:
      'The Five Daily Prayers (Salah), Zakat (2.5% wealth purification), Halal Trade & Honest Measures, Shukr (Gratitude) & Contentment.',
    defaultPrayers: [
      {
        id: 'i-fajr',
        name: 'Fajr (Dawn Prayer)',
        arabicOrNativeName: 'صلاة الفجر',
        standardTime: '05:15',
        scheduledTime: '05:15',
        windowLabel: 'Pre-Dawn / Awakening',
        enabled: true,
        scriptureText:
          'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ. الرَّحْمَٰنِ الرَّحِيمِ. مَالِكِ يَوْمِ الدِّينِ. إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ. اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ.',
        englishTranslation:
          'In the name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path. (Surah Al-Fatihah)',
        guidance:
          'Wake early before the sunrise. Wash with ablution (Wudu). Center the soul on the Creator before any worldly trade begins. The Prophet (pbuh) said: "The two rak’ahs of Fajr are better than the world and all that is in it."',
      },
      {
        id: 'i-dhuhr',
        name: 'Dhuhr (Noon Prayer)',
        arabicOrNativeName: 'صلاة الظهر',
        standardTime: '12:30',
        scheduledTime: '12:30',
        windowLabel: 'Midday Zenith',
        enabled: true,
        scriptureText:
          'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ. لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
        englishTranslation:
          'O Allah, You are Peace, and from You comes peace; Blessed are You, O Possessor of majesty and honor. There is no deity except Allah alone, without partner; to Him belongs all sovereignty, and to Him belongs all praise, and He is over all things omnipotent.',
        guidance:
          'Pause trading and operations as the sun passes the meridian. Wash away the stress of work and stand before Allah in humble adoration.',
      },
      {
        id: 'i-asr',
        name: 'Asr (Afternoon Prayer)',
        arabicOrNativeName: 'صلاة العصر',
        standardTime: '16:00',
        scheduledTime: '16:00',
        windowLabel: 'Late Afternoon',
        enabled: true,
        scriptureText:
          'وَالْعَصْرِ. إِنَّ الْإِنسَانَ لَفِي خُسْرٍ. إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ.',
        englishTranslation:
          'By time! Indeed, mankind is in loss, Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience. (Surah Al-Asr 103:1-3)',
        guidance:
          'The shadow lengthens as the workday nears completion. Guard the middle prayer (Asr) diligently. Reflect on how time is slipping away.',
      },
      {
        id: 'i-maghrib',
        name: 'Maghrib (Sunset Prayer)',
        arabicOrNativeName: 'صلاة المغرب',
        standardTime: '18:45',
        scheduledTime: '18:45',
        windowLabel: 'Sunset Dusk',
        enabled: true,
        scriptureText:
          'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا.',
        englishTranslation:
          'O Allah, I ask You for knowledge that is beneficial, provision that is pure and lawful (Tayyib), and deeds that are accepted.',
        guidance:
          'As the sun sinks below the horizon, give thanks for the sustenance provided during the day. Reconnect with family and loved ones in gratitude.',
      },
      {
        id: 'i-isha',
        name: 'Isha (Night Prayer)',
        arabicOrNativeName: 'صلاة العشاء',
        standardTime: '20:15',
        scheduledTime: '20:15',
        windowLabel: 'Night Sky',
        enabled: true,
        scriptureText:
          'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ... رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا.',
        englishTranslation:
          'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers... Our Lord, do not impose blame upon us if we have forgotten or erred... (Surah Al-Baqarah 2:285-286)',
        guidance:
          'Conclude the day’s activities with the night prayer. Ask for forgiveness for any shortcomings, unfair words, or hasty decisions made during business.',
      },
    ],
    initialDesires: [
      {
        id: 'i-desire-zakat',
        name: 'Fulfill Zakat (Wealth Purification)',
        category: 'charity',
        description: 'Give the obligatory annual 2.5% of surplus wealth to the poor and needy to purify your assets.',
        scriptureAnchor: 'Surah At-Tawbah 9:60 & Surah Al-Baqarah 2:43',
        currentProgress: 0,
        targetGoal: 10000,
        unit: 'USD Given',
        isFulfilled: false,
        rewardSerenity: 25,
        actionLabel: 'Pay $2,500 Zakat & Sadaqah to Relief Fund',
        actionCostCash: 2500,
      },
      {
        id: 'i-desire-halal',
        name: 'Strict Halal Enterprise & Fair Weights',
        category: 'integrity',
        description: 'Give full measure, avoid usurious exploitation (Riba), and honor all contractual agreements faithfully.',
        scriptureAnchor: 'Surah Al-Mutaffifin 83:1-3 & Surah Al-Isra 17:35',
        currentProgress: 1,
        targetGoal: 1,
        unit: 'Pledge Kept',
        isFulfilled: true,
        rewardSerenity: 20,
        actionLabel: 'Verify Ethical Halal Compliance',
      },
      {
        id: 'i-desire-shukr',
        name: 'Cultivate Shukr (Gratitude) & Dhikr',
        category: 'contemplation',
        description: 'Avoid arrogance or boasting about wealth; recognize that provision (Rizq) is apportioned by God.',
        scriptureAnchor: 'Surah Ibrahim 14:7 ("If you are grateful, I will surely increase you")',
        currentProgress: 0,
        targetGoal: 5,
        unit: 'Dhikr Reflections',
        isFulfilled: false,
        rewardSerenity: 20,
        actionLabel: 'Recite SubhanAllah, Alhamdulillah, Allahu Akbar',
      },
      {
        id: 'i-desire-prayers',
        name: 'Establish the Five Daily Prayers (Salah)',
        category: 'service',
        description: 'Complete all five daily prayers in their appointed time windows.',
        scriptureAnchor: 'Surah An-Nisa 4:103 ("Indeed, prayer has been decreed upon the believers at specified times")',
        currentProgress: 0,
        targetGoal: 5,
        unit: 'Prayers Performed',
        isFulfilled: false,
        rewardSerenity: 25,
      },
    ],
    inGameScriptures: [
      {
        id: 'i-scrip-1',
        reference: 'Surah Al-Baqarah 2:261, 267',
        title: 'The Multiplied Grain of Charitable Spending',
        originalOrPhonetic: 'مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ',
        text: 'The example of those who spend their wealth in the way of Allah is like a seed of grain which grows seven spikes; in each spike is a hundred grains. And Allah multiplies [His reward] for whom He wills. And Allah is all-Encompassing and Knowing... O you who have believed, spend from the good things which you have earned and from that which We have produced for you from the earth.',
        topic: 'Charity & Mercy',
        themeSummary: 'Giving for the sake of God multiplies goodness exponentially, enriching community and spirit.',
      },
      {
        id: 'i-scrip-2',
        reference: 'Surah Al-Qasas 28:77',
        title: 'Seeking the Hereafter through Worldly Provision',
        text: 'But seek, with that [wealth] which Allah has bestowed upon you, the home of the Hereafter; and do not neglect your portion of lawful enjoyment in this world, and do good as Allah has been good to you, and desire not corruption in the land. Indeed, Allah does not like corrupters.',
        topic: 'Wealth & Stewardship',
        themeSummary: 'Wealth should be channeled into eternal good works without causing environmental or social corruption.',
      },
      {
        id: 'i-scrip-3',
        reference: 'Surah Al-Kahf 18:46',
        title: 'Wealth and Children vs. Enduring Good Deeds',
        text: 'Wealth and children are but an adornment of the life of this world. But the enduring good deeds are better to your Lord for reward and better for [one’s] hope.',
        topic: 'Peace & Contentment',
        themeSummary: 'Transient material luxury must never eclipse everlasting spiritual deeds of righteousness.',
      },
      {
        id: 'i-scrip-4',
        reference: 'Surah Al-Hadid 57:7',
        title: 'Trustees of Entrusted Wealth',
        text: 'Believe in Allah and His Messenger and spend out of that in which He has made you trustees. For those who have believed among you and spent, there will be a great reward.',
        topic: 'Wealth & Stewardship',
        themeSummary: 'Humans are not owners, but trustees of God’s provision, obligated to share with others.',
      },
      {
        id: 'i-scrip-5',
        reference: 'Sahih al-Bukhari 2076 & Sahih Muslim 1060',
        title: 'Prophetic Guidance on Trade and Riches of the Soul',
        text: 'The Prophet Muhammad (peace be upon him) said: "The truthful and trustworthy merchant will be with the prophets, the righteous, and the martyrs on the Day of Judgment." And he said: "Richness is not in the abundance of worldly goods; true richness is the richness of the soul (contentment)."',
        topic: 'Honesty & Labor',
        themeSummary: 'Integrity in business elevates the merchant; true wealth is inner peace and contentment.',
      },
    ],
    reputableStudyLinks: [
      {
        id: 'i-link-1',
        name: 'Quran.com (The Noble Quran Digital Platform)',
        url: 'https://quran.com',
        description:
          'World-standard free digital Quran portal featuring clear English translations (Saheeh International, Clear Quran by Dr. Mustafa Khattab), word-by-word Arabic grammar, audio recitations, and classical tafsir (Ibn Kathir, Al-Jalalayn).',
        badge: 'Premier Academic Quran Portal',
        recommendedChapters: ['Surah Al-Baqarah (2)', 'Surah Al-Kahf (18)', 'Surah Al-Mulk (67)', 'Surah Al-Waqi’ah (56)'],
        authorityNotes: 'Maintained by an international non-profit team of scholars and engineers, verified for zero commercial ads.',
      },
      {
        id: 'i-link-2',
        name: 'Sunnah.com (Hadith Concordance & Prophetic Traditions)',
        url: 'https://sunnah.com',
        description:
          'Comprehensive scholarly database of authentic Prophetic Hadith collections including Sahih al-Bukhari, Sahih Muslim, Sunan an-Nasa’i, and Jami` at-Tirmidhi with Arabic text and verified English translations.',
        badge: 'Authentic Hadith Database',
        recommendedChapters: ['Book of Sales and Trade (Bukhari)', 'Book of Zakat (Muslim)', 'Book of Asceticism (Zuhd)'],
        authorityNotes: 'Widely cited by Islamic jurists and academic university departments of Near Eastern studies.',
      },
      {
        id: 'i-link-3',
        name: 'Corpus Quran (University of Leeds Arabic Grammar)',
        url: 'https://corpus.quran.com',
        description:
          'Academic linguistic research project exploring the grammar, morphology, syntax, and ontology of the Arabic Quranic text.',
        badge: 'Academic Linguistic Corpus',
        recommendedChapters: ['Grammar of Surah 57:7 (Trusteeship)', 'Syntax of economic justice verses in Surah 2'],
        authorityNotes: 'Developed under the direction of the University of Leeds School of Computing.',
      },
    ],
    scholarlyStudyNotes: [
      {
        id: 'i-note-1',
        title: 'The Concept of Amanah (Sacred Trust) in Islamic Economics',
        passageRef: 'Surah Al-Hadid 57:7 & Surah An-Nisa 4:58',
        authorOrSource: 'Classical Islamic Jurisprudence (Fiqh al-Mu’amalat)',
        content:
          'In Islamic jurisprudence, private property is protected, yet strictly defined as a secondary stewardship (Istikhlaf). The primary owner is Allah (Lillahi ma fi as-samawati wa ma fil-ard). This theological principle has profound economic consequences: because the wealth is not intrinsically ours, we have no moral right to hoard it, exploit vulnerable workers, charge usury, or squander it on sinful extravagance (Israf).',
        timestamp: 1726802000000,
      },
      {
        id: 'i-note-2',
        title: 'Zakat: Social Equilibrium and the Eradication of Greed',
        passageRef: 'Surah At-Tawbah 9:103',
        authorOrSource: 'Socio-Economic Tafsir',
        content:
          'The linguistic root of Zakat signifies both "purification" and "growth". By setting aside 2.5% of stagnant capital and distributing it to the eight designated categories of recipients (primarily the impoverished, destitute, and indebted), wealth is prevented from circulating merely among the rich (Surah 59:7). It cleanses the giver’s heart of stinginess and fosters mutual brotherhood rather than class resentment.',
        timestamp: 1726803000000,
      },
    ],
  },

  judaism: {
    id: 'judaism',
    name: 'Judaism',
    emblem: '✡️',
    tradition: 'Torah, Tanakh & Talmudic Wisdom',
    sacredTextName: 'The Tanakh (Torah, Prophets, Writings) & Talmud',
    tagline: 'Covenant, Justice, Tikkun Olam (Repairing the World), and Sacred Tzedakah',
    frontPageExplanation:
      'In Judaism, the material world is not rejected as unholy, but sanctified through righteous action (Mitzvot). Wealth is welcomed as a blessing when partnered with justice and compassion. Tzedakah—often translated as charity—stems from the Hebrew root "Tzedek", meaning righteousness or justice. Giving to the poor is not an optional emotional impulse, but an essential moral duty to restore balance to God’s world. The Jewish day is sanctified by the three daily prayers (Shacharit, Mincha, Maariv) and crowned by the weekly Shabbat, when all commercial enterprise ceases in honor of creation.',
    teachingsOnWealth:
      'Honest business dealings are paramount: the Talmud states that the very first question a person is asked in the heavenly court is "Did you conduct your business honestly?" (Shabbat 31a). Wealth must build community and redeem the oppressed.',
    coreDesiresSummary:
      'Tzedakah (10-20% charity), Tikkun Olam (Social Justice), Integrity in weights and measures, Shabbat Sanctification & Torah Study.',
    defaultPrayers: [
      {
        id: 'j-shacharit',
        name: 'Shacharit (Morning Service & Shema)',
        arabicOrNativeName: 'תפילת שחרית',
        standardTime: '07:00',
        scheduledTime: '07:00',
        windowLabel: 'Morning Dawn',
        enabled: true,
        scriptureText:
          'שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד. וְאָהַבְתָּ אֵת יְהוָה אֱלֹהֶיךָ בְּכָל לְבָבְךָ וּבְכָל נַפְשְׁךָ וּבְכָל מְאֹדֶךָ.',
        englishTranslation:
          'Hear, O Israel: the LORD our God, the LORD is One. And you shall love the LORD your God with all your heart, and with all your soul, and with all your might. (Deuteronomy 6:4-5)',
        guidance:
          'Begin the day by proclaiming divine unity and love. Dedicate the strength of your hands and your intellect to ethical labor today.',
      },
      {
        id: 'j-mincha',
        name: 'Mincha (Afternoon Service)',
        arabicOrNativeName: 'תפילת מנחה',
        standardTime: '14:30',
        scheduledTime: '14:30',
        windowLabel: 'Afternoon Interlude',
        enabled: true,
        scriptureText:
          'אַשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ עוֹד יְהַלְלוּךָ סֶּלָה. אַשְׁרֵי הָעָם שֶׁכָּכָה לּוֹ אַשְׁרֵי הָעָם שֶׁיְהוָה אֱלֹהָיו.',
        englishTranslation:
          'Happy are they who dwell in Your house; they will yet praise You, Selah. Happy is the people for whom it is so; happy is the people whose God is the LORD. (Psalm 144:15 & 84:5)',
        guidance:
          'Mincha is celebrated during the peak rush of business. Pausing worldly negotiations to stand in silent Amidah prayer exemplifies mastering one’s ego and trusting Providence.',
      },
      {
        id: 'j-maariv',
        name: 'Maariv (Evening Service & Hashkiveinu)',
        arabicOrNativeName: 'תפילת ערבית',
        standardTime: '19:30',
        scheduledTime: '19:30',
        windowLabel: 'Nightfall Stars',
        enabled: true,
        scriptureText:
          'הַשְׁכִּיבֵנוּ יְהוָה אֱלֹהֵינוּ לְשָׁלוֹם וְהַעֲמִידֵנוּ מַלְכֵּנוּ לְחַיִּים, וּפְרוֹשׂ עָלֵינוּ סֻכַּת שְׁלוֹמֶךָ.',
        englishTranslation:
          'Cause us, O LORD our God, to lie down in peace, and raise us up, our King, to life. Spread over us the shelter of Your peace.',
        guidance:
          'Reflect on the day’s deeds as night falls. Pray for peace across all communities and shelter from anxiety.',
      },
    ],
    initialDesires: [
      {
        id: 'j-desire-tzedakah',
        name: 'Practice Tzedakah & Gemilut Chasadim',
        category: 'charity',
        description: 'Give generously to help the impoverished sustain themselves independently (Maimonides’ Highest Ladder of Charity).',
        scriptureAnchor: 'Deuteronomy 15:7-8 & Mishneh Torah',
        currentProgress: 0,
        targetGoal: 10000,
        unit: 'USD Given',
        isFulfilled: false,
        rewardSerenity: 25,
        actionLabel: 'Disburse $2,500 Tzedakah Community Grant',
        actionCostCash: 2500,
      },
      {
        id: 'j-desire-scales',
        name: 'Uncompromising Integrity in Commerce',
        category: 'integrity',
        description: 'Never practice misrepresentation, unfair pricing, or delayed payment to day laborers.',
        scriptureAnchor: 'Leviticus 19:35-36 ("Just balances, just weights shall ye have")',
        currentProgress: 1,
        targetGoal: 1,
        unit: 'Pledge Kept',
        isFulfilled: true,
        rewardSerenity: 20,
        actionLabel: 'Certify Fair Ethical Ledger',
      },
      {
        id: 'j-desire-shabbat',
        name: 'Guard and Sanctify the Shabbat',
        category: 'contemplation',
        description: 'Cease all commercial transactions and emails for a period of holy rest, study, and family table.',
        scriptureAnchor: 'Exodus 31:16-17',
        currentProgress: 0,
        targetGoal: 1,
        unit: 'Shabbat Observed',
        isFulfilled: false,
        rewardSerenity: 25,
        actionLabel: 'Light Shabbat Candles & Rest',
      },
    ],
    inGameScriptures: [
      {
        id: 'j-scrip-1',
        reference: 'Deuteronomy 15:7-11',
        title: 'Opening Your Hand to the Poor',
        text: 'If there be among you a poor man of one of thy brethren within any of thy gates in thy land which the Lord thy God giveth thee, thou shalt not harden thine heart, nor shut thine hand from thy poor brother: But thou shalt open thine hand wide unto him, and shalt surely lend him sufficient for his need, in that which he wanteth... For the poor shall never cease out of the land: therefore I command thee, saying, Thou shalt open thine hand wide unto thy brother, to thy poor, and to thy needy, in thy land.',
        topic: 'Charity & Mercy',
        themeSummary: 'Generosity is a binding commandment; closing one’s fist to the poor violates the covenant.',
      },
      {
        id: 'j-scrip-2',
        reference: 'Micah 6:8',
        title: 'What the Lord Requires of You',
        text: 'He hath shewed thee, O man, what is good; and what doth the Lord require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?',
        topic: 'Universal Justice',
        themeSummary: 'God values justice, mercy, and humility far above outward wealth or extravagant sacrifice.',
      },
      {
        id: 'j-scrip-3',
        reference: 'Pirkei Avot (Ethics of the Fathers) 4:1 & 2:16',
        title: 'True Wealth & Completing the Work',
        text: 'Ben Zoma said: Who is rich? He who rejoices in his portion, as it is stated (Psalm 128:2): "When you eat the labor of your hands, you shall be happy and it shall be well with you." Rabbi Tarfon said: The day is short, the labor is vast, the workers are sluggish, the reward is great, and the Master is pressing. It is not your duty to finish the work, but neither are you at liberty to neglect it.',
        topic: 'Peace & Contentment',
        themeSummary: 'True wealth is gratitude for what you have; we must labor tirelessly for the betterment of humanity.',
      },
      {
        id: 'j-scrip-4',
        reference: 'Psalm 24:1-5',
        title: 'The Earth is the Lord’s',
        text: 'The earth is the Lord’s, and the fulness thereof; the world, and they that dwell therein. For he hath founded it upon the seas, and established it upon the floods. Who shall ascend into the hill of the Lord? or who shall stand in his holy place? He that hath clean hands, and a pure heart; who hath not lifted up his soul unto vanity, nor sworn deceitfully.',
        topic: 'Wealth & Stewardship',
        themeSummary: 'The entire planet belongs to God; those who prosper must do so with clean hands and honest dealings.',
      },
    ],
    reputableStudyLinks: [
      {
        id: 'j-link-1',
        name: 'Sefaria.org (The Living Library of Jewish Texts)',
        url: 'https://www.sefaria.org',
        description:
          'The premier open-source digital library of Jewish texts: bilingual Hebrew-English Tanakh, Talmud Bavli, Midrash, Mishneh Torah, Shulchan Aruch, and contemporary ethical commentaries.',
        badge: 'Premier Open Jewish Archive',
        recommendedChapters: ['Pirkei Avot (Ethics of the Fathers)', 'Mishneh Torah: Laws of Gifts to the Poor', 'Deuteronomy 15'],
        authorityNotes: 'Universal open-access scholarship trusted by major yeshivas, universities, and educators globally.',
      },
      {
        id: 'j-link-2',
        name: 'Chabad.org Jewish Texts & Philosophy Library',
        url: 'https://www.chabad.org/library',
        description:
          'Deep repository of Jewish spiritual thought, daily Torah portions (Chitas), Tanya, and practical ethical guides to commerce and tzedakah.',
        badge: 'Comprehensive Spiritual Library',
        recommendedChapters: ['Daily Torah study', 'Maimonides’ Eight Levels of Charity', 'Ethics of Business in Halakha'],
        authorityNotes: 'One of the most visited global resources for Jewish learning and inspiration.',
      },
    ],
    scholarlyStudyNotes: [
      {
        id: 'j-note-1',
        title: 'Maimonides’ Eight Levels of Tzedakah',
        passageRef: 'Mishneh Torah, Hilchot Matnot Aniyim 10:7-14',
        authorOrSource: 'Rambam (Maimonides) Legal Philosophy',
        content:
          'Maimonides codified the famous eight rungs of charity. The highest level of all is not handing out food to a beggar, but entering into a business partnership, granting an interest-free loan, or finding employment for someone so that they become self-sufficient and never need to ask for charity again. In Jewish thought, preserving human dignity is the pinnacle of philanthropy.',
        timestamp: 1726804000000,
      },
    ],
  },

  hinduism: {
    id: 'hinduism',
    name: 'Hinduism (Sanatana Dharma)',
    emblem: '🕉️',
    tradition: 'Vedic Wisdom, Upanishads & Bhagavad Gita',
    sacredTextName: 'The Bhagavad Gita, Upanishads & Vedas',
    tagline: 'Dharma (Righteousness), Artha (Prosperity), Nishkama Karma (Selfless Action), and Moksha',
    frontPageExplanation:
      'Sanatana Dharma recognizes material prosperity (Artha) as one of the four legitimate goals of human life (Purusharthas), but it must always be anchored within Dharma (moral duty, cosmic order, and righteous conduct). In the Bhagavad Gita, Lord Krishna teaches the path of Nishkama Karma: working with utmost excellence and dedication, yet relinquishing obsessive clinging to the fruits of action. Wealth acquired righteously is shared through Dāna (charity) to sustain the cosmic order (Yajna). The sacred Gayatri Mantra and dawn/dusk Sandhya prayers align human consciousness with the cosmic divine light.',
    teachingsOnWealth:
      'Wealth must be earned through pure means without harming living beings (Ahimsa). When hoarded out of greed (Lobha), it binds the soul to samsara; when circulated in service of society and nature, it becomes a sacred offering.',
    coreDesiresSummary:
      'Nishkama Karma (Duty without selfish clinging), Dāna (Charity to the deserving), Satya & Dharma in commerce, Daily Gayatri Meditation.',
    defaultPrayers: [
      {
        id: 'h-morning',
        name: 'Pratah Sandhya & Gayatri Mantra',
        arabicOrNativeName: 'गायत्री मन्त्र',
        standardTime: '06:00',
        scheduledTime: '06:00',
        windowLabel: 'Dawn Sunrise (Brahma Muhurta)',
        enabled: true,
        scriptureText:
          'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
        englishTranslation:
          'Om, the physical, mental, and celestial realms. Let us meditate on the radiant glory of that divine Sun, the Creator. May that Supreme Light illuminate and inspire our intellect toward righteousness. (Rig Veda 3.62.10)',
        guidance:
          'Sit facing east at dawn. Close your eyes, chant the sacred syllable Om, and repeat the Gayatri mantra. Pray that your intelligence today is guided by wisdom and universal compassion.',
      },
      {
        id: 'h-noon',
        name: 'Madhyahnika & Shanti Mantra',
        arabicOrNativeName: 'शान्ति मन्त्र',
        standardTime: '12:00',
        scheduledTime: '12:00',
        windowLabel: 'Solar Zenith',
        enabled: true,
        scriptureText:
          'ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै । तेजस्वि नावधीतमस्तु मा विद्विषावहै । ॐ शान्तिः शान्तिः शान्तिः ॥',
        englishTranslation:
          'Om. May the Divine protect us both together. May we be nourished together. May we work together with great energy. May our study be brilliant and effective. May there be no enmity or hatred among us. Om Peace, Peace, Peace. (Taittiriya Upanishad)',
        guidance:
          'A prayer for cooperative teamwork and harmony in your enterprises. Release competitive bitterness and invoke peace for all beings.',
      },
      {
        id: 'h-evening',
        name: 'Sayan Sandhya & Maha Mrityunjaya',
        arabicOrNativeName: 'महामृत्युंजय मन्त्र',
        standardTime: '18:30',
        scheduledTime: '18:30',
        windowLabel: 'Sunset Dusk',
        enabled: true,
        scriptureText:
          'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
        englishTranslation:
          'Om. We worship the Three-Eyed One, who is fragrant and who nourishes and nurtures all beings. As the ripe cucumber is liberated from its stem, so may we be freed from the bondage of death and mortality into immortality.',
        guidance:
          'Contemplate the sunset. Acknowledge that bodily life and worldly empires are impermanent. Seek liberation from fear and inner attachment.',
      },
    ],
    initialDesires: [
      {
        id: 'h-desire-dana',
        name: 'Practice Sattvic Dāna (Selfless Giving)',
        category: 'charity',
        description: 'Give charity at the right place, at the right time, to a worthy recipient, expecting nothing in return.',
        scriptureAnchor: 'Bhagavad Gita 17:20',
        currentProgress: 0,
        targetGoal: 10000,
        unit: 'USD Given',
        isFulfilled: false,
        rewardSerenity: 25,
        actionLabel: 'Perform $2,500 Dāna Charity Offering',
        actionCostCash: 2500,
      },
      {
        id: 'h-desire-karma',
        name: 'Practice Nishkama Karma in Work',
        category: 'integrity',
        description: 'Dedicate all work as an offering to the Divine, freeing your mind from anxious craving over outcomes.',
        scriptureAnchor: 'Bhagavad Gita 2:47 ("Your right is to work only, never to its fruits")',
        currentProgress: 1,
        targetGoal: 1,
        unit: 'Consciousness Aligned',
        isFulfilled: true,
        rewardSerenity: 20,
        actionLabel: 'Dedicate Labor to the Supreme',
      },
      {
        id: 'h-desire-aparigraha',
        name: 'Aparigraha (Non-Possessiveness & Restraint)',
        category: 'moderation',
        description: 'Do not hoard more than what is needed for life and duty. Guard against insatiable greed (Lobha).',
        scriptureAnchor: 'Yoga Sutras 2:39 & Isha Upanishad 1',
        currentProgress: 0,
        targetGoal: 3,
        unit: 'Contemplations',
        isFulfilled: false,
        rewardSerenity: 20,
      },
    ],
    inGameScriptures: [
      {
        id: 'h-scrip-1',
        reference: 'Bhagavad Gita 2:47',
        title: 'The Science of Selfless Action (Karma Yoga)',
        text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥\nYou have a right to perform your prescribed duty, but never to the fruits of action. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.',
        topic: 'Honesty & Labor',
        themeSummary: 'Focus on mastery and ethical diligence; do not let your inner peace depend on volatile results.',
      },
      {
        id: 'h-scrip-2',
        reference: 'Bhagavad Gita 17:20',
        title: 'Sattvic (Pure) Charity',
        text: 'दातव्यमिति यद्दानं दीयतेऽनुपकारिणे । देशे काले च पात्रे च तद्दानं सात्त्विकं स्मृतम् ॥\nCharity given to a deserving person simply because it is right to give, at an auspicious place and time, without expectation of any return or reward, is considered Sattvic (pure).',
        topic: 'Charity & Mercy',
        themeSummary: 'Pure giving is performed with humility, without seeking fame, tax games, or reciprocal favors.',
      },
      {
        id: 'h-scrip-3',
        reference: 'Isha Upanishad 1',
        title: 'Enjoy with Detachment: The Universe Belongs to God',
        text: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥\nAll this—whatever exists in this changing universe—is enveloped by the Supreme Lord. Therefore, find your enjoyment through renunciation and detachment. Do not covet the wealth of anyone.',
        topic: 'Wealth & Stewardship',
        themeSummary: 'Recognize the divine presence in all creation; enjoy earthly blessings without greed or coveting.',
      },
      {
        id: 'h-scrip-4',
        reference: 'Rig Veda 10.117.5',
        title: 'The Wheel of Fortune and Feeding the Hungry',
        text: 'Let the wealthy man satisfy the needy person, and let him keep his eye on the longer pathway. For riches roll like the wheels of a chariot: they come now to one, now to another. The stranger and the poor man are your brothers.',
        topic: 'Universal Justice',
        themeSummary: 'Fortunes rise and fall like chariot wheels; those who are wealthy today must feed the hungry.',
      },
    ],
    reputableStudyLinks: [
      {
        id: 'h-link-1',
        name: 'Holy-Bhagavad-Gita.org (Swami Mukundananda Commentary)',
        url: 'https://www.holy-bhagavad-gita.org',
        description:
          'Exhaustive verse-by-verse translation, Sanskrit recitation audio, word meanings, and lucid English commentary on all 700 verses of the Bhagavad Gita.',
        badge: 'Premier Gita Study Guide',
        recommendedChapters: ['Chapter 2 (Sankhya Yoga)', 'Chapter 3 (Karma Yoga)', 'Chapter 17 (Three Types of Faith & Charity)'],
        authorityNotes: 'Accessible, scholarly, and widely referenced across educational and spiritual institutions.',
      },
      {
        id: 'h-link-2',
        name: 'Vedabase.io (Authentic Vedic Text Archive)',
        url: 'https://vedabase.io',
        description:
          'Comprehensive digital library of Vedic scriptures including Bhagavad Gita As It Is, Srimad Bhagavatam, and Sri Chaitanya Charitamrita with full word-for-word Sanskrit breakdowns.',
        badge: 'Word-for-Word Sanskrit Lexicon',
        recommendedChapters: ['Bhagavad Gita Chapter 2 & 17', 'Isopanisad (Mantra 1)'],
        authorityNotes: 'Maintained for over five decades by international Sanskrit scholars.',
      },
      {
        id: 'h-link-3',
        name: 'IIT Kanpur Gita Supersite (Academic Multilingual Portal)',
        url: 'https://www.gitasupersite.iitk.ac.in',
        description:
          'Indian Institute of Technology academic archive featuring parallel classical commentaries (Adi Shankara, Ramanuja, Madhva) and English translations.',
        badge: 'Academic Research Portal',
        recommendedChapters: ['Gita Chapter 2:47 commentary comparison', 'Chapter 18'],
        authorityNotes: 'Directly supported by the Ministry of Education and leading Indian universities.',
      },
    ],
    scholarlyStudyNotes: [
      {
        id: 'h-note-1',
        title: 'The Four Purusharthas: Integrating Artha within Dharma',
        passageRef: 'Mahabharata, Shanti Parva & Manusmriti',
        authorOrSource: 'Classical Vedic Sociology',
        content:
          'Hinduism does not advocate monastic poverty for householders. A householder (Grihastha) is expected to generate wealth (Artha) to support students, ascetics, children, and temples. However, Artha without Dharma (righteousness) leads to demonic greed (Asuric tendencies), destroying character and society. When prosperity serves Dharma, it becomes a stepping stone to final spiritual liberation (Moksha).',
        timestamp: 1726805000000,
      },
    ],
  },

  buddhism: {
    id: 'buddhism',
    name: 'Buddhism',
    emblem: '☸️',
    tradition: 'Noble Eightfold Path & Middle Way',
    sacredTextName: 'The Tripitaka (Pali Canon) & Dhammapada',
    tagline: 'Mindfulness, Dāna (Generosity), Samma Ajiva (Right Livelihood), and Freedom from Craving',
    frontPageExplanation:
      'In Buddhist philosophy, wealth is neither inherently evil nor an ultimate refuge. The root of suffering (Dukkha) is craving (Tanha) and clinging (Upadana). When wealth is accumulated through Right Livelihood (Samma Ajiva)—avoiding trades in weapons, living beings, meat, intoxicants, or poisons—and is spent generously (Dāna) to relieve suffering, it becomes an auspicious vehicle for wholesome merit. The Buddha gave practical teachings to laypeople on budgeting, honest entrepreneurship, and cultivating an unshakeable mind through daily meditation and loving-kindness (Metta).',
    teachingsOnWealth:
      'Wealth should be used to provide for family, assist workers, protect against misfortune, and support spiritual seekers. Clinging to money as a permanent anchor is a delusion, for all conditioned phenomena are impermanent (Anicca).',
    coreDesiresSummary:
      'Dāna (Open-Hearted Generosity), Samma Ajiva (Harmless Trade), Metta (Loving-Kindness for All Sentient Beings), Mindfulness Meditation.',
    defaultPrayers: [
      {
        id: 'b-morning',
        name: 'Morning Chanting & Triple Gem Refuge',
        arabicOrNativeName: 'Tiratana Vandana & Five Precepts',
        standardTime: '06:30',
        scheduledTime: '06:30',
        windowLabel: 'Morning Stillness',
        enabled: true,
        scriptureText:
          'Buddhaṃ saraṇaṃ gacchāmi. Dhammaṃ saraṇaṃ gacchāmi. Saṅghaṃ saraṇaṃ gacchāmi.\n(I go to the Buddha for refuge. I go to the Dhamma for refuge. I go to the Sangha for refuge.)',
        englishTranslation:
          'The fundamental Buddhist affirmation taking refuge in Awakened Wisdom (Buddha), the Truth of Nature (Dhamma), and the Noble Spiritual Community (Sangha).',
        guidance:
          'Sit in a balanced, upright posture. Focus on the gentle sensation of breath at the tip of the nostrils. Establish tranquility and clarity before starting your day.',
      },
      {
        id: 'b-noon',
        name: 'Midday Mindfulness & Impermanence Reflection',
        arabicOrNativeName: 'Anicca Bhavana',
        standardTime: '12:15',
        scheduledTime: '12:15',
        windowLabel: 'Midday Center',
        enabled: true,
        scriptureText:
          'Sabbe sankhara anicca. Sabbe sankhara dukkha. Sabbe dhamma anatta.\n(All conditioned things are impermanent. All conditioned things are subject to suffering. All phenomena are without intrinsic ego or self.)',
        englishTranslation:
          'The Three Marks of Existence from the Dhammapada. Frees the mind from clinging to transitory market fluctuations or stress.',
        guidance:
          'Pause in the middle of trading. Observe thoughts rising and passing away like clouds. Remember that profits and losses are passing phenomena.',
      },
      {
        id: 'b-evening',
        name: 'Evening Metta Bhavana (Loving-Kindness)',
        arabicOrNativeName: 'Mettā Sutta',
        standardTime: '19:00',
        scheduledTime: '19:00',
        windowLabel: 'Evening Twilight',
        enabled: true,
        scriptureText:
          'Sabbe satta sukhi hontu, sabbe hontu ca khemino, sabbe bhadrani passantu, ma kinci dukkhamagama.\n(May all beings be happy and safe. May all beings have joyful minds. Whatever living beings there may be—weak or strong, long, stout, or small—may all beings be free from suffering.)',
        englishTranslation:
          'Radiating boundless benevolence toward all sentient beings in every direction of the universe.',
        guidance:
          'Radiate warm, unconditional kindness first to yourself, then to your family, your co-workers, and even to competitors or adversaries. Let no ill-will linger.',
      },
    ],
    initialDesires: [
      {
        id: 'b-desire-dana',
        name: 'Cultivate Dāna (Open Generosity)',
        category: 'charity',
        description: 'Give freely to the needy, community shelters, and spiritual sanctuaries to uproot the thorn of greed.',
        scriptureAnchor: 'Itivuttaka 26 & Dhammapada 354',
        currentProgress: 0,
        targetGoal: 10000,
        unit: 'USD Given',
        isFulfilled: false,
        rewardSerenity: 25,
        actionLabel: 'Disburse $2,500 Dāna Relief Fund',
        actionCostCash: 2500,
      },
      {
        id: 'b-desire-livelihood',
        name: 'Uphold Samma Ajiva (Right Livelihood)',
        category: 'integrity',
        description: 'Conduct commerce without weapons, poison, slaughter, intoxicants, or deceitful fraud.',
        scriptureAnchor: 'Vanijja Sutta (Anguttara Nikaya 5.177)',
        currentProgress: 1,
        targetGoal: 1,
        unit: 'Pledge Kept',
        isFulfilled: true,
        rewardSerenity: 20,
        actionLabel: 'Verify Harmless Commerce Audit',
      },
      {
        id: 'b-desire-stillness',
        name: 'Practice Daily Sati (Mindful Awareness)',
        category: 'contemplation',
        description: 'Maintain present-moment awareness, overcoming impulsive anger or reckless speculative gambling.',
        scriptureAnchor: 'Satipatthana Sutta (Majjhima Nikaya 10)',
        currentProgress: 0,
        targetGoal: 3,
        unit: 'Meditations Done',
        isFulfilled: false,
        rewardSerenity: 20,
      },
    ],
    inGameScriptures: [
      {
        id: 'b-scrip-1',
        reference: 'Dhammapada Verses 354-355',
        title: 'The Gift of Truth & Craving Ruins the Fool',
        text: 'The gift of Truth excels all other gifts; the taste of Truth excels all other tastes; the joy of Truth excels all other joys; the destruction of craving conquers all sorrow. Riches ruin the foolish person who seeks not the beyond; through craving for wealth, the fool destroys both himself and others.',
        topic: 'Wealth & Stewardship',
        themeSummary: 'Craving for wealth without wisdom blinds the mind; generosity of truth and resources brings real joy.',
      },
      {
        id: 'b-scrip-2',
        reference: 'Sigalovada Sutta (Digha Nikaya 31)',
        title: 'The Layperson’s Guide to Practical Wealth and Stewardship',
        text: 'The wise layperson who prospers divides their wealth into four portions: one portion for daily living and family needs; two portions to invest and expand their business; and a fourth portion set aside as a reserve against future misfortunes. Such a person prospers like a bee gathering nectar without harming the blossom.',
        topic: 'Honesty & Labor',
        themeSummary: 'Prudent budgeting: enjoy moderately, invest in productive enterprise, maintain reserves, and share with others.',
      },
      {
        id: 'b-scrip-3',
        reference: 'Anana Sutta (Anguttara Nikaya 4.62)',
        title: 'The Four Joys of Wealth for a Layperson',
        text: 'The Buddha taught four kinds of happiness that a householder can experience: Atthi-sukha (the joy of having wealth acquired through honest effort); Bhoga-sukha (the joy of enjoying and sharing wealth with family and friends); Anana-sukha (the joy of being free from debt); and Anavajja-sukha (the supreme joy of blameless, ethical conduct).',
        topic: 'Peace & Contentment',
        themeSummary: 'The highest joy of wealth is not consumption, but ethical conduct and total freedom from debt.',
      },
    ],
    reputableStudyLinks: [
      {
        id: 'b-link-1',
        name: 'AccessToInsight.org (Theravada Buddhist Text Archive)',
        url: 'https://www.accesstoinsight.org',
        description:
          'Longstanding, non-commercial, advertisement-free scholarly library of Pali Canon suttas translated by renowned monastics (Bhikkhu Bodhi, Thanissaro Bhikkhu, Nyanaponika Thera).',
        badge: 'Premier Pali Canon Library',
        recommendedChapters: ['Sigalovada Sutta (Lay Ethics)', 'Dhammapada complete', 'Anana Sutta (Freedom from Debt)'],
        authorityNotes: 'Universal academic reference for early Buddhist philosophy and practical lay guidance.',
      },
      {
        id: 'b-link-2',
        name: 'SuttaCentral.net (Comparative Early Buddhist Texts)',
        url: 'https://suttacentral.net',
        description:
          'Global collaborative repository featuring parallel translations across Pali, Chinese Agamas, Sanskrit fragments, and Tibetan Kangyur.',
        badge: 'Global Comparative Sutta Archive',
        recommendedChapters: ['Majjhima Nikaya', 'Digha Nikaya 31', 'Anguttara Nikaya Book of Fives'],
        authorityNotes: 'Maintained by international Buddhist scholars and research linguistics faculty.',
      },
    ],
    scholarlyStudyNotes: [
      {
        id: 'b-note-1',
        title: 'The Bee and the Flower: The Ethics of Buddhist Enterprise',
        passageRef: 'Dhammapada Verse 49',
        authorOrSource: 'Pali Text Commentary',
        content:
          '"As the bee gathers nectar without harming the color or the fragrance of the flower, and then flies away, so let the wise person live in the village." The Buddha did not teach anti-commercialism; he praised productive enterprise that creates genuine value without depleting natural resources, exploiting workers, or intoxicating consumers.',
        timestamp: 1726806000000,
      },
    ],
  },

  sikhism: {
    id: 'sikhism',
    name: 'Sikhism (Sikhi)',
    emblem: '☬',
    tradition: 'Guru Granth Sahib Ji & Gurmat Wisdom',
    sacredTextName: 'Sri Guru Granth Sahib Ji',
    tagline: 'Naam Japna (Divine Contemplation), Kirat Karo (Honest Labor), and Vand Chhako (Selfless Sharing)',
    frontPageExplanation:
      'Sikhism firmly rejects ascetic renunciation of the world. Guru Nanak taught that true spirituality is lived within society as an active householder (Grasthi). The foundational pillars of Sikh life are Threefold: Naam Japna (remembering the One Creator), Kirat Karo (earning an honest and truthful living through sincere sweat and toil), and Vand Chhako (sharing your wealth and food with the community through Dasvandh—a 10% tithe—and Langar, the free egalitarian kitchen). The Sikh path inspires fearless enterprise, universal equality, and selfless service (Seva).',
    teachingsOnWealth:
      'Wealth earned through exploitation or deceit is like poison; wealth earned through honest toil and shared with the hungry is blessed (Amrit). The Guru taught: "Truth is the highest virtue, but higher still is truthful living."',
    coreDesiresSummary:
      'Kirat Karo (Honest Sweat), Vand Chhako (Sharing via Dasvandh & Langar), Naam Japna (Daily Nitnem Prayers), Seva (Selfless Community Service).',
    defaultPrayers: [
      {
        id: 's-japji',
        name: 'Japji Sahib (Morning Divine Contemplation)',
        arabicOrNativeName: 'ਜਪੁ ਜੀ ਸਾਹਿਬ',
        standardTime: '05:30',
        scheduledTime: '05:30',
        windowLabel: 'Amrit Vela (Ambrosial Dawn)',
        enabled: true,
        scriptureText:
          'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥ ਜਪੁ ॥ ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥ ਹੈ ਭੀ ਸਚੁ ਨਾਨਕ ਹੋਸੀ ਭੀ ਸਚੁ ॥',
        englishTranslation:
          'One Universal Creator God. The Name Is Truth. Creative Being Personified. Without Fear. Without Hatred. Timeless Form. Unborn. Self-Existent. By the Guru’s Grace. Meditate! True in the Primal Beginning. True throughout the Ages. True here and now. O Nanak, God shall forever be True.',
        guidance:
          'Awaken at the ambrosial hours of dawn (Amrit Vela). Bathe and quiet the mind. Recite Japji Sahib to establish fearlessness, humility, and absolute trust in the One.',
      },
      {
        id: 's-rehras',
        name: 'Rehras Sahib (Sunset Evening Prayer)',
        arabicOrNativeName: 'ਰਹਰਾਸਿ ਸਾਹਿਬ',
        standardTime: '18:30',
        scheduledTime: '18:30',
        windowLabel: 'Sunset Evening',
        enabled: true,
        scriptureText:
          'ਸੋ ਦਰੁ ਤੇਰਾ ਕੇਹਾ ਸੋ ਘਰੁ ਕੇਹਾ ਜਿਤੁ ਬਹਿ ਸਰਬ ਸਮਾਲੇ ॥ ਵਾਜੇ ਤੇਰੇ ਨਾਦ ਅਨੇਕ ਅਸੰਖਾ ਕੇਤੇ ਤੇਰੇ ਵਾਵਣਹਾਰੇ ॥',
        englishTranslation:
          'Where is that Gate of Yours, and what is that Home, in which You sit and take care of all? Uncounted musical melodies play there, and countless are the singers who praise You.',
        guidance:
          'As the sun sets and the day’s work concludes, wash hands and face. Recite Rehras Sahib with family or in quiet reflection to wash away fatigue and ego.',
      },
      {
        id: 's-sohila',
        name: 'Kirtan Sohila (Night Bedtime Hymn)',
        arabicOrNativeName: 'ਕੀਰਤਨ ਸੋਹਿਲਾ',
        standardTime: '21:30',
        scheduledTime: '21:30',
        windowLabel: 'Night Rest',
        enabled: true,
        scriptureText:
          'ਸੋਹਿਲਾ ਰਾਗੁ ਗਉੜੀ ਦੀਪਕੀ ਮਹਲਾ ੧ ॥ ਜੈ ਘਰਿ ਕੀਰਤਿ ਆਖੀਐ ਕਰਤੇ ਕਾ ਹੋਇ ਬੀਚਾਰੋ ॥ ਤਿਤੁ ਘਰਿ ਗਾਵਹੁ ਸੋਹਿਲਾ ਸਿਵਰਿਹੁ ਸਿਰਜਣਹਾਰੋ ॥',
        englishTranslation:
          'In that home where praises of the Creator are sung and divine contemplation takes place, sing the song of peace and remember the Maker.',
        guidance:
          'The final prayer before sleep. Banish fear, anxiety, and ego. Rest peacefully in divine embrace.',
      },
    ],
    initialDesires: [
      {
        id: 's-desire-vand',
        name: 'Practice Vand Chhako & Dasvandh (10% Tithe)',
        category: 'charity',
        description: 'Share one-tenth of your honest earnings to fund free community Langar kitchens and medical aid for all people regardless of background.',
        scriptureAnchor: 'Guru Granth Sahib Ang 1245',
        currentProgress: 0,
        targetGoal: 10000,
        unit: 'USD Contributed',
        isFulfilled: false,
        rewardSerenity: 25,
        actionLabel: 'Sponsor $2,500 Community Langar & Free Meals',
        actionCostCash: 2500,
      },
      {
        id: 's-desire-kirat',
        name: 'Kirat Karo (Truthful Honest Labor)',
        category: 'integrity',
        description: 'Earn your livelihood through honest sweat, avoiding exploitation, bribery, and deceitful corner-cutting.',
        scriptureAnchor: 'Guru Granth Sahib Ang 463',
        currentProgress: 1,
        targetGoal: 1,
        unit: 'Pledge Kept',
        isFulfilled: true,
        rewardSerenity: 20,
        actionLabel: 'Audit Honest Business Practices',
      },
      {
        id: 's-desire-seva',
        name: 'Perform Selfless Seva (Community Service)',
        category: 'service',
        description: 'Humble the ego by scrubbing floors, serving food, and assisting the vulnerable without compensation.',
        scriptureAnchor: 'Guru Granth Sahib Ang 26 ("In the midst of this world, do selfless service, and you shall obtain a seat of honor")',
        currentProgress: 0,
        targetGoal: 3,
        unit: 'Seva Acts',
        isFulfilled: false,
        rewardSerenity: 20,
        actionLabel: 'Perform Seva Service Session',
      },
    ],
    inGameScriptures: [
      {
        id: 's-scrip-1',
        reference: 'Guru Granth Sahib Ang 1245',
        title: 'Sharing Honest Bread',
        text: 'ਘਾਲਿ ਖਾਇ ਕਿਛੁ ਹਥਹੁ ਦੇਇ ॥ ਨਾਨਕ ਰਾਹੁ ਪਛਾਣਹਿ ਸੇਇ ॥\nOne who works for what they eat, and gives some of what they have to the needy—O Nanak, that person truly recognizes the spiritual path.',
        topic: 'Charity & Mercy',
        themeSummary: 'The true spiritual path is earning your bread honestly and feeding others from your own hands.',
      },
      {
        id: 's-scrip-2',
        reference: 'Guru Granth Sahib Ang 62',
        title: 'Truthful Living is the Highest',
        text: 'ਸਚਹੁ ਓਰੈ ਸਭੁ ਕੋ ਉਪਰਿ ਸਚੁ ਆਚਾਰੁ ॥\nTruth is the highest virtue, but higher still is truthful living.',
        topic: 'Honesty & Labor',
        themeSummary: 'Theology and words mean nothing without practical, daily ethical action in business and society.',
      },
      {
        id: 's-scrip-3',
        reference: 'Guru Granth Sahib Ang 286 (Sukhmani Sahib)',
        title: 'Wealth is Fleeting; Peace of Mind is Eternal',
        text: 'ਬਿਨੁ ਸਿਮਰਨ ਜੋ ਜੀਵਨੁ ਬਲਨਾ ॥ ਸਰਪ ਜੈਸੇ ਅਰਜਾਰੀ ਕਰਨਾ ॥ ਕਹਾ ਬਿਸਾਸੋ ਇਸ ਭਾਂਡੇ ਕਾ ਇਤਨਕੁ ਲਾਗੈ ਠਨਕਾ ॥\nWithout remembering the Divine, life is like a serpent dragging out its days in a hole. What trust can you place in this fragile clay vessel of a body? A tiny strike, and it shatters. Rely not on worldly vanity.',
        topic: 'Peace & Contentment',
        themeSummary: 'Material glory is fragile and mortal; internal tranquility comes from connection with the Eternal.',
      },
    ],
    reputableStudyLinks: [
      {
        id: 's-link-1',
        name: 'SearchGurbani.com (Complete Sri Guru Granth Sahib)',
        url: 'https://www.searchgurbani.com',
        description:
          'Comprehensive open search portal for Sri Guru Granth Sahib Ji, Dasam Granth, Bhai Gurdas Vaaran, featuring phonetic Gurmukhi, English translations by Sant Singh Khalsa, and musical raag notations.',
        badge: 'Premier Gurbani Search Portal',
        recommendedChapters: ['Japji Sahib complete', 'Sukhmani Sahib (Ang 262-296)', 'Anand Sahib'],
        authorityNotes: 'Widely used worldwide by Sikh gurdwaras, scholars, and interfaith academic researchers.',
      },
      {
        id: 's-link-2',
        name: 'SriGranth.org (Scholarly Cross-Referenced Scripture)',
        url: 'https://www.srigranth.org',
        description:
          'Academic resource providing line-by-line Punjabi Teeka, English translation, and Mahan Kosh encyclopedic dictionary cross-references.',
        badge: 'Academic Gurbani Research',
        recommendedChapters: ['Ang 1 to 14 (Nitnem prayers)', 'Slok Mohalla 1'],
        authorityNotes: 'Dedicated to preserving grammatical and historical accuracy of Gurbani texts.',
      },
    ],
    scholarlyStudyNotes: [
      {
        id: 's-note-1',
        title: 'The Sakhi of Bhai Lalo and Malik Bhago: Blood vs. Milk in Wealth',
        passageRef: 'Traditional Janamsakhi & Gurmat Ethics',
        authorOrSource: 'Sikh Historical Discourse',
        content:
          'When Guru Nanak visited Saidpur, he refused the lavish feast of the corrupt, oppressive landlord Malik Bhago, choosing instead the coarse dry bread of Bhai Lalo, a humble carpenter. When confronted, the Guru squeezed Lalo’s bread, and drops of pure milk trickled out; he squeezed Bhago’s rich delicacies, and drops of blood oozed forth. The Guru taught that wealth squeezed from the oppression of workers is tainted with blood, while bread earned through honest sweat carries the sweetness of milk.',
        timestamp: 1726807000000,
      },
    ],
  },

  interfaith: {
    id: 'interfaith',
    name: 'Interfaith & Spiritual Wisdom',
    emblem: '🕊️',
    tradition: 'Universal Golden Rule & Sacred Contemplation',
    sacredTextName: 'The Golden Rule & World Sacred Wisdom Archive',
    tagline: 'Treat Others as You Wish to Be Treated — Universal Compassion and Planetary Stewardship',
    frontPageExplanation:
      'For seekers of universal spirituality and perennial wisdom, this pathway unites the common moral core found across all world civilizations: the Golden Rule. Wealth is seen as circulating universal energy that should foster human flourishing, planetary harmony, and the relief of suffering. Through daily contemplative pauses, mindful ethical enterprise, and dedicated philanthropic sharing, you harmonize high-level commerce with timeless inner peace.',
    teachingsOnWealth:
      'Material resources are tools to heal, build, and enlighten. Genuine prosperity is measured not by what you accumulate, but by the dignity, joy, and peace you cultivate in the world around you.',
    coreDesiresSummary:
      'The Universal Golden Rule, Philanthropic Circulation of Resources, Daily Mindful Centering, Ecological and Human Stewardship.',
    defaultPrayers: [
      {
        id: 'u-morning',
        name: 'Dawn Gratitude & Ethical Intention',
        arabicOrNativeName: 'Morning Invocation of Peace',
        standardTime: '06:30',
        scheduledTime: '06:30',
        windowLabel: 'Morning Dawn',
        enabled: true,
        scriptureText:
          'May all beings everywhere be happy, free, and protected. Today, in every trade, decision, and communication, may I act with integrity, kindness, and courage. May my work bring relief to those who suffer and harmony to the world.',
        englishTranslation:
          'Universal morning affirmation aligning consciousness with benevolence, honesty, and empathy.',
        guidance:
          'Take three deep, grounding breaths. Set a clear moral intention that your financial and career decisions today will benefit others.',
      },
      {
        id: 'u-noon',
        name: 'Midday Compassion & Presence Pause',
        arabicOrNativeName: 'Centering Moment',
        standardTime: '12:00',
        scheduledTime: '12:00',
        windowLabel: 'Midday Zenith',
        enabled: true,
        scriptureText:
          'In the noise of transactions and ambitions, I return to stillness. What I possess is borrowed from the Earth. Let me walk gently, treat my partners and workers with dignity, and keep my heart open to all.',
        englishTranslation:
          'Perennial reminder of our shared humanity amidst the rapid tempo of modern industry.',
        guidance:
          'Step back from screens for 60 seconds. Rest in silent gratitude for clean air, water, and human community.',
      },
      {
        id: 'u-evening',
        name: 'Sunset Reflection & Universal Fellowship',
        arabicOrNativeName: 'Evening Harvest of Peace',
        standardTime: '19:00',
        scheduledTime: '19:00',
        windowLabel: 'Evening Dusk',
        enabled: true,
        scriptureText:
          'As daylight yields to stars, I release the tensions of the day. May peace spread across every continent, in every home and city. May abundance be shared, wounds healed, and understanding grow among all peoples.',
        englishTranslation:
          'A tranquil evening prayer embracing the unity of humankind across all borders and creeds.',
        guidance:
          'Examine your actions today with gentle honesty. Forgive anyone who wronged you, and resolve to right any wrongs you caused.',
      },
    ],
    initialDesires: [
      {
        id: 'u-desire-give',
        name: 'Circulate Wealth into Philanthropy',
        category: 'charity',
        description: 'Fund poverty alleviation, educational scholarships, and clean community initiatives.',
        scriptureAnchor: 'The Universal Golden Rule',
        currentProgress: 0,
        targetGoal: 10000,
        unit: 'USD Invested in Humanity',
        isFulfilled: false,
        rewardSerenity: 25,
        actionLabel: 'Disburse $2,500 Universal Humanitarian Fund',
        actionCostCash: 2500,
      },
      {
        id: 'u-desire-rule',
        name: 'Apply the Golden Rule Across All Trade',
        category: 'integrity',
        description: 'Ensure every counterparty, employee, and customer is treated exactly as you would wish to be treated.',
        scriptureAnchor: 'Universal Proverb',
        currentProgress: 1,
        targetGoal: 1,
        unit: 'Pledge Upheld',
        isFulfilled: true,
        rewardSerenity: 20,
        actionLabel: 'Verify Ethical Human Dignity Charter',
      },
      {
        id: 'u-desire-nature',
        name: 'Earth and Ecological Stewardship',
        category: 'service',
        description: 'Invest in sustainable technologies and avoid environmental degradation in your ventures.',
        scriptureAnchor: 'Planetary Care Charter',
        currentProgress: 0,
        targetGoal: 2,
        unit: 'Audits Completed',
        isFulfilled: false,
        rewardSerenity: 20,
      },
    ],
    inGameScriptures: [
      {
        id: 'u-scrip-1',
        reference: 'The Universal Golden Rule Across World Traditions',
        title: 'The Common Heart of All Faiths',
        text: '• Judaism (Hillel): "What is hateful to you, do not do to your neighbor: that is the whole Torah; the rest is commentary."\n• Christianity (Jesus): "In everything, do to others what you would have them do to you."\n• Islam (Prophet Muhammad pbuh): "None of you truly believes until he wishes for his brother what he wishes for himself."\n• Hinduism (Mahabharata): "One should never do that to another which one regards as injurious to one’s own self."\n• Buddhism (Udanavarga): "Hurt not others in ways that you yourself would find hurtful."\n• Sikhism (Guru Granth Sahib): "Do not speak ill of anyone, and do not cause suffering to any creature."',
        topic: 'Universal Justice',
        themeSummary: 'The singular universal moral compass shared by all human spiritual civilizations.',
      },
      {
        id: 'u-scrip-2',
        reference: 'Desiderata (Max Ehrmann, 1927)',
        title: 'Go Placidly Amid the Noise & Haste',
        text: 'Go placidly amid the noise and the haste, and remember what peace there may be in silence. As far as possible, without surrender, be on good terms with all persons. Speak your truth quietly and clearly; and listen to others, even to the dull and the ignorant; they too have their story... If you compare yourself with others, you may become vain or bitter, for always there will be greater and lesser persons than yourself. Enjoy your achievements as well as your plans. Keep interested in your own career, however humble; it is a real possession in the changing fortunes of time.',
        topic: 'Peace & Contentment',
        themeSummary: 'Finding inner peace, honoring all persons, and avoiding toxic comparison or arrogance.',
      },
    ],
    reputableStudyLinks: [
      {
        id: 'u-link-1',
        name: 'Internet Sacred Text Archive (Sacred-Texts.com)',
        url: 'https://www.sacred-texts.com',
        description:
          'The largest freely available digital repository of world scriptures, mythology, comparative religion, and esoteric philosophy in human history.',
        badge: 'Massive Global Sacred Repository',
        recommendedChapters: ['World Scripture comparative index', 'Ethical classics', 'Peace declarations'],
        authorityNotes: 'Pioneering open public-domain preservation archive founded in 1999.',
      },
      {
        id: 'u-link-2',
        name: 'Parliament of the World’s Religions Archive',
        url: 'https://parliamentofreligions.org',
        description:
          'International interfaith organization cultivating global harmony, featuring the Declaration Toward a Global Ethic signed by hundreds of world faith leaders.',
        badge: 'Global Interfaith Council',
        recommendedChapters: ['Declaration Toward a Global Ethic', 'Principles of Economic Justice and Care'],
        authorityNotes: 'Convening the world’s religious and spiritual traditions since the historic 1893 Chicago Parliament.',
      },
    ],
    scholarlyStudyNotes: [
      {
        id: 'u-note-1',
        title: 'The Perennial Philosophy and the Moral Economy',
        passageRef: 'Aldous Huxley & Comparative Ethics',
        authorOrSource: 'Philosophia Perennis Analysis',
        content:
          'Philosophers throughout the centuries have observed that despite doctrinal differences, all major world religions converge on four ethical mandates regarding wealth: 1) Humility before the infinite; 2) Total honesty in labor and speech; 3) Uncompromising care for the impoverished and weak; and 4) Inner detachment from material hoarding.',
        timestamp: 1726808000000,
      },
    ],
  },
};

export function getReligionDefinition(id: ReligionId): ReligionDefinition {
  return RELIGION_DEFINITIONS[id] ?? RELIGION_DEFINITIONS.christianity;
}

export function getAllReligions(): ReligionDefinition[] {
  return Object.values(RELIGION_DEFINITIONS);
}

export function createReligionState(
  religionId: ReligionId,
  customPrayerTimes?: Record<string, string>
): ReligionState {
  const def = getReligionDefinition(religionId);
  const scheduledPrayers: ScheduledPrayer[] = def.defaultPrayers.map((p) => ({
    ...p,
    scheduledTime: customPrayerTimes?.[p.id] || p.standardTime,
    completedToday: false,
  }));

  return {
    religionId,
    serenity: 50,
    totalPrayersCompleted: 0,
    totalCharityGiven: 0,
    scheduledPrayers,
    desires: JSON.parse(JSON.stringify(def.initialDesires)),
    studyNotes: JSON.parse(JSON.stringify(def.scholarlyStudyNotes)),
    notificationsEnabled: true,
    chimeSoundEnabled: true,
  };
}

export function performPrayer(
  state: ReligionState,
  prayerId: string
): { nextState: ReligionState; rewardSerenity: number; message: string } {
  const todayKey = new Date().toISOString().slice(0, 10);
  const prayer = state.scheduledPrayers.find((p) => p.id === prayerId);
  if (!prayer) {
    return { nextState: state, rewardSerenity: 0, message: 'Prayer not found' };
  }

  const nextPrayers = state.scheduledPrayers.map((p) => {
    if (p.id === prayerId) {
      return {
        ...p,
        completedToday: true,
        lastCompletedDate: todayKey,
      };
    }
    return p;
  });

  const rewardSerenity = 15;
  const nextSerenity = Math.min(100, state.serenity + rewardSerenity);

  // Check if any prayer-based desires can be progressed
  const nextDesires = state.desires.map((d) => {
    if (d.category === 'contemplation' || d.category === 'service') {
      if (d.unit.toLowerCase().includes('prayer') || d.unit.toLowerCase().includes('reflection')) {
        const nextProg = Math.min(d.targetGoal, d.currentProgress + 1);
        return {
          ...d,
          currentProgress: nextProg,
          isFulfilled: nextProg >= d.targetGoal,
        };
      }
    }
    return d;
  });

  return {
    nextState: {
      ...state,
      serenity: nextSerenity,
      totalPrayersCompleted: state.totalPrayersCompleted + 1,
      scheduledPrayers: nextPrayers,
      desires: nextDesires,
    },
    rewardSerenity,
    message: `Completed ${prayer.name}. Serenity increased to ${nextSerenity}%.`,
  };
}

export function updateScheduledPrayerTime(
  state: ReligionState,
  prayerId: string,
  newTime: string
): ReligionState {
  return {
    ...state,
    scheduledPrayers: state.scheduledPrayers.map((p) =>
      p.id === prayerId ? { ...p, scheduledTime: newTime } : p
    ),
  };
}

export function togglePrayerEnabled(state: ReligionState, prayerId: string): ReligionState {
  return {
    ...state,
    scheduledPrayers: state.scheduledPrayers.map((p) =>
      p.id === prayerId ? { ...p, enabled: !p.enabled } : p
    ),
  };
}

export function saveUserStudyNote(
  state: ReligionState,
  note: { title: string; passageRef: string; content: string }
): ReligionState {
  const newNote: StudyNote = {
    id: `user-note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: note.title.trim() || 'Study Reflection',
    passageRef: note.passageRef.trim() || 'General Scriptural Reflection',
    authorOrSource: 'My Study Notes & Contemplation',
    content: note.content.trim(),
    timestamp: Date.now(),
    isUserNote: true,
  };

  return {
    ...state,
    serenity: Math.min(100, state.serenity + 5),
    studyNotes: [newNote, ...state.studyNotes],
  };
}

export function deleteUserStudyNote(state: ReligionState, noteId: string): ReligionState {
  return {
    ...state,
    studyNotes: state.studyNotes.filter((n) => n.id !== noteId),
  };
}

export function fulfillCharityDesire(
  state: ReligionState,
  desireId: string,
  cashAmount: number
): { nextState: ReligionState; serenityGained: number; message: string } {
  const desire = state.desires.find((d) => d.id === desireId);
  if (!desire) {
    return { nextState: state, serenityGained: 0, message: 'Desire not found' };
  }

  const newProg = desire.currentProgress + cashAmount;
  const isFulfilled = newProg >= desire.targetGoal;
  const serenityGained = desire.rewardSerenity;

  const nextDesires = state.desires.map((d) => {
    if (d.id === desireId) {
      return {
        ...d,
        currentProgress: newProg,
        isFulfilled,
      };
    }
    return d;
  });

  return {
    nextState: {
      ...state,
      serenity: Math.min(100, state.serenity + serenityGained),
      totalCharityGiven: state.totalCharityGiven + cashAmount,
      desires: nextDesires,
    },
    serenityGained,
    message: `Donated $${cashAmount.toLocaleString()} to ${desire.name}. Gained +${serenityGained}% Serenity!`,
  };
}

export function normalizeReligionState(raw: unknown): ReligionState | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const obj = raw as Record<string, any>;
  if (!obj.religionId || typeof obj.religionId !== 'string') return undefined;
  try {
    const def = getReligionDefinition(obj.religionId as ReligionId);
    if (!def) return undefined;

    const scheduledPrayers: ScheduledPrayer[] = Array.isArray(obj.scheduledPrayers)
      ? obj.scheduledPrayers.map((p: any) => ({
          id: typeof p.id === 'string' ? p.id : 'prayer',
          name: typeof p.name === 'string' ? p.name : 'Prayer',
          arabicOrNativeName: p.arabicOrNativeName,
          standardTime: typeof p.standardTime === 'string' ? p.standardTime : '12:00',
          scheduledTime: typeof p.scheduledTime === 'string' ? p.scheduledTime : (p.standardTime || '12:00'),
          windowLabel: typeof p.windowLabel === 'string' ? p.windowLabel : 'Daily',
          enabled: p.enabled !== false,
          completedToday: Boolean(p.completedToday),
          scriptureText: typeof p.scriptureText === 'string' ? p.scriptureText : '',
          englishTranslation: typeof p.englishTranslation === 'string' ? p.englishTranslation : '',
          guidance: typeof p.guidance === 'string' ? p.guidance : '',
          lastCompletedDate: p.lastCompletedDate,
        }))
      : def.defaultPrayers.map((p) => ({
          ...p,
          scheduledTime: p.standardTime,
          completedToday: false,
        }));

    const desires = Array.isArray(obj.desires) && obj.desires.length > 0 ? obj.desires : def.initialDesires;
    const studyNotes = Array.isArray(obj.studyNotes) ? obj.studyNotes : def.scholarlyStudyNotes;

    return {
      religionId: obj.religionId as ReligionId,
      serenity: typeof obj.serenity === 'number' && !Number.isNaN(obj.serenity)
        ? Math.max(0, Math.min(100, obj.serenity))
        : 50,
      totalPrayersCompleted: Math.max(0, Number(obj.totalPrayersCompleted) || 0),
      totalCharityGiven: Math.max(0, Number(obj.totalCharityGiven) || 0),
      scheduledPrayers,
      desires,
      studyNotes,
      notificationsEnabled: obj.notificationsEnabled !== false,
      chimeSoundEnabled: obj.chimeSoundEnabled !== false,
    };
  } catch {
    return undefined;
  }
}
