const blogposts = [
    {
      id: 1,
      title: 'Day 1: Stepping into Manila – History, Parks, and the Bay',
      date: 'April 7, 2025',
      readTime: 5,
      excerpt: 'We kicked off our educational trip with a day exploring the heart of Manila—from the historic walls of Intramuros to the iconic Rizal Park and the bustling Mall of Asia.',
      coverImage: '/blog/day1-coverpage.jpg',
      tags: ['Career', 'Personal'],
      content: [
        {
          text: 'Our journey began with excitement as we arrived in Manila. The city buzzed with energy, and we couldn’t wait to explore what it had to offer. After settling in, we immediately set out to begin our adventure.'
        },
        {
          heading: 'Intramuros: The Walled City',
          text: 'Our first destination was Intramuros, a historic district that dates back to the Spanish colonial period. We visited landmarks like Fort Santiago and San Agustin Church, admired the Spanish-inspired architecture, and walked through cobblestone streets that whispered stories from the past. It was both educational and awe-inspiring to stand in a place so central to our national heritage.',
          image: '/blog/day1-blog1.jpg',
          imageAlt: 'Fort Santiago in Intramuros',
          imageCaption: 'Exploring Fort Santiago, a key piece of Philippine colonial history'
        },
        {
          heading: 'Rizal Park: Honoring a National Hero',
          text: 'Next, we visited Rizal Park (Luneta), one of the most significant historical sites in the Philippines. Here, we paid tribute to Dr. José Rizal at his monument and reflected on his sacrifice for the country. The wide open spaces and well-kept gardens made for a peaceful stop amid the bustling city.',
          image: '/blog/day1-blog2.jpg',
          imageAlt: 'Rizal Monument in Luneta Park',
          imageCaption: 'A moment of reflection at the Rizal Monument in Luneta Park'
        },
        {
          heading: 'Mall of Asia: City Lights and Coastal Views',
          text: 'We wrapped up the day at the Mall of Asia (MOA), one of the largest malls in Asia. Aside from shopping and food trips, we enjoyed the scenic view of Manila Bay from the seaside area. It was a fun and relaxing way to end our first day.',
          image: '/blog/day1-done.jpg',
          imageAlt: 'Mirror shot on Mall of Asia ',
          imageCaption: 'Sunset views at MOA—relaxing by the bay after a full day of exploring'
        },
        {
          text: 'Day 1 set the tone for the rest of our trip—blending history, culture, and leisure. It reminded us that learning doesn’t always happen in classrooms; sometimes, it’s found in the streets, stories, and landmarks of the places we visit.',
          image: '/blog/day1-blog3.jpg',
          imageAlt: 'Sunset in Manila Bay',
          imageCaption: 'Such a beautiful experience to witness the sunset on Manila Bay'
        }
      ]
    },
    {
      id: 2,
      title: 'Day 2: Inside Subic Bay Port – Trade, Technology, and Art',
      date: 'April 8, 2025',
      readTime: 4,
      excerpt: 'Our second day took us to Subic Bay Port, where we explored the port’s role in international trade, saw high-tech security systems in action, and found creativity inside the convention center.',
      coverImage: '/blog/day2-coverpage.jpg',
      tags: ['Subic', 'Logistics', 'Port Operations', 'Art'],
      content: [
        {
          heading: 'Subic Bay Port Admission Building',
          text: 'Our day began at the Port Admission Building of Subic Bay, where we were introduced to the port’s key role in facilitating international trade. The staff gave us an insightful orientation on how imports and exports are processed, how international ships are docked and handled, and how logistics are managed across the region.',
          image: '/blog/day2-blog4.jpg',
          imageAlt: 'Subic Bay Port building exterior',
          imageCaption: 'At the Port Admission Building – learning how global trade flows through Subic'
        },
        {
          heading: 'Port Police and CCTV Command Center',
          text: 'We then visited the port’s police station, where we were shown their high-functioning surveillance system. The staff demonstrated how their CCTV technology helps maintain port safety and efficiently monitor movements within the area. It was impressive to see real-time monitoring with such accuracy and scale.',
          image: '/blog/day2-blog3.jpg',
          imageAlt: 'CCTV monitoring screens inside the police station',
          imageCaption: 'A look inside the command center – real-time monitoring at Subic Port'
        },
        {
          heading: 'Subic Convention Center: Art Amid Industry',
          text: 'To end the day, we visited the Subic Convention Center. Surprisingly, it featured a beautiful exhibit of local and cultural artworks inside—a refreshing contrast to the industrial atmosphere of the port. It reminded us that even in places of commerce and trade, there’s room to celebrate creativity and culture.',
          image: '/blog/day2-blog2.jpg',
          imageAlt: 'Art exhibit inside Subic Convention Center',
          imageCaption: 'A quiet space for art and culture in the heart of an industrial hub'
        },
        {
          text: 'Day 2 gave us a behind-the-scenes look at how ports function—not just in terms of ships and cargo, but also safety, systems, and even art. It showed us the bigger picture of how critical infrastructure runs in the background of global commerce.'
        }
      ]
    },
    {
      id: 3,
      title: 'Day 3: Museums and Memories – Nature, History, and Heritage',
      date: 'April 9, 2025',
      readTime: 3,
      excerpt: 'From exploring the wonders of biodiversity to reliving historical milestones, Day 3 immersed us in the rich heritage and culture of the Philippines.',
      coverImage: '/blog/day3-coverpage.jpg',
      tags: ['Museum', 'Culture', 'History'],
      content: [
        {
          heading: 'National Museum of Natural History',
          text: 'Our first stop was the National Museum of Natural History in Manila. It showcased the biodiversity of the Philippines—from unique wildlife to geological formations. The Tree of Life structure in the center was both architecturally stunning and symbolically powerful.',
          image: '/blog/day3-blog1.jpg',
          imageAlt: 'Tree of Life at the museum',
          imageCaption: 'Inside the National Museum – discovering the Philippines’ natural heritage'
        },
        {
          heading: 'Quezon Memorial Shrine',
          text: 'Next, we visited the Quezon Memorial Shrine, where we learned about the life and legacy of former President Manuel L. Quezon. His leadership during a pivotal era in Philippine history left a lasting impression on us.',
          image: '/blog/day3-blog2.jpg',
          imageAlt: 'Quezon Memorial Shrine',
          imageCaption: 'Standing beneath the towering monument honoring President Quezon'
        },
        {
          heading: 'Presidential Car Museum',
          text: 'To end the day, we toured the Presidential Car Museum, which displayed official vehicles used by Philippine presidents over the decades. It offered a unique and personal view into the country’s political past.',
          image: '/blog/day3-blog3.jpg',
          imageAlt: 'Vintage presidential car',
          imageCaption: 'History on wheels – exploring decades of presidential cars'
        }
      ]
    },
    {
      id: 4,
      title: 'Day 4: Technology and Economy – A Look Inside Hytec and BSP',
      date: 'April 10, 2025',
      readTime: 3,
      excerpt: 'We explored the tech industry at Hytec and got a rare glimpse into the central banking system at Bangko Sentral ng Pilipinas.',
      coverImage: '/blog/day4-coverpage.jpg',
      tags: ['Technology', 'Economy', 'Finance'],
      content: [
        {
          heading: 'Hytec Power Inc.',
          text: 'Our visit to Hytec Power Inc. gave us insight into industrial technology and automation. We observed how the company contributes to technical education and equipment manufacturing in the Philippines.',
          image: '/blog/day4-blog1.jpg',
          imageAlt: 'Hytec facility tour',
          imageCaption: 'Learning about automation and engineering at Hytec'
        },
        {
          image: '/blog/day4-blog2.jpg',
        },
        {
          image: '/blog/day4-blog3.jpg',
        }

      ]
    },
    {
      id: 5,
      title: 'Day 5: Systems in Motion – MMDA and LRT Line 2',
      date: 'April 11, 2025',
      readTime: 4,
      excerpt: 'We gained firsthand insight into traffic monitoring at MMDA and explored the systems behind Metro Manila’s light rail operations.',
      coverImage: '/photo_2025-05-05_16-07-34.jpg',
      tags: ['Transport', 'Infrastructure', 'Technology'],
      content: [
        {
          heading: 'MMDA Command Center, Pasig',
          text: 'At the MMDA office in Pasig, we were shown the live operations of their CCTV control center. It was fascinating to see how they monitor traffic and respond to emergencies in real time.',
          image: '/photo_2025-05-05_16-07-32.jpg',
          imageAlt: 'MMDA CCTV room',
          imageCaption: 'A live view of how Metro Manila traffic is managed 24/7'
        },
        {
          heading: 'LRT Line 2 Operations',
          text: 'Later, we toured the LRT Line 2 facility. Aside from riding the train, we visited the maintenance area where trains are repaired and maintained. It was a behind-the-scenes look at how Metro Manila’s transit system operates.',
          image: '/photo_2025-05-05_16-07-35.jpg',
          imageAlt: 'Train maintenance facility',
          imageCaption: 'Where the trains sleep – maintenance in motion at LRT Line 2'
        },
        {
          heading: 'LRT Line 2 Operations',
          text: 'Later, we toured the LRT Line 2 facility. Aside from riding the train, we visited the maintenance area where trains are repaired and maintained. It was a behind-the-scenes look at how Metro Manila’s transit system operates.',
          image: '/photo_2025-05-05_16-07-45.jpg',
          imageAlt: 'Train maintenance facility',
        }

      ]
    },
    {
      id: 6,
      title: 'Day 6: Road to Baguio – Strawberries, Bells, and Cadets',
      date: 'April 12, 2025',
      readTime: 3,
      excerpt: 'We made our way to Baguio, stopping at La Trinidad’s strawberry farms, the Chinese Bell Tower, and the historic Philippine Military Academy.',
      coverImage: '/blog/day6.jpg',
      tags: ['Baguio', 'Culture', 'Nature'],
      content: [
        {
          heading: 'La Trinidad Strawberry Farm',
          text: 'Our first stop in the highlands was the La Trinidad Strawberry Farm. We enjoyed the cool breeze and got to see how strawberries are grown and harvested—a local pride of Benguet.',
          image: '/blog/day6 photo_2025-05-05_16-11-15.jpg',
          imageAlt: 'Rows of strawberries in La Trinidad',
          imageCaption: 'Fresh from the farm – La Trinidad’s sweet pride'
        },
        {
          heading: 'Chinese Bell Tower',
          text: 'Next, we visited the Chinese Bell Tower in Baguio. The location offered a quiet moment for reflection and a beautiful view of the city’s skyline.',
          image: '/blog/day6 photo_2025-05-05_16-11-22.jpg',
          imageAlt: 'Chinese Bell in Baguio',
          imageCaption: 'Harmony and history at Baguio’s Chinese Bell Tower'
        },
        {
          heading: 'Philippine Military Academy (PMA)',
          text: 'We ended the day at the Philippine Military Academy, where we learned about the life of cadets and saw impressive displays of discipline and military tradition.',
          image: '/blog/day6-pma.jpg',
          imageAlt: 'PMA entrance or parade ground',
          imageCaption: 'Where leaders are forged – visiting the PMA grounds'
        }
      ]
    },
    {
      id: 7,
      title: 'Day 7: Leisure in the Highlands – Burnham Park Adventures',
      date: 'April 13, 2025',
      readTime: 2,
      excerpt: 'Our final day in Baguio gave us time to relax, explore, and enjoy the beauty and charm of Burnham Park.',
      coverImage: '/blog/day7-coverpage.jpg',
      tags: ['Baguio', 'Leisure', 'Parks'],
      content: [
        {
          heading: 'Burnham Park Activities',
          text: 'With no official schedule, we spent the day at Burnham Park. We went boating on the lake, rode bikes, and enjoyed street food around the park. It was the perfect way to unwind and reflect on an amazing week.',
          image: '/blog/day7-blog1.jpg',
          imageAlt: 'Enjoying our free day',
          imageCaption: 'Relaxing by the lake – free time well spent at Burnham Park'
        },
        {
          image: '/blog/day7.jpg',
          text: 'This final day reminded us that balance is essential—even on educational trips. Sometimes the best lessons come when we slow down and simply enjoy the moment.'
        }
      ]
    }
                    
    
  ];
  
  export default blogposts;
