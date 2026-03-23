import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Speakers ──────────────────────────────────────────────────
  const speakerAdjei = await prisma.speaker.upsert({
    where: { id: "spk_adjei" },
    update: {},
    create: {
      id: "spk_adjei",
      name: "Rev. Dr. Emmanuel Adjei",
      title: "Senior Pastor",
      bio: "Rev. Dr. Emmanuel Adjei has served as Senior Pastor of The Most Holy Trinity Presbyterian Church for over 15 years. He holds a Doctor of Ministry from Trinity Theological Seminary and is passionate about expository preaching and discipleship.",
    },
  });

  const speakerMensah = await prisma.speaker.upsert({
    where: { id: "spk_mensah" },
    update: {},
    create: {
      id: "spk_mensah",
      name: "Rev. Mrs. Abena Mensah",
      title: "Associate Pastor",
      bio: "Rev. Mrs. Abena Mensah leads the women's ministry and family counselling programme. She is a gifted teacher with a heart for nurturing families in faith.",
    },
  });

  const speakerBoateng = await prisma.speaker.upsert({
    where: { id: "spk_boateng" },
    update: {},
    create: {
      id: "spk_boateng",
      name: "Pastor Kwame Boateng",
      title: "Youth Pastor",
      bio: "Pastor Kwame Boateng leads the youth and young adults ministry. His dynamic preaching style and relatability have drawn many young people to faith.",
    },
  });

  // ── Series ────────────────────────────────────────────────────
  const seriesJohn = await prisma.sermonSeries.upsert({
    where: { slug: "the-gospel-of-john" },
    update: {},
    create: {
      title: "The Gospel of John",
      slug: "the-gospel-of-john",
      description:
        "An in-depth verse-by-verse study through the Gospel of John, exploring the deity of Christ and the gift of eternal life.",
    },
  });

  const seriesFoundations = await prisma.sermonSeries.upsert({
    where: { slug: "foundations-of-faith" },
    update: {},
    create: {
      title: "Foundations of Faith",
      slug: "foundations-of-faith",
      description:
        "A foundational series covering the core doctrines of the Christian faith — prayer, trust, grace, and the authority of Scripture.",
    },
  });

  const seriesPurpose = await prisma.sermonSeries.upsert({
    where: { slug: "living-on-purpose" },
    update: {},
    create: {
      title: "Living on Purpose",
      slug: "living-on-purpose",
      description:
        "Discover God's unique purpose for your life and how to live it out with intentionality and joy.",
    },
  });

  const seriesFamily = await prisma.sermonSeries.upsert({
    where: { slug: "family-matters" },
    update: {},
    create: {
      title: "Family Matters",
      slug: "family-matters",
      description:
        "Biblical principles for building strong, God-honouring families in a modern world.",
    },
  });

  // ── Sermons ───────────────────────────────────────────────────
  const sermons = [
    {
      title: "Walking in the Light",
      slug: "walking-in-the-light",
      scripture: "John 1:1-14",
      description:
        "In the opening verses of John's Gospel, we encounter the profound truth that Jesus is the eternal Word — the Light that shines in the darkness. This sermon explores what it means to walk in that light daily.",
      date: new Date("2026-03-09"),
      duration: 2520,
      speakerId: speakerAdjei.id,
      seriesId: seriesJohn.id,
      youtubeId: "dQw4w9WgXcQ",
      viewCount: 342,
    },
    {
      title: "The Power of Prayer",
      slug: "the-power-of-prayer",
      scripture: "James 5:13-18",
      description:
        "James teaches that the prayer of a righteous person is powerful and effective. Learn how to develop a prayer life that moves mountains and transforms communities.",
      date: new Date("2026-03-02"),
      duration: 2280,
      speakerId: speakerMensah.id,
      seriesId: seriesFoundations.id,
      youtubeId: "dQw4w9WgXcQ",
      viewCount: 289,
    },
    {
      title: "Called to Serve",
      slug: "called-to-serve",
      scripture: "Mark 10:42-45",
      description:
        "Jesus turned the world's definition of greatness upside down. True leadership in God's kingdom is defined by service. Discover your call to servant leadership.",
      date: new Date("2026-02-23"),
      duration: 2100,
      speakerId: speakerBoateng.id,
      seriesId: seriesPurpose.id,
      youtubeId: "dQw4w9WgXcQ",
      viewCount: 215,
    },
    {
      title: "Trusting God in Uncertain Times",
      slug: "trusting-god-in-uncertain-times",
      scripture: "Proverbs 3:5-6",
      description:
        "When life feels uncertain and the path ahead is unclear, how do we maintain our trust in God? This message unpacks the timeless wisdom of Proverbs 3:5-6.",
      date: new Date("2026-02-16"),
      duration: 2700,
      speakerId: speakerAdjei.id,
      seriesId: seriesFoundations.id,
      youtubeId: "dQw4w9WgXcQ",
      viewCount: 412,
    },
    {
      title: "The Grace That Transforms",
      slug: "the-grace-that-transforms",
      scripture: "John 1:14-18",
      description:
        "From the fullness of Christ, we receive grace upon grace. This sermon explores how God's grace doesn't just forgive — it transforms us from the inside out.",
      date: new Date("2026-02-09"),
      duration: 2400,
      speakerId: speakerAdjei.id,
      seriesId: seriesJohn.id,
      youtubeId: "dQw4w9WgXcQ",
      viewCount: 378,
    },
    {
      title: "Building a Godly Home",
      slug: "building-a-godly-home",
      scripture: "Deuteronomy 6:4-9",
      description:
        "The Shema — Israel's central confession of faith — was meant to be lived out in the home. Learn practical steps for making your home a sanctuary of faith and love.",
      date: new Date("2026-02-02"),
      duration: 2220,
      speakerId: speakerMensah.id,
      seriesId: seriesFamily.id,
      youtubeId: "dQw4w9WgXcQ",
      viewCount: 256,
    },
    {
      title: "The Bread of Life",
      slug: "the-bread-of-life",
      scripture: "John 6:35-40",
      description:
        "Jesus declares 'I am the bread of life.' In a culture obsessed with material satisfaction, discover how only Christ can truly satisfy the deepest hunger of the soul.",
      date: new Date("2026-01-26"),
      duration: 2640,
      speakerId: speakerAdjei.id,
      seriesId: seriesJohn.id,
      youtubeId: "dQw4w9WgXcQ",
      viewCount: 198,
    },
    {
      title: "Raising the Next Generation",
      slug: "raising-the-next-generation",
      scripture: "Psalm 78:1-8",
      description:
        "God's plan for generational faithfulness begins with intentional parenting. This message challenges and equips parents to pass the baton of faith to their children.",
      date: new Date("2026-01-19"),
      duration: 2340,
      speakerId: speakerBoateng.id,
      seriesId: seriesFamily.id,
      youtubeId: "dQw4w9WgXcQ",
      viewCount: 167,
    },
  ];

  for (const sermon of sermons) {
    await prisma.sermon.upsert({
      where: { slug: sermon.slug },
      update: {},
      create: sermon,
    });
  }

  console.log(
    `✅ Seeded ${sermons.length} sermons, 3 speakers, 4 series`
  );

  // ── Events (Phase 4) ─────────────────────────────────────────
  const events = [
    {
      title: "Sunday Worship Service",
      slug: "sunday-worship-march-16",
      description: "Join us for our regular Sunday worship service. Experience uplifting praise, heartfelt prayer, and a powerful message from the Word of God. All are welcome — whether you've attended for years or it's your very first time.",
      location: "Main Sanctuary",
      category: "worship",
      startDate: new Date("2026-03-15"),
      startTime: "09:00",
      endTime: "12:00",
      isFeatured: true,
      capacity: 500,
    },
    {
      title: "Women's Prayer Breakfast",
      slug: "womens-prayer-breakfast-march",
      description: "A morning of fellowship, prayer, and encouragement for the women of The Most Holy Trinity. Enjoy a delicious breakfast while we share testimonies and lift one another up in prayer.",
      location: "Fellowship Hall",
      category: "women",
      startDate: new Date("2026-03-22"),
      startTime: "07:00",
      endTime: "09:30",
      isFeatured: true,
      capacity: 80,
    },
    {
      title: "Youth Friday Night Live",
      slug: "youth-friday-night-live-march",
      description: "An evening of worship, games, and discipleship for young people ages 13-25. Invite your friends for an unforgettable night of fun and faith.",
      location: "Youth Centre",
      category: "youth",
      startDate: new Date("2026-03-21"),
      startTime: "18:00",
      endTime: "21:00",
      capacity: 120,
    },
    {
      title: "Community Outreach — Teshie",
      slug: "community-outreach-teshie",
      description: "Join our outreach team as we serve the Teshie community with food distribution, health screening, and children's activities. Volunteers needed!",
      location: "Teshie Community Centre",
      category: "outreach",
      startDate: new Date("2026-03-29"),
      startTime: "08:00",
      endTime: "14:00",
      capacity: 50,
    },
    {
      title: "Men's Fellowship",
      slug: "mens-fellowship-april",
      description: "A time of brotherhood, Bible study, and accountability for the men of the church. This month's topic: Leading with integrity in the workplace.",
      location: "Conference Room B",
      category: "men",
      startDate: new Date("2026-04-05"),
      startTime: "16:00",
      endTime: "18:00",
    },
    {
      title: "Easter Conference 2026",
      slug: "easter-conference-2026",
      description: "Our annual Easter conference featuring guest speakers, worship concerts, and special sessions for every age group. Three days of spiritual renewal and celebration of the resurrection.",
      location: "Main Sanctuary & Grounds",
      category: "conference",
      startDate: new Date("2026-04-03"),
      endDate: new Date("2026-04-05"),
      startTime: "09:00",
      endTime: "17:00",
      isFeatured: true,
      capacity: 1000,
    },
    {
      title: "Family Fun Day",
      slug: "family-fun-day-april",
      description: "An afternoon of games, food, bounce castles, face painting, and fellowship for the whole family. Free admission — bring your neighbours!",
      location: "Church Grounds",
      category: "family",
      startDate: new Date("2026-04-12"),
      startTime: "13:00",
      endTime: "18:00",
      capacity: 300,
    },
    {
      title: "Mid-Week Prayer Meeting",
      slug: "midweek-prayer-meeting",
      description: "Our weekly mid-week prayer meeting. Come and pray with us as we intercede for the church, the nation, and the world.",
      location: "Prayer Room",
      category: "prayer",
      startDate: new Date("2026-03-19"),
      startTime: "18:00",
      endTime: "19:30",
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }

  console.log(`✅ Seeded ${events.length} events`);

  // ── Blog Posts (Phase 4) ──────────────────────────────────────
  const blogPosts = [
    {
      title: "Five Prayers to Start Your Day With",
      slug: "five-prayers-to-start-your-day",
      excerpt: "Begin each morning with these five prayers that invite God's presence into your daily routine and anchor your heart in His peace.",
      content: "<p>Starting your day with prayer sets the tone for everything that follows. Here are five simple yet powerful prayers to incorporate into your morning routine.</p><h3>1. A Prayer of Gratitude</h3><p>Thank You, Lord, for the gift of a new day. I acknowledge that every good thing comes from You.</p><h3>2. A Prayer for Guidance</h3><p>Lord, direct my steps today. Help me to walk in Your will and make decisions that honour You.</p><h3>3. A Prayer for Protection</h3><p>Father, cover me and my family with Your protection. Guard our going out and our coming in.</p><h3>4. A Prayer for Strength</h3><p>God, grant me the strength to face whatever challenges this day may bring. Let me lean on You and not my own understanding.</p><h3>5. A Prayer of Surrender</h3><p>Lord, I surrender this day to You. Use me as an instrument of Your peace and love wherever I go.</p>",
      author: "Rev. Mrs. Abena Mensah",
      category: "devotional",
      readTime: 4,
      publishedAt: new Date("2026-03-10"),
      viewCount: 156,
    },
    {
      title: "Understanding the Book of Romans",
      slug: "understanding-the-book-of-romans",
      excerpt: "A beginner's guide to one of the most theologically rich books of the Bible — unpacking grace, justification, and the Christian life.",
      content: "<p>The Book of Romans is often considered Paul's magnum opus — a systematic presentation of the Gospel that has shaped Christian theology for nearly two millennia.</p><h3>Structure and Themes</h3><p>Romans can be divided into several major sections. Chapters 1-3 establish that all humanity has sinned and falls short of God's glory. Chapters 3-5 reveal the remedy: justification by faith through grace. Chapters 6-8 explore the practical implications of this salvation — freedom from sin, the role of the law, and life in the Spirit.</p><h3>Why Romans Matters Today</h3><p>In a world that often confuses moralism with the Gospel, Romans reminds us that salvation is entirely a work of God's grace received through faith. It challenges self-righteousness and offers hope to the broken.</p><p>Whether you are new to the faith or have walked with Christ for decades, Romans has something transformative to offer you.</p>",
      author: "Rev. Dr. Emmanuel Adjei",
      category: "bible-study",
      readTime: 7,
      publishedAt: new Date("2026-03-05"),
      viewCount: 234,
    },
    {
      title: "How to Build a Family Devotion Habit",
      slug: "how-to-build-a-family-devotion-habit",
      excerpt: "Practical tips for creating a consistent devotional time with your family — even with busy schedules.",
      content: "<p>Family devotions don't have to be lengthy or complex. The goal is consistency and connection — with God and with each other.</p><h3>Start Small</h3><p>Begin with just 10 minutes a day. Read a short Bible passage together, discuss one question, and pray. That's it.</p><h3>Pick a Consistent Time</h3><p>Whether it's at breakfast, after dinner, or before bedtime, choose a time that works for your family and stick with it. Routine builds habit.</p><h3>Make It Age-Appropriate</h3><p>For younger children, use a children's Bible with illustrations. For teens, consider topical discussions that relate to their daily lives.</p><h3>Involve Everyone</h3><p>Let family members take turns reading, choosing songs, or leading prayer. Ownership creates engagement.</p><p>Remember, the goal isn't perfection — it's presence. God honours the effort to gather your family in His name.</p>",
      author: "Rev. Mrs. Abena Mensah",
      category: "family",
      readTime: 5,
      publishedAt: new Date("2026-02-28"),
      viewCount: 189,
    },
    {
      title: "Serving Beyond the Church Walls",
      slug: "serving-beyond-the-church-walls",
      excerpt: "How our outreach ministry is making a tangible impact in communities across Greater Accra — and how you can get involved.",
      content: "<p>The church exists not just for those within its walls but for the world outside. At The Most Holy Trinity, our outreach ministry has been at the forefront of community transformation.</p><h3>Recent Initiatives</h3><p>Over the past year, our outreach teams have served in Teshie, Nungua, and La communities — providing food packages to over 500 families, offering free health screenings, and running after-school programmes for children.</p><h3>How You Can Help</h3><p>There are many ways to get involved: join a Saturday outreach team, donate supplies, sponsor a child's education, or simply pray for our communities. Every act of service, no matter how small, reflects the love of Christ.</p><p>Contact the outreach coordinator to learn more about upcoming opportunities.</p>",
      author: "Deaconess Grace Amponsah",
      category: "outreach",
      readTime: 6,
      publishedAt: new Date("2026-02-20"),
      viewCount: 145,
    },
    {
      title: "What the Psalms Teach Us About Worship",
      slug: "what-the-psalms-teach-us-about-worship",
      excerpt: "The Psalms are more than songs — they're a masterclass in honest, heartfelt worship. Here's what we can learn.",
      content: "<p>The Book of Psalms is the hymnbook of ancient Israel and remains the richest resource for understanding true worship.</p><h3>Worship Is Honest</h3><p>The Psalms don't shy away from raw emotion. Psalms of lament, anger, confusion, and despair sit alongside psalms of exuberant praise. This teaches us that worship begins with honesty before God.</p><h3>Worship Is Communal</h3><p>Many psalms were written for congregational use. Worship is not meant to be a solo activity — it flourishes in community.</p><h3>Worship Is a Lifestyle</h3><p>The psalmists worshipped in every season of life — in plenty and in want, in victory and in defeat. True worship isn't confined to Sunday mornings; it permeates every aspect of daily living.</p>",
      author: "Pastor Kwame Boateng",
      category: "worship",
      readTime: 5,
      publishedAt: new Date("2026-02-14"),
      viewCount: 178,
    },
    {
      title: "Navigating Faith in the Digital Age",
      slug: "navigating-faith-in-the-digital-age",
      excerpt: "Technology can be a tool for discipleship or distraction. Learn how to use it wisely for spiritual growth.",
      content: "<p>We live in an age of unprecedented digital connectivity. While technology has opened incredible doors for spreading the Gospel, it also presents unique challenges to spiritual growth.</p><h3>The Good</h3><p>Bible apps, online sermons, faith-based podcasts, and digital community groups have made spiritual resources more accessible than ever.</p><h3>The Challenge</h3><p>Social media can breed comparison, distraction, and superficial relationships. The constant noise of the digital world can drown out the still, small voice of God.</p><h3>A Balanced Approach</h3><p>Set boundaries for screen time. Use technology intentionally for spiritual growth. Practice digital sabbaths. And remember that no online experience can replace the richness of in-person fellowship and worship.</p>",
      author: "Pastor Kwame Boateng",
      category: "culture",
      readTime: 4,
      publishedAt: new Date("2026-02-07"),
      viewCount: 122,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log(`✅ Seeded ${blogPosts.length} blog posts`);

  // ── Gallery Albums (Phase 4) ──────────────────────────────────
  const albums = [
    {
      title: "Sunday Worship",
      slug: "sunday-worship",
      description: "Moments of praise and worship from our Sunday services.",
    },
    {
      title: "Easter 2025",
      slug: "easter-2025",
      description: "Highlights from our Easter Conference and celebrations.",
    },
    {
      title: "Youth Conference",
      slug: "youth-conference",
      description: "Photos from the annual youth conference.",
    },
    {
      title: "Community Outreach",
      slug: "community-outreach",
      description: "Serving our community with the love of Christ.",
    },
    {
      title: "Christmas Celebration",
      slug: "christmas-celebration",
      description: "The joy of the season at The Most Holy Trinity.",
    },
    {
      title: "Children's Ministry",
      slug: "childrens-ministry",
      description: "Fun, learning, and faith for our youngest members.",
    },
  ];

  for (const album of albums) {
    await prisma.galleryAlbum.upsert({
      where: { slug: album.slug },
      update: {},
      create: album,
    });
  }

  console.log(`✅ Seeded ${albums.length} gallery albums`);

  // ── Devotionals (Phase 4) ─────────────────────────────────────
  const devotionals = [
    {
      title: "Walking in Faithfulness",
      scripture: "Lamentations 3:22-23",
      content: "<p>God's mercies are new every morning. No matter what yesterday held — failure, disappointment, or doubt — today is a fresh start. His faithfulness is not dependent on ours; it flows from His character.</p><p>Today, take comfort in the fact that the God who created the sunrise also renews His commitment to you with each new day. Walk in that faithfulness, knowing you are held by a love that never lets go.</p><p><strong>Prayer:</strong> Lord, thank You for Your unfailing love. Help me to walk faithfully today, trusting in Your mercies that are new every morning. Amen.</p>",
      author: "Rev. Dr. Emmanuel Adjei",
      publishDate: new Date("2026-03-12"),
    },
    {
      title: "The Strength of Stillness",
      scripture: "Psalm 46:10",
      content: "<p>'Be still, and know that I am God.' In a world that never stops, God invites us to pause. Stillness is not inactivity — it is an act of trust. It is the quiet confidence that God is in control, even when everything around us feels chaotic.</p><p>Take a few minutes today to simply be still before the Lord. Put away your phone, close your eyes, and rest in His presence. You don't need to say anything. Just be.</p><p><strong>Prayer:</strong> Father, quiet my restless heart. Help me to find strength in stillness and peace in Your presence. Amen.</p>",
      author: "Rev. Mrs. Abena Mensah",
      publishDate: new Date("2026-03-11"),
    },
    {
      title: "Bearing Fruit That Lasts",
      scripture: "John 15:5",
      content: "<p>Jesus said, 'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.' The secret to a fruitful life is not more effort — it is deeper connection.</p><p>When we abide in Christ — spending time in His Word, in prayer, in community — fruit naturally follows. Love, joy, peace, patience, kindness... these are not manufactured; they are cultivated through intimacy with Jesus.</p><p><strong>Prayer:</strong> Lord Jesus, I choose to remain in You today. May my life bear fruit that glorifies the Father and blesses others. Amen.</p>",
      author: "Pastor Kwame Boateng",
      publishDate: new Date("2026-03-10"),
    },
    {
      title: "Courage in the Valley",
      scripture: "Psalm 23:4",
      content: "<p>The valley of the shadow of death is not a dead end — it is a passage. David declares that even in the darkest valley, he will fear no evil because God is with him.</p><p>If you find yourself in a valley season today, take heart. The Shepherd is with you. His rod protects you; His staff guides you. The valley is temporary, but His presence is permanent.</p><p><strong>Prayer:</strong> Good Shepherd, walk with me through this valley. Replace my fear with courage and my anxiety with peace. Amen.</p>",
      author: "Rev. Dr. Emmanuel Adjei",
      publishDate: new Date("2026-03-09"),
    },
    {
      title: "The Gift of Community",
      scripture: "Hebrews 10:24-25",
      content: "<p>We were not made to walk this journey alone. The writer of Hebrews urges us to 'not give up meeting together' but to encourage one another. Christian community is not optional — it is essential.</p><p>In community, we are sharpened, comforted, challenged, and loved. Whether it is a small group, a ministry team, or a Sunday service, make it a priority to connect with other believers this week.</p><p><strong>Prayer:</strong> Lord, thank You for the gift of community. Help me to be a source of encouragement to those around me and to receive the love that others offer. Amen.</p>",
      author: "Rev. Mrs. Abena Mensah",
      publishDate: new Date("2026-03-08"),
    },
  ];

  for (const devo of devotionals) {
    await prisma.devotional.upsert({
      where: { publishDate: devo.publishDate },
      update: {},
      create: devo,
    });
  }

  console.log(`✅ Seeded ${devotionals.length} devotionals`);

  // ── Users (Phase 5) ─────────────────────────────────────────
  const demoPassword = await hash("Church2026!", 12);

  const userAdmin = await prisma.user.upsert({
    where: { email: "admin@tmhtpresby.org" },
    update: {},
    create: {
      firstName: "Emmanuel",
      lastName: "Adjei",
      email: "admin@tmhtpresby.org",
      hashedPassword: demoPassword,
      role: "super_admin",
      ministryGroup: "adult",
      dateOfBirth: new Date("1975-04-12"),
      bio: "Senior Pastor & Administrator of The Most Holy Trinity Presbyterian Church.",
    },
  });

  const userPastor = await prisma.user.upsert({
    where: { email: "abena.mensah@tmhtpresby.org" },
    update: {},
    create: {
      firstName: "Abena",
      lastName: "Mensah",
      email: "abena.mensah@tmhtpresby.org",
      hashedPassword: demoPassword,
      role: "pastor",
      ministryGroup: "adult",
      dateOfBirth: new Date("1980-08-22"),
      bio: "Associate Pastor. Leading women's ministry and family counselling.",
    },
  });

  const userLeader = await prisma.user.upsert({
    where: { email: "kwame.boateng@tmhtpresby.org" },
    update: {},
    create: {
      firstName: "Kwame",
      lastName: "Boateng",
      email: "kwame.boateng@tmhtpresby.org",
      hashedPassword: demoPassword,
      role: "ministry_leader",
      ministryGroup: "young_adult",
      dateOfBirth: new Date("1992-11-30"),
      bio: "Youth Pastor. Passionate about reaching the next generation.",
    },
  });

  const members = [
    { firstName: "Ama", lastName: "Darko", email: "ama.darko@gmail.com", ministryGroup: "adult", dob: "1988-05-14" },
    { firstName: "Kofi", lastName: "Asante", email: "kofi.asante@gmail.com", ministryGroup: "adult", dob: "1985-09-03" },
    { firstName: "Akua", lastName: "Owusu", email: "akua.owusu@gmail.com", ministryGroup: "young_adult", dob: "1998-02-17" },
    { firstName: "Yaw", lastName: "Mensah", email: "yaw.mensah@gmail.com", ministryGroup: "young_adult", dob: "1999-07-25" },
    { firstName: "Efua", lastName: "Appiah", email: "efua.appiah@gmail.com", ministryGroup: "senior", dob: "1960-12-08" },
    { firstName: "Nana", lastName: "Osei", email: "nana.osei@gmail.com", ministryGroup: "adult", dob: "1979-01-20" },
    { firstName: "Adjoa", lastName: "Frimpong", email: "adjoa.frimpong@gmail.com", ministryGroup: "young_adult", dob: "2000-06-11" },
    { firstName: "Kwesi", lastName: "Amponsah", email: "kwesi.amponsah@gmail.com", ministryGroup: "youth", dob: "2008-03-29" },
  ];

  for (const m of members) {
    await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: {
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        hashedPassword: demoPassword,
        role: "member",
        ministryGroup: m.ministryGroup,
        dateOfBirth: new Date(m.dob),
        isMinor: new Date(m.dob) > new Date("2008-01-01"),
      },
    });
  }

  console.log(`✅ Seeded ${3 + members.length} users (admin, pastors, members)`);

  // ── Discussion Posts (Phase 5) ──────────────────────────────
  const posts = [
    {
      title: "Welcome to our new online community!",
      content: "We're excited to launch this community discussion board. This is a space for members to connect, share prayer requests, testimonies, and encourage one another in the faith. Please be respectful and kind in all interactions. God bless!",
      category: "announcement",
      isPinned: true,
      authorId: userAdmin.id,
    },
    {
      title: "Prayer request: healing for my mother",
      content: "Dear church family, please join me in praying for my mother who was admitted to the hospital yesterday. The doctors say she needs surgery but we are trusting God for a miraculous recovery. Your prayers mean so much to our family.",
      category: "prayer",
      authorId: userPastor.id,
    },
    {
      title: "Testimony: God provided a new job!",
      content: "I want to share that after 6 months of unemployment, God has opened a door for me at a wonderful company. I want to thank everyone who prayed with me during those difficult months. The Tuesday prayer group especially — your intercession made a difference. God is faithful!",
      category: "testimony",
      authorId: userLeader.id,
    },
    {
      title: "What Bible reading plan do you recommend?",
      content: "I want to start reading through the entire Bible this year. Does anyone have a reading plan they'd recommend? I've tried before but always fell behind by March. Any tips for staying consistent?",
      category: "question",
      authorId: userLeader.id,
    },
  ];

  for (const post of posts) {
    const existing = await prisma.discussionPost.findFirst({
      where: { title: post.title, authorId: post.authorId },
    });
    if (!existing) {
      await prisma.discussionPost.create({ data: post });
    }
  }

  console.log(`✅ Seeded ${posts.length} discussion posts`);

  // ── Campaign (Phase 6) ─────────────────────────────────────
  await prisma.campaign.upsert({
    where: { id: "campaign_easter_2026" },
    update: {},
    create: {
      id: "campaign_easter_2026",
      title: "Easter Conference 2026 — Save the Date!",
      subject: "You're Invited: Easter Conference 2026 at The Most Holy Trinity",
      content: "Dear church family,\n\nWe are excited to announce our Easter Conference 2026, taking place April 3-5 at the Main Sanctuary. This year's theme is 'Risen in Power' and features guest speakers, worship concerts, and special children's programmes.\n\nMark your calendars and invite your friends and neighbours. Registration opens soon!\n\nIn Christ,\nThe Most Holy Trinity Team",
      channel: "email",
      audience: "all",
      status: "draft",
    },
  });

  console.log("✅ Seeded 1 campaign draft");

  // ── Projects ─────────────────────────────────────────────────────
  const projects = [
    {
      id: "proj_church_building",
      title: "New Church Building Project",
      slug: "new-church-building",
      description: "Help us build a new sanctuary to accommodate our growing congregation and serve the community better.",
      content: `<h2>About This Project</h2>
<p>Our congregation has grown significantly over the past decade, and our current facility can no longer accommodate everyone comfortably during Sunday services. We are embarking on an ambitious project to build a new, modern sanctuary that will serve our community for generations to come.</p>

<h3>Project Goals</h3>
<ul>
<li>Build a 2,000-seat main sanctuary with modern acoustics</li>
<li>Create dedicated children's ministry wing</li>
<li>Construct multipurpose fellowship hall</li>
<li>Install state-of-the-art audio/visual systems</li>
<li>Develop parking facilities for 500+ vehicles</li>
</ul>

<h3>Timeline</h3>
<p>Phase 1 (Foundation): January - June 2026<br/>
Phase 2 (Structure): July - December 2026<br/>
Phase 3 (Interior): January - June 2027<br/>
Phase 4 (Completion): July - December 2027</p>

<p>Your generous donations will help make this vision a reality. Every contribution, no matter the size, brings us closer to our goal.</p>`,
      imageUrl: "/img/pictures/2/001.jpg",
      goalAmount: 500000,
      raisedAmount: 125750,
      startDate: new Date("2025-01-15"),
      endDate: new Date("2027-12-31"),
      status: "ongoing",
      category: "building",
      isFeatured: true,
      isPublished: true,
    },
    {
      id: "proj_school_support",
      title: "Community School Support Program",
      slug: "community-school-support",
      description: "Providing educational materials, scholarships, and support to underprivileged children in our community.",
      content: `<h2>Empowering Through Education</h2>
<p>Education is the key to breaking the cycle of poverty. Our Community School Support Program aims to provide quality educational resources to children from underprivileged families in the Lashibi community and surrounding areas.</p>

<h3>What We Provide</h3>
<ul>
<li>School supplies (books, uniforms, stationery)</li>
<li>Scholarship funds for secondary and tertiary education</li>
<li>After-school tutoring programs</li>
<li>Computer literacy training</li>
<li>Mentorship programs</li>
</ul>

<h3>Impact So Far</h3>
<p>Since launching this program, we have supported over 150 students, with 25 receiving full scholarships to secondary school. Your continued support helps us reach more children each year.</p>`,
      imageUrl: "/img/pictures/2/010.jpg",
      goalAmount: 50000,
      raisedAmount: 32500,
      startDate: new Date("2024-09-01"),
      endDate: new Date("2026-08-31"),
      status: "ongoing",
      category: "education",
      isFeatured: true,
      isPublished: true,
    },
    {
      id: "proj_medical_outreach",
      title: "Medical Outreach Mission",
      slug: "medical-outreach-mission",
      description: "Bringing free healthcare services to underserved communities through mobile clinics and health education.",
      content: `<h2>Healthcare for All</h2>
<p>Many families in our surrounding communities lack access to basic healthcare services. Our Medical Outreach Mission brings doctors, nurses, and medical supplies directly to those in need.</p>

<h3>Services Provided</h3>
<ul>
<li>Free medical consultations</li>
<li>Basic medications and treatments</li>
<li>Health screenings (blood pressure, diabetes, malaria)</li>
<li>Maternal and child health services</li>
<li>Health education workshops</li>
</ul>

<h3>Upcoming Outreach Dates</h3>
<p>We conduct quarterly outreach programs in different communities. Join us as a volunteer or support us with your donations.</p>`,
      imageUrl: "/img/pictures/2/020.jpg",
      goalAmount: 25000,
      raisedAmount: 18200,
      startDate: new Date("2025-03-01"),
      endDate: new Date("2025-12-31"),
      status: "ongoing",
      category: "mission",
      isFeatured: true,
      isPublished: true,
    },
    {
      id: "proj_youth_center",
      title: "Youth Development Center",
      slug: "youth-development-center",
      description: "Creating a safe space for youth to learn, grow, and develop skills for their future.",
      content: `<h2>Investing in Our Youth</h2>
<p>The Youth Development Center will be a dedicated facility for young people to engage in constructive activities, learn new skills, and receive mentorship from caring adults.</p>

<h3>Planned Facilities</h3>
<ul>
<li>Computer lab with internet access</li>
<li>Library and study area</li>
<li>Music and arts studio</li>
<li>Sports and recreation area</li>
<li>Counseling and mentorship rooms</li>
</ul>

<h3>Programs</h3>
<p>The center will offer vocational training, career guidance, leadership development, and spiritual growth programs for youth ages 13-25.</p>`,
      imageUrl: "/img/pictures/2/030.jpg",
      goalAmount: 75000,
      raisedAmount: 12000,
      startDate: new Date("2025-06-01"),
      endDate: new Date("2026-12-31"),
      status: "ongoing",
      category: "community",
      isFeatured: false,
      isPublished: true,
    },
    {
      id: "proj_widow_support",
      title: "Widows & Orphans Support Fund",
      slug: "widows-orphans-support",
      description: "Providing monthly support, food supplies, and care for widows and orphans in our congregation and community.",
      content: `<h2>Caring for the Vulnerable</h2>
<p>The Bible calls us to care for widows and orphans. This fund provides ongoing support to those who have lost their primary breadwinners and need assistance with basic necessities.</p>

<h3>How We Help</h3>
<ul>
<li>Monthly food packages</li>
<li>Rent and utility assistance</li>
<li>Medical expense support</li>
<li>School fees for orphaned children</li>
<li>Emotional and spiritual support</li>
</ul>

<h3>Current Beneficiaries</h3>
<p>We currently support 45 widows and 78 orphans on a regular basis. Your donations help us expand this vital ministry.</p>`,
      imageUrl: "/img/pictures/2/040.jpg",
      goalAmount: 30000,
      raisedAmount: 22500,
      startDate: new Date("2024-01-01"),
      endDate: null,
      status: "ongoing",
      category: "community",
      isFeatured: false,
      isPublished: true,
    },
    {
      id: "proj_church_van",
      title: "Church Transportation Van",
      slug: "church-transportation-van",
      description: "Purchase of a 30-seater bus to transport elderly members and facilitate ministry activities.",
      content: `<h2>Mobility for Ministry</h2>
<p>Many of our elderly members and those without personal transportation struggle to attend services and church activities. A dedicated church van will solve this problem and enable us to conduct more outreach activities.</p>

<h3>Uses</h3>
<ul>
<li>Sunday pickup service for elderly and disabled members</li>
<li>Youth group excursions and retreats</li>
<li>Outreach and evangelism trips</li>
<li>Hospital and home visitation</li>
</ul>`,
      imageUrl: "/img/pictures/2/050.jpg",
      goalAmount: 45000,
      raisedAmount: 45000,
      startDate: new Date("2024-06-01"),
      endDate: new Date("2025-02-28"),
      status: "completed",
      category: "general",
      isFeatured: false,
      isPublished: true,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: project,
    });
  }

  console.log(`✅ Seeded ${projects.length} projects`);

  // ── Ministry Leadership Groups ──────────────────────────────────
  const ministryLeadershipGroups = [
    {
      id: "lg_aged",
      name: "The Aged Ministry",
      slug: "aged",
      type: "ministry",
      description: "A fellowship for our senior members, providing spiritual support, health awareness, and community engagement for those 60 years and above.",
      imageUrl: "/img/pictures/2/001.jpg",
      order: 1,
    },
    {
      id: "lg_men",
      name: "Men's Fellowship (PMF)",
      slug: "men",
      type: "ministry",
      description: "The Presby Men's Fellowship builds godly men through discipleship, brotherhood, and service to the church and community.",
      imageUrl: "/img/pictures/2/020.jpg",
      order: 2,
    },
    {
      id: "lg_women",
      name: "Women's Fellowship (PWF)",
      slug: "women",
      type: "ministry",
      description: "Empowering women to grow in faith, fellowship, and service through Bible study, prayer, and community outreach.",
      imageUrl: "/img/pictures/2/030.jpg",
      order: 3,
    },
    {
      id: "lg_ypg",
      name: "Young People's Guild (Y.P.G.)",
      slug: "ypg",
      type: "ministry",
      description: "Nurturing the next generation in faith and Christian values through fellowship, leadership development, and service.",
      imageUrl: "/img/pictures/2/050.jpg",
      order: 4,
    },
    {
      id: "lg_choir",
      name: "Choir Ministry",
      slug: "choir",
      type: "ministry",
      description: "Leading the congregation in worship through song and instruments, glorifying God with musical excellence.",
      imageUrl: "/img/pictures/2/040.jpg",
      order: 5,
    },
    {
      id: "lg_children",
      name: "Children's Ministry",
      slug: "children",
      type: "ministry",
      description: "Nurturing young hearts in God's word through engaging Bible lessons, worship, and activities for ages 2-12.",
      imageUrl: "/img/pictures/2/010.jpg",
      order: 6,
    },
  ];

  for (const group of ministryLeadershipGroups) {
    await prisma.leadershipGroup.upsert({
      where: { id: group.id },
      update: { imageUrl: group.imageUrl, description: group.description },
      create: group,
    });
  }

  // ── Leadership Positions ────────────────────────────────────────
  const leadershipPositions = [
    // Aged Ministry
    { id: "pos_aged_president", title: "President", groupId: "lg_aged", order: 1 },
    { id: "pos_aged_vice", title: "Vice President", groupId: "lg_aged", order: 2 },
    { id: "pos_aged_secretary", title: "Secretary", groupId: "lg_aged", order: 3 },
    { id: "pos_aged_treasurer", title: "Treasurer", groupId: "lg_aged", order: 4 },
    // Men's Fellowship
    { id: "pos_men_president", title: "President", groupId: "lg_men", order: 1 },
    { id: "pos_men_vice", title: "Vice President", groupId: "lg_men", order: 2 },
    { id: "pos_men_secretary", title: "Secretary", groupId: "lg_men", order: 3 },
    { id: "pos_men_treasurer", title: "Treasurer", groupId: "lg_men", order: 4 },
    // Women's Fellowship
    { id: "pos_women_president", title: "President", groupId: "lg_women", order: 1 },
    { id: "pos_women_vice", title: "Vice President", groupId: "lg_women", order: 2 },
    { id: "pos_women_secretary", title: "Secretary", groupId: "lg_women", order: 3 },
    { id: "pos_women_treasurer", title: "Treasurer", groupId: "lg_women", order: 4 },
    // YPG
    { id: "pos_ypg_president", title: "President", groupId: "lg_ypg", order: 1 },
    { id: "pos_ypg_vice", title: "Vice President", groupId: "lg_ypg", order: 2 },
    { id: "pos_ypg_secretary", title: "Secretary", groupId: "lg_ypg", order: 3 },
    { id: "pos_ypg_treasurer", title: "Treasurer", groupId: "lg_ypg", order: 4 },
    // Choir
    { id: "pos_choir_master", title: "Choirmaster", groupId: "lg_choir", order: 1 },
    { id: "pos_choir_asst", title: "Assistant Choirmaster", groupId: "lg_choir", order: 2 },
    { id: "pos_choir_secretary", title: "Secretary", groupId: "lg_choir", order: 3 },
    { id: "pos_choir_organist", title: "Organist", groupId: "lg_choir", order: 4 },
  ];

  for (const position of leadershipPositions) {
    await prisma.leadershipPosition.upsert({
      where: { id: position.id },
      update: {},
      create: position,
    });
  }

  // ── Leadership Members ──────────────────────────────────────────
  const leadershipMembers = [
    // Aged Ministry - Current
    { id: "lm_aged_1", firstName: "Kofi", lastName: "Asante", title: "Elder", positionId: "pos_aged_president", startDate: new Date("2023-01-01"), isCurrent: true, imageUrl: "/img/pictures/2/001.jpg" },
    { id: "lm_aged_2", firstName: "Akua", lastName: "Mensah", title: "Mrs.", positionId: "pos_aged_vice", startDate: new Date("2023-01-01"), isCurrent: true, imageUrl: "/img/pictures/2/002.jpg" },
    { id: "lm_aged_3", firstName: "Kwame", lastName: "Owusu", title: "Elder", positionId: "pos_aged_secretary", startDate: new Date("2023-01-01"), isCurrent: true },
    { id: "lm_aged_4", firstName: "Ama", lastName: "Darko", title: "Mrs.", positionId: "pos_aged_treasurer", startDate: new Date("2023-01-01"), isCurrent: true },
    // Aged Ministry - Past
    { id: "lm_aged_5", firstName: "Samuel", lastName: "Boateng", title: "Elder", positionId: "pos_aged_president", startDate: new Date("2019-01-01"), endDate: new Date("2022-12-31"), isCurrent: false },
    { id: "lm_aged_6", firstName: "Grace", lastName: "Amponsah", title: "Mrs.", positionId: "pos_aged_vice", startDate: new Date("2019-01-01"), endDate: new Date("2022-12-31"), isCurrent: false },
    
    // Men's Fellowship - Current
    { id: "lm_men_1", firstName: "James", lastName: "Owusu", title: "Elder", positionId: "pos_men_president", startDate: new Date("2024-01-01"), isCurrent: true, imageUrl: "/img/pictures/2/020.jpg" },
    { id: "lm_men_2", firstName: "Daniel", lastName: "Adjei", title: "Mr.", positionId: "pos_men_vice", startDate: new Date("2024-01-01"), isCurrent: true, imageUrl: "/img/pictures/2/021.jpg" },
    { id: "lm_men_3", firstName: "Emmanuel", lastName: "Tetteh", title: "Mr.", positionId: "pos_men_secretary", startDate: new Date("2024-01-01"), isCurrent: true },
    { id: "lm_men_4", firstName: "Joseph", lastName: "Ankrah", title: "Mr.", positionId: "pos_men_treasurer", startDate: new Date("2024-01-01"), isCurrent: true },
    
    // Women's Fellowship - Current
    { id: "lm_women_1", firstName: "Abena", lastName: "Mensah", title: "Rev. Mrs.", positionId: "pos_women_president", startDate: new Date("2023-06-01"), isCurrent: true, imageUrl: "/img/pictures/2/010.jpg" },
    { id: "lm_women_2", firstName: "Comfort", lastName: "Asare", title: "Mrs.", positionId: "pos_women_vice", startDate: new Date("2023-06-01"), isCurrent: true, imageUrl: "/img/pictures/2/011.jpg" },
    { id: "lm_women_3", firstName: "Patience", lastName: "Osei", title: "Mrs.", positionId: "pos_women_secretary", startDate: new Date("2023-06-01"), isCurrent: true },
    { id: "lm_women_4", firstName: "Felicia", lastName: "Boadu", title: "Mrs.", positionId: "pos_women_treasurer", startDate: new Date("2023-06-01"), isCurrent: true },
    
    // YPG - Current
    { id: "lm_ypg_1", firstName: "Kwame", lastName: "Boateng", title: "Pastor", positionId: "pos_ypg_president", startDate: new Date("2024-01-01"), isCurrent: true, imageUrl: "/img/pictures/2/050.jpg" },
    { id: "lm_ypg_2", firstName: "Nana", lastName: "Agyemang", title: "Mr.", positionId: "pos_ypg_vice", startDate: new Date("2024-01-01"), isCurrent: true, imageUrl: "/img/pictures/2/051.jpg" },
    { id: "lm_ypg_3", firstName: "Priscilla", lastName: "Amoah", title: "Miss", positionId: "pos_ypg_secretary", startDate: new Date("2024-01-01"), isCurrent: true },
    { id: "lm_ypg_4", firstName: "Michael", lastName: "Asiedu", title: "Mr.", positionId: "pos_ypg_treasurer", startDate: new Date("2024-01-01"), isCurrent: true },
    
    // Choir - Current
    { id: "lm_choir_1", firstName: "Daniel", lastName: "Adjei", title: "Mr.", positionId: "pos_choir_master", startDate: new Date("2022-01-01"), isCurrent: true, imageUrl: "/img/pictures/2/030.jpg" },
    { id: "lm_choir_2", firstName: "Esther", lastName: "Nyarko", title: "Miss", positionId: "pos_choir_asst", startDate: new Date("2022-01-01"), isCurrent: true, imageUrl: "/img/pictures/2/031.jpg" },
    { id: "lm_choir_3", firstName: "Benjamin", lastName: "Kumi", title: "Mr.", positionId: "pos_choir_secretary", startDate: new Date("2022-01-01"), isCurrent: true },
    { id: "lm_choir_4", firstName: "Victoria", lastName: "Ofosu", title: "Miss", positionId: "pos_choir_organist", startDate: new Date("2022-01-01"), isCurrent: true },
  ];

  for (const member of leadershipMembers) {
    await prisma.leadershipMember.upsert({
      where: { id: member.id },
      update: {},
      create: member,
    });
  }

  console.log(`✅ Seeded ${ministryLeadershipGroups.length} ministry leadership groups with ${leadershipMembers.length} members`);

  // ── Ministry Gallery Albums ─────────────────────────────────────
  const ministryAlbums = [
    {
      id: "album_aged_fellowship",
      title: "Aged Ministry Fellowship 2024",
      slug: "aged-ministry-fellowship-2024",
      description: "Photos from our monthly fellowship meetings and special events",
      published: true,
    },
    {
      id: "album_aged_thanksgiving",
      title: "Aged Ministry Thanksgiving Service",
      slug: "aged-thanksgiving-service",
      description: "Annual thanksgiving celebration with our senior members",
      published: true,
    },
    {
      id: "album_men_retreat",
      title: "Men's Fellowship Retreat 2024",
      slug: "men-fellowship-retreat-2024",
      description: "Photos from our annual men's retreat at Cape Coast",
      published: true,
    },
    {
      id: "album_women_conference",
      title: "Women's Fellowship Conference",
      slug: "women-fellowship-conference",
      description: "Highlights from the Presbyterian Women's Fellowship conference",
      published: true,
    },
    {
      id: "album_ypg_camp",
      title: "YPG Youth Camp 2024",
      slug: "ypg-youth-camp-2024",
      description: "Exciting moments from our annual youth camp",
      published: true,
    },
    {
      id: "album_choir_concert",
      title: "Choir Christmas Concert",
      slug: "choir-christmas-concert",
      description: "Photos from our annual Christmas cantata and concert",
      published: true,
    },
  ];

  for (const album of ministryAlbums) {
    await prisma.galleryAlbum.upsert({
      where: { id: album.id },
      update: {},
      create: album,
    });
  }

  // ── Gallery Images ──────────────────────────────────────────────
  const galleryImages = [
    // Aged Ministry Fellowship
    { id: "img_aged_1", albumId: "album_aged_fellowship", url: "/img/pictures/2/001.jpg", caption: "Fellowship meeting opening prayer", order: 1 },
    { id: "img_aged_2", albumId: "album_aged_fellowship", url: "/img/pictures/2/002.jpg", caption: "Bible study session", order: 2 },
    { id: "img_aged_3", albumId: "album_aged_fellowship", url: "/img/pictures/2/003.jpg", caption: "Group photo of members", order: 3 },
    { id: "img_aged_4", albumId: "album_aged_fellowship", url: "/img/pictures/2/004.jpg", caption: "Refreshments and fellowship", order: 4 },
    // Aged Thanksgiving
    { id: "img_aged_5", albumId: "album_aged_thanksgiving", url: "/img/pictures/2/005.jpg", caption: "Thanksgiving service worship", order: 1 },
    { id: "img_aged_6", albumId: "album_aged_thanksgiving", url: "/img/pictures/2/006.jpg", caption: "Special recognition ceremony", order: 2 },
    { id: "img_aged_7", albumId: "album_aged_thanksgiving", url: "/img/pictures/2/007.jpg", caption: "Cutting the anniversary cake", order: 3 },
    // Men's Retreat
    { id: "img_men_1", albumId: "album_men_retreat", url: "/img/pictures/2/020.jpg", caption: "Opening session at the retreat center", order: 1 },
    { id: "img_men_2", albumId: "album_men_retreat", url: "/img/pictures/2/021.jpg", caption: "Group discussion time", order: 2 },
    { id: "img_men_3", albumId: "album_men_retreat", url: "/img/pictures/2/022.jpg", caption: "Team building activities", order: 3 },
    { id: "img_men_4", albumId: "album_men_retreat", url: "/img/pictures/2/023.jpg", caption: "Evening devotion", order: 4 },
    { id: "img_men_5", albumId: "album_men_retreat", url: "/img/pictures/2/024.jpg", caption: "Group photo at the beach", order: 5 },
    // Women's Conference
    { id: "img_women_1", albumId: "album_women_conference", url: "/img/pictures/2/010.jpg", caption: "Conference opening ceremony", order: 1 },
    { id: "img_women_2", albumId: "album_women_conference", url: "/img/pictures/2/011.jpg", caption: "Keynote speaker address", order: 2 },
    { id: "img_women_3", albumId: "album_women_conference", url: "/img/pictures/2/012.jpg", caption: "Workshop session", order: 3 },
    { id: "img_women_4", albumId: "album_women_conference", url: "/img/pictures/2/013.jpg", caption: "Prayer and intercession", order: 4 },
    // YPG Camp
    { id: "img_ypg_1", albumId: "album_ypg_camp", url: "/img/pictures/2/050.jpg", caption: "Camp registration", order: 1 },
    { id: "img_ypg_2", albumId: "album_ypg_camp", url: "/img/pictures/2/051.jpg", caption: "Praise and worship session", order: 2 },
    { id: "img_ypg_3", albumId: "album_ypg_camp", url: "/img/pictures/2/052.jpg", caption: "Bible quiz competition", order: 3 },
    { id: "img_ypg_4", albumId: "album_ypg_camp", url: "/img/pictures/2/053.jpg", caption: "Sports activities", order: 4 },
    { id: "img_ypg_5", albumId: "album_ypg_camp", url: "/img/pictures/2/054.jpg", caption: "Bonfire night", order: 5 },
    { id: "img_ypg_6", albumId: "album_ypg_camp", url: "/img/pictures/2/055.jpg", caption: "Closing ceremony", order: 6 },
    // Choir Concert
    { id: "img_choir_1", albumId: "album_choir_concert", url: "/img/pictures/2/030.jpg", caption: "Choir in full regalia", order: 1 },
    { id: "img_choir_2", albumId: "album_choir_concert", url: "/img/pictures/2/031.jpg", caption: "Solo performance", order: 2 },
    { id: "img_choir_3", albumId: "album_choir_concert", url: "/img/pictures/2/032.jpg", caption: "Orchestra accompaniment", order: 3 },
    { id: "img_choir_4", albumId: "album_choir_concert", url: "/img/pictures/2/033.jpg", caption: "Standing ovation", order: 4 },
  ];

  for (const image of galleryImages) {
    await prisma.galleryImage.upsert({
      where: { id: image.id },
      update: {},
      create: image,
    });
  }

  console.log(`✅ Seeded ${ministryAlbums.length} ministry albums with ${galleryImages.length} images`);

  // ── Ministry Events ─────────────────────────────────────────────
  const ministryEvents = [
    // Aged Ministry Events
    {
      id: "evt_aged_fellowship",
      title: "Aged Ministry Monthly Fellowship",
      slug: "aged-monthly-fellowship-april",
      description: "Join us for our monthly fellowship meeting with Bible study, prayer, and refreshments.",
      category: "aged",
      startDate: new Date("2026-04-05"),
      startTime: "10:00",
      endTime: "13:00",
      location: "Fellowship Hall",
      published: true,
    },
    {
      id: "evt_aged_health",
      title: "Health Screening for Seniors",
      slug: "aged-health-screening",
      description: "Free health screening including blood pressure, blood sugar, and general checkup for our senior members.",
      category: "aged",
      startDate: new Date("2026-04-20"),
      startTime: "09:00",
      endTime: "14:00",
      location: "Church Premises",
      published: true,
    },
    // Men's Fellowship Events
    {
      id: "evt_men_bible",
      title: "Men's Bible Study",
      slug: "men-bible-study-april",
      description: "Weekly Bible study focusing on 'Men of Valor' series. All men are welcome.",
      category: "men",
      startDate: new Date("2026-04-12"),
      startTime: "07:00",
      endTime: "09:00",
      location: "Conference Room",
      published: true,
    },
    {
      id: "evt_men_retreat",
      title: "Annual Men's Retreat",
      slug: "men-annual-retreat-2026",
      description: "A weekend of spiritual renewal, fellowship, and team building at Akosombo.",
      category: "men",
      startDate: new Date("2026-05-15"),
      endDate: new Date("2026-05-17"),
      startTime: "06:00",
      endTime: "18:00",
      location: "Akosombo Continental Hotel",
      published: true,
    },
    // Women's Fellowship Events
    {
      id: "evt_women_prayer",
      title: "Women's Prayer Breakfast",
      slug: "women-prayer-breakfast-april",
      description: "Monthly prayer breakfast with a focus on family and community intercession.",
      category: "women",
      startDate: new Date("2026-04-18"),
      startTime: "06:30",
      endTime: "09:00",
      location: "Fellowship Hall",
      published: true,
    },
    {
      id: "evt_women_seminar",
      title: "Marriage Enrichment Seminar",
      slug: "women-marriage-seminar",
      description: "A special seminar for couples on building stronger marriages. Facilitated by Rev. Mrs. Abena Mensah.",
      category: "women",
      startDate: new Date("2026-04-26"),
      startTime: "14:00",
      endTime: "17:00",
      location: "Main Auditorium",
      published: true,
    },
    // YPG Events
    {
      id: "evt_ypg_fellowship",
      title: "YPG Sunday Fellowship",
      slug: "ypg-sunday-fellowship-april",
      description: "Weekly youth fellowship with praise, worship, Bible study, and discussions on relevant topics.",
      category: "ypg",
      startDate: new Date("2026-04-06"),
      startTime: "15:00",
      endTime: "17:30",
      location: "Youth Hall",
      published: true,
    },
    {
      id: "evt_ypg_career",
      title: "Career Mentorship Programme",
      slug: "ypg-career-mentorship",
      description: "Connect with professionals in various fields for career guidance and mentorship.",
      category: "ypg",
      startDate: new Date("2026-04-27"),
      startTime: "14:00",
      endTime: "17:00",
      location: "Conference Room",
      published: true,
    },
    // Choir Events
    {
      id: "evt_choir_rehearsal",
      title: "Choir Weekly Rehearsal",
      slug: "choir-rehearsal-april",
      description: "Regular choir rehearsal. All choir members are expected to attend.",
      category: "choir",
      startDate: new Date("2026-04-10"),
      startTime: "18:00",
      endTime: "20:00",
      location: "Main Sanctuary",
      published: true,
    },
    {
      id: "evt_choir_workshop",
      title: "Vocal Training Workshop",
      slug: "choir-vocal-workshop",
      description: "Special vocal training session with guest instructor from the National Symphony Orchestra.",
      category: "choir",
      startDate: new Date("2026-04-24"),
      startTime: "14:00",
      endTime: "17:00",
      location: "Main Sanctuary",
      published: true,
    },
  ];

  for (const event of ministryEvents) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: event,
    });
  }

  console.log(`✅ Seeded ${ministryEvents.length} ministry events`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
