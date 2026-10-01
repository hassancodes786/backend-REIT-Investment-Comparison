const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDB = require("./config/db");

const Reit = require("./models/Reit");
const Property = require("./models/Property");
const Invit = require("./models/Invit");
const User = require("./models/User");
const Investment = require("./models/Investment");


// ===============================
// REIT DATA
// ===============================

const reits = [
  {
    name: "Embassy Office Parks REIT",
    ticker: "EMBASSY",
    sector: "Office",
    price: 400,
    marketCap: 40000,
    dividendYield: 6.5,
    annualDistribution: 26,
    occupancy: 87,
    debt: 15000,
    return1Y: 12.4,
    return3Y: 28,
    return5Y: 42,
    volatility: 18,
    riskScore: 6.2,
    description:
      "A large office-focused REIT with diversified business park assets.",

    performance: [
      {
        year: "2022",
        return: 5.2,
        dividend: 18.2
      },
      {
        year: "2023",
        return: 8.7,
        dividend: 20.1
      },
      {
        year: "2024",
        return: 14.1,
        dividend: 22.4
      },
      {
        year: "2025",
        return: 12.4,
        dividend: 24.5
      },
      {
        year: "2026",
        return: 10.2,
        dividend: 26
      }
    ]
  },


  {
    name: "Mindspace Business Parks REIT",
    ticker: "MINDSPACE",
    sector: "Office",
    price: 390,
    marketCap: 24000,
    dividendYield: 6.8,
    annualDistribution: 26.5,
    occupancy: 91,
    debt: 7500,
    return1Y: 15.2,
    return3Y: 35,
    return5Y: 51,
    volatility: 15,
    riskScore: 5.7,
    description:
      "An office REIT with diversified assets across major Indian markets.",

    performance: [
      {
        year: "2022",
        return: 6.8,
        dividend: 17.8
      },
      {
        year: "2023",
        return: 10.4,
        dividend: 20.2
      },
      {
        year: "2024",
        return: 16.2,
        dividend: 22.8
      },
      {
        year: "2025",
        return: 15.2,
        dividend: 25.1
      },
      {
        year: "2026",
        return: 13.5,
        dividend: 26.5
      }
    ]
  },


  {
    name: "Brookfield India Real Estate Trust",
    ticker: "BROOKFIELD",
    sector: "Office",
    price: 320,
    marketCap: 18000,
    dividendYield: 7.1,
    annualDistribution: 22.7,
    occupancy: 89,
    debt: 8000,
    return1Y: 10.8,
    return3Y: 24,
    return5Y: 38,
    volatility: 19,
    riskScore: 6.8,
    description:
      "An office-focused REIT with commercial assets across major markets.",

    performance: [
      {
        year: "2022",
        return: 3.5,
        dividend: 15.1
      },
      {
        year: "2023",
        return: 7.2,
        dividend: 17.2
      },
      {
        year: "2024",
        return: 12.5,
        dividend: 19.4
      },
      {
        year: "2025",
        return: 10.8,
        dividend: 21.3
      },
      {
        year: "2026",
        return: 9.4,
        dividend: 22.7
      }
    ]
  },


  {
    name: "Nexus Select Trust",
    ticker: "NEXUS",
    sector: "Retail",
    price: 150,
    marketCap: 18000,
    dividendYield: 5.9,
    annualDistribution: 8.85,
    occupancy: 96,
    debt: 6500,
    return1Y: 17.4,
    return3Y: 31,
    return5Y: 40,
    volatility: 16,
    riskScore: 5.9,
    description:
      "A retail-focused REIT with shopping centre assets.",

    performance: [
      {
        year: "2023",
        return: 4.5,
        dividend: 6.2
      },
      {
        year: "2024",
        return: 11.7,
        dividend: 7
      },
      {
        year: "2025",
        return: 17.4,
        dividend: 8.1
      },
      {
        year: "2026",
        return: 13.2,
        dividend: 8.85
      }
    ]
  }
];


// ===============================
// PROPERTY DATA
// ===============================

const properties = [
  {
    name: "Skyline Business Tower",
    location: "Bandra Kurla Complex, Mumbai",
    city: "Mumbai",
    type: "Commercial",
    price: 5000000,
    area: 850,
    bedrooms: 0,
    bathrooms: 1,
    rentalYield: 8.2,
    appreciation: 10.5,
    occupancy: 94,
    developer: "Skyline Developers",
    status: "Ready to Invest",
    description:
      "Premium commercial office property located in a major business district.",
    amenities: [
      "24/7 Security",
      "Parking",
      "Power Backup",
      "High Speed Elevators",
      "CCTV",
      "Business Lounge"
    ],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
  },


  {
    name: "Green Valley Residences",
    location: "Thane West, Maharashtra",
    city: "Thane",
    type: "Residential",
    price: 7500000,
    area: 1250,
    bedrooms: 2,
    bathrooms: 2,
    rentalYield: 5.8,
    appreciation: 9.2,
    occupancy: 96,
    developer: "Green Valley Builders",
    status: "Available",
    description:
      "Modern residential apartment in a growing location with strong rental demand.",
    amenities: [
      "Swimming Pool",
      "Gym",
      "Parking",
      "Garden",
      "Club House",
      "Security"
    ],
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
  },


  {
    name: "Harbor View Offices",
    location: "Lower Parel, Mumbai",
    city: "Mumbai",
    type: "Commercial",
    price: 12000000,
    area: 1800,
    bedrooms: 0,
    bathrooms: 2,
    rentalYield: 7.6,
    appreciation: 11.8,
    occupancy: 92,
    developer: "Harbor Properties",
    status: "Available",
    description:
      "High-end commercial office space located in one of Mumbai's prime business locations.",
    amenities: [
      "Reception",
      "Parking",
      "Security",
      "Conference Room",
      "Power Backup",
      "Elevators"
    ],
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"
  },


  {
    name: "Palm Residency",
    location: "Pune, Maharashtra",
    city: "Pune",
    type: "Residential",
    price: 4200000,
    area: 950,
    bedrooms: 2,
    bathrooms: 2,
    rentalYield: 6.1,
    appreciation: 8.7,
    occupancy: 95,
    developer: "Palm Developers",
    status: "Ready to Invest",
    description:
      "Affordable residential investment opportunity with good rental potential.",
    amenities: [
      "Parking",
      "Gym",
      "Garden",
      "Security",
      "Children's Area"
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },


  {
    name: "Tech Park Retail Unit",
    location: "Whitefield, Bengaluru",
    city: "Bengaluru",
    type: "Retail",
    price: 6500000,
    area: 700,
    bedrooms: 0,
    bathrooms: 1,
    rentalYield: 9.1,
    appreciation: 10.2,
    occupancy: 97,
    developer: "Tech Park Estates",
    status: "Available",
    description:
      "Retail investment property located near a major technology and residential hub.",
    amenities: [
      "Parking",
      "Security",
      "Food Court",
      "CCTV",
      "Power Backup"
    ],
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
  },


  {
    name: "Lakeview Premium Apartment",
    location: "Powai, Mumbai",
    city: "Mumbai",
    type: "Residential",
    price: 9500000,
    area: 1450,
    bedrooms: 3,
    bathrooms: 3,
    rentalYield: 5.6,
    appreciation: 12.4,
    occupancy: 98,
    developer: "Lakeview Realty",
    status: "Available",
    description:
      "Premium residential apartment with strong rental demand and long-term appreciation potential.",
    amenities: [
      "Swimming Pool",
      "Gym",
      "Club House",
      "Parking",
      "Security",
      "Lake View"
    ],
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
  }
];


// ===============================
// INVIT DATA
// ===============================

const invits = [
  {
    name: "India Grid Trust",
    ticker: "INDIGRID",
    sector: "Power Transmission",
    price: 142.5,
    marketCap: 11200,
    distributionYield: 9.8,
    annualDistribution: 14.1,
    nav: 148,
    assetValue: 22000,
    aum: 23500,
    debt: 11500,
    return1Y: 14.5,
    return3Y: 34,
    return5Y: 62,
    volatility: 12.5,
    riskScore: 4.8,
    description:
      "India Grid Trust (IndiGrid) is India's leading power sector infrastructure investment trust, owning and operating power transmission and renewable assets across India.",
    assets: [
      {
        name: "Bhopal Dhule Transmission",
        type: "Transmission Line",
        location: "Madhya Pradesh & Maharashtra"
      },
      {
        name: "Jabalpur Transmission",
        type: "Substation & Line",
        location: "Madhya Pradesh"
      },
      {
        name: "Parbati Koldam Transmission",
        type: "High Voltage Line",
        location: "Himachal Pradesh & Punjab"
      }
    ],
    performance: [
      {
        year: "2023",
        return: 11.2,
        distribution: 13.2
      },
      {
        year: "2024",
        return: 15.6,
        distribution: 13.8
      },
      {
        year: "2025",
        return: 14.5,
        distribution: 14.1
      },
      {
        year: "2026",
        return: 12.8,
        distribution: 14.3
      }
    ]
  },
  {
    name: "PowerGrid Infrastructure Investment Trust",
    ticker: "PGINVIT",
    sector: "Power Transmission",
    price: 98.4,
    marketCap: 8900,
    distributionYield: 11.5,
    annualDistribution: 11.8,
    nav: 104.5,
    assetValue: 12500,
    aum: 13000,
    debt: 3200,
    return1Y: 9.8,
    return3Y: 26.5,
    return5Y: 48,
    volatility: 11,
    riskScore: 4.2,
    description:
      "Sponsored by Power Grid Corporation of India (a Maharatna CPSE), PGInvIT manages high-voltage power transmission assets with sovereign backing and consistent distribution.",
    assets: [
      {
        name: "PVTL - Powergrid Vizag",
        type: "Power Transmission",
        location: "Andhra Pradesh"
      },
      {
        name: "PKATL - Kala Amb",
        type: "Transmission Line",
        location: "Himachal Pradesh"
      },
      {
        name: "PPTL - Parbati",
        type: "Substation",
        location: "Himachal Pradesh"
      }
    ],
    performance: [
      {
        year: "2023",
        return: 8.5,
        distribution: 11
      },
      {
        year: "2024",
        return: 12.1,
        distribution: 11.5
      },
      {
        year: "2025",
        return: 9.8,
        distribution: 11.8
      },
      {
        year: "2026",
        return: 10.2,
        distribution: 12
      }
    ]
  },
  {
    name: "IRB InvIT Fund",
    ticker: "IRBINVIT",
    sector: "Roads",
    price: 68.2,
    marketCap: 3950,
    distributionYield: 12.2,
    annualDistribution: 8.35,
    nav: 82,
    assetValue: 7800,
    aum: 8200,
    debt: 3900,
    return1Y: 18.2,
    return3Y: 42,
    return5Y: 55,
    volatility: 17.5,
    riskScore: 6.5,
    description:
      "IRB InvIT Fund is India's first listed infrastructure investment trust in the road sector, managing a portfolio of toll road assets across high-traffic national corridors.",
    assets: [
      {
        name: "Surat - Dahisar BOT Project",
        type: "Highway",
        location: "Gujarat & Maharashtra"
      },
      {
        name: "Tumkur - Chitradurga Highway",
        type: "Four Lane Highway",
        location: "Karnataka"
      },
      {
        name: "Bharuch - Surat Project",
        type: "Toll Road",
        location: "Gujarat"
      }
    ],
    performance: [
      {
        year: "2023",
        return: 14.2,
        distribution: 7.8
      },
      {
        year: "2024",
        return: 21,
        distribution: 8.1
      },
      {
        year: "2025",
        return: 18.2,
        distribution: 8.35
      },
      {
        year: "2026",
        return: 16.5,
        distribution: 8.5
      }
    ]
  },
  {
    name: "National Highways Infra Trust",
    ticker: "NHIT",
    sector: "Roads",
    price: 124.8,
    marketCap: 15400,
    distributionYield: 8.9,
    annualDistribution: 11.2,
    nav: 130,
    assetValue: 24000,
    aum: 26000,
    debt: 9800,
    return1Y: 13.8,
    return3Y: 30.5,
    return5Y: 45,
    volatility: 13,
    riskScore: 4.5,
    description:
      "Sponsored by the National Highways Authority of India (NHAI), NHIT operates major national highway corridors with long concession periods and government backing.",
    assets: [
      {
        name: "Abu Road - Palanpur Highway",
        type: "National Highway",
        location: "Rajasthan & Gujarat"
      },
      {
        name: "Chittorgarh - Kota Section",
        type: "Four Lane Highway",
        location: "Rajasthan"
      },
      {
        name: "Belgaum - Maharashtra Border",
        type: "Highway Corridor",
        location: "Karnataka"
      }
    ],
    performance: [
      {
        year: "2023",
        return: 10.4,
        distribution: 10.5
      },
      {
        year: "2024",
        return: 14.8,
        distribution: 11
      },
      {
        year: "2025",
        return: 13.8,
        distribution: 11.2
      },
      {
        year: "2026",
        return: 12.5,
        distribution: 11.4
      }
    ]
  }
];


// ===============================
// SEED DATABASE
// ===============================

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Reit.deleteMany({});
    await Property.deleteMany({});
    await Invit.deleteMany({});
    await User.deleteMany({});
    await Investment.deleteMany({});

    // 1. Insert REITs
    const insertedReits = await Reit.insertMany(reits);
    console.log(`✅ ${insertedReits.length} REITs inserted`);

    // 2. Insert Properties
    const insertedProperties = await Property.insertMany(properties);
    console.log(`✅ ${insertedProperties.length} properties inserted`);

    // 3. Insert InvITs
    const insertedInvits = await Invit.insertMany(invits);
    console.log(`✅ ${insertedInvits.length} InvITs inserted`);

    // 4. Insert Demo Users
    const adminPassword = await bcrypt.hash("Admin@12345", 12);
    const userPassword = await bcrypt.hash("User@12345", 12);

    const adminUser = await User.create({
      name: "Platform Admin",
      email: "admin@reitcompare.com",
      password: adminPassword,
      phone: "9876543210",
      role: "admin"
    });

    const investorUser = await User.create({
      name: "Demo Investor",
      email: "investor@reitcompare.com",
      password: userPassword,
      phone: "9876543211",
      role: "user"
    });

    console.log("✅ 2 Demo users created (Admin: admin@reitcompare.com, User: investor@reitcompare.com)");

    // 5. Insert Sample Investment Request
    if (insertedProperties.length > 0) {
      await Investment.create({
        property: insertedProperties[0]._id,
        user: investorUser._id,
        investorName: investorUser.name,
        email: investorUser.email,
        phone: investorUser.phone,
        amount: 250000,
        message: "Interested in fractional commercial investment opportunities.",
        status: "Under Review"
      });
      console.log("✅ Sample investment request created");
    }

    console.log("\n🎉 Database seeded successfully with REITs, InvITs, Properties, Users, and Investments!");
    console.log("-----------------------------------------------------------------");
    console.log("Demo Credentials:");
    console.log("  Admin:    admin@reitcompare.com    / Admin@12345");
    console.log("  Investor: investor@reitcompare.com / User@12345");
    console.log("-----------------------------------------------------------------\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();