import example2 from "./example2.jpg";
import example from "./exmaple.png";
export { example2, example };
const repairRequests = [
  {
    id: 1,
    userId: "USR1023",
    userName: "Rahul Sharma",
    deviceType: "Phone",
    brand: "Redmi",
    model: "Redmi Note 10",
    problemTitle: "Screen not working",
    problemDescription:
      "Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.",
    budgetRange: 900,
    urgency: "Medium",
    images: [example2, example, example],
    location: { city: "Pune", state: "Maharashtra", pincode: "411001" },
    preferredRepairType: "Pickup",
    status: "Open",
    createdAt: 1716634345448,
    tags: ["screen", "display", "redmi"],
    warrantyRequired: false,
  },
  {
    id: 2,
    userId: "USR1045",
    userName: "Aakash Verma",
    deviceType: "Laptop",
    brand: "HP",
    model: "Pavilion 15",
    problemTitle: "Battery not charging",
    problemDescription:
      "Laptop only works when plugged in. Battery does not charge even after keeping on power for hours.",
    budgetRange: 1800,
    urgency: "High",
    images: ["battery.jpg"],
    location: { city: "Delhi", state: "Delhi", pincode: "110001" },
    preferredRepairType: "Visit Shop",
    status: "Bidding",
    createdAt: 1716634345449,
    tags: ["battery", "charging"],
    warrantyRequired: true,
  },
  {
    id: 3,
    userId: "USR1090",
    userName: "Sneha Patil",
    deviceType: "Headphones",
    brand: "Boat",
    model: "Rockerz 255",
    problemTitle: "One side not working",
    problemDescription:
      "Left earbud has no sound output. Right side works fine but volume is very unbalanced.",
    budgetRange: 500,
    urgency: "Low",
    images: [],
    location: { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
    preferredRepairType: "Pickup",
    status: "Assigned",
    createdAt: 1716634345450,
    tags: ["audio", "earphone"],
    warrantyRequired: false,
  },
  
  
];

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];
const ListofRepairers = [
  {
    id: 1,
    userId: "RPR1023",
    userName: "Rahul Sharma",
    bio: "Hi, I'm Rahul Sharma. I have over 5 years of experience in mobile and laptop repair. I specialize in screen replacement, battery issues, and motherboard troubleshooting. My focus is always on fast and reliable service.",
    PersonalNo: 34565432345,
    shopDetails: {
      shopName: "QuickFix Electronics",
      experience: 5,
      skills: ["Mobile Repair", "Laptop Repair", "Screen Replacement"],
      address:
        "Ganesh Maidan Marg, Lal Bahadur Shastri Marg, Chirag Nagar, Ghatkopar West, Mumbai, Maharashtra 400086, India",
      city: "Mumbai",
      ShopPhoneNo: 8765456756,
      pincode: "400001",
      location: { lat: 19.076, lng: 72.8777 },
      shopImage: "https://example.com/images/shop1.jpg",
      idProof: "https://example.com/documents/idproof1.jpg",
    },
    rating: 4.5,
    totalReviews: 120,
    isVerified: true,
    available: true,
    joinedAt: 1716634345473,
  },

  {
    id: 2,
    userId: "RPR2045",
    userName: "Amit Verma",
    bio: "Hello, I'm Amit Verma with 8+ years of experience in AC, washing machine, and refrigerator repairs. I believe in quality workmanship and ensuring complete customer satisfaction.",
    PersonalNo: 34565432345,
    shopDetails: {
      shopName: "TechCare Solutions",
      experience: 8,
      skills: ["AC Repair", "Washing Machine Repair", "Refrigerator Service"],
      address:
        "Shop No. 15, Salt Lake City, Sector V, Kolkata, West Bengal 700091, India",
      ShopPhoneNo: 8765456756,
      city: "Kolkata",
      pincode: "700091",
      location: { lat: 22.5726, lng: 88.3639 },
      shopImage: "https://example.com/images/shop2.jpg",
      idProof: "https://example.com/documents/idproof2.jpg",
    },
    rating: 4.8,
    totalReviews: 210,
    isVerified: true,
    available: false,
    joinedAt: 1716634345473,
  },

  {
    id: 3,
    userId: "RPR3099",
    userName: "Suresh Patel",
    bio: "I'm Suresh Patel, a professional technician with 3 years of hands-on experience in plumbing and electrical wiring. I provide safe, durable, and cost-effective repair solutions.",
    PersonalNo: 34565432345,
    shopDetails: {
      shopName: "HomeFix Experts",
      experience: 3,
      skills: ["Plumbing", "Electrical Wiring", "Water Heater Repair"],
      address:
        "Shop No 49, Tiara Mall, Block G, Sector 13, Kharghar, Navi Mumbai, Maharashtra 410210, India",
      city: "pune",
      pincode: "110085",
      ShopPhoneNo: 8765456756,
      location: { lat: 28.7041, lng: 77.1025 },
      shopImage: "https://example.com/images/shop3.jpg",
      idProof: "https://example.com/documents/idproof3.jpg",
    },
    rating: 4.0,
    totalReviews: 75,
    isVerified: false,
    available: true,
    joinedAt: 1716634345473,
  },

  {
    id: 4,
    userId: "RPR4099",
    userName: "Suresh Patel",
    bio: "With 3+ years of experience in home repair services, I specialize in plumbing and water heater installations. I ensure professional service and timely completion of work.",
    PersonalNo: 34565432345,
    shopDetails: {
      shopName: "HomeFix Experts",
      experience: 3,
      skills: ["Plumbing", "Electrical Wiring", "Water Heater Repair"],
      address:
        "Shop No 103, Ground Floor, Raghuleela Mega Mall, Kandivali West, Mumbai, Maharashtra 400067, India",
      city: "Mumbai",
      ShopPhoneNo: 8765456756,
      pincode: "110085",
      location: { lat: 28.7041, lng: 77.1025 },
      shopImage: "https://example.com/images/shop3.jpg",
      idProof: "https://example.com/documents/idproof3.jpg",
    },
    rating: 4.3,
    totalReviews: 75,
    isVerified: false,
    available: true,
    joinedAt: 1716634345473,
  },

  {
    id: 5,
    userId: "RPR5099",
    userName: "Suresh Patel",
    bio: "Experienced home service technician based in Bengaluru. I handle plumbing and electrical repairs with attention to safety and long-term reliability.",
    PersonalNo: 34565432345,
    shopDetails: {
      shopName: "HomeFix Experts",
      experience: 3,
      skills: ["Plumbing", "Electrical Wiring", "Water Heater Repair"],
      address:
        "10, Nrupathunga Nagar, J. P. Nagar, Bengaluru, Karnataka 560078, India",
      city: "Bengaluru",
      pincode: "110085",
      ShopPhoneNo: 8765456756,
      location: { lat: 28.7041, lng: 77.1025 },
      shopImage: "https://example.com/images/shop3.jpg",
      idProof: "https://example.com/documents/idproof3.jpg",
    },
    rating: 4.6,
    totalReviews: 75,
    isVerified: false,
    available: true,
    joinedAt: 1716634345473,
  },

  {
    id: 6,
    userId: "RPR6099",
    userName: "Suresh Patel",
    bio: "Based in Delhi, I provide reliable plumbing and electrical services. My goal is to deliver quality workmanship and build long-term trust with customers.",
    PersonalNo: 34565432345,
    shopDetails: {
      shopName: "HomeFix Experts",
      experience: 3,
      skills: ["Plumbing", "Electrical Wiring", "Water Heater Repair"],
      address:
        "Khazan Basti, Mayapuri Industrial Area Phase II, Mayapuri, New Delhi, Delhi 110046, India",
      city: "Delhi",
      ShopPhoneNo: 8765456756,
      pincode: "110085",
      location: { lat: 28.7041, lng: 77.1025 },
      shopImage: "https://example.com/images/shop3.jpg",
      idProof: "https://example.com/documents/idproof3.jpg",
    },
    rating: 4.7,
    totalReviews: 75,
    isVerified: false,
    available: true,
    joinedAt: 1716634345473,
  },
];

const repairerReviews = [
  {
    id: 1,
    review:
      "The repairer was very professional and arrived on time. He carefully checked the issue with my washing machine, explained the problem clearly, and fixed it within an hour. The pricing was fair and transparent. I’m completely satisfied with the service.",
  },
  {
    id: 2,
    review:
      "Good overall experience. The technician diagnosed the AC cooling problem quickly and replaced the faulty part. He also gave some maintenance tips to avoid future issues. Slight delay in arrival, but the work quality was excellent.",
  },
  {
    id: 3,
    review:
      "Very polite and knowledgeable repairer. He handled my refrigerator issue patiently and ensured everything was working perfectly before leaving. The service felt reliable and trustworthy. Would definitely recommend to others.",
  },
  {
    id: 4,
    review:
      "I appreciated the quick response and smooth communication. The repair was done neatly without creating any mess. Charges were reasonable and matched the estimate provided earlier. Overall, a professional and satisfying experience.",
  },
  {
    id: 5,
    review:
      "The repairer showed strong technical skills and solved the problem efficiently. He even tested the appliance multiple times to make sure everything was functioning properly. Very dependable service and good customer handling.",
  },
  {
    id: 6,
    review:
      "The repairer showed strong technical skills and solved the problem efficiently. He even tested the appliance multiple times to make sure everything was functioning properly. Very dependable service and good customer handling.",
  },
  {
    id: 7,
    review:
      "The repairer showed strong technical skills and solved the problem efficiently. He even tested the appliance multiple times to make sure everything was functioning properly. Very dependable service and good customer handling.",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Laptop Repair Client",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    message:
      "Amazing service from start to finish. My laptop had serious overheating and performance issues, but the technician diagnosed the problem quickly and fixed it within a day. The communication was clear, pricing was fair, and the overall experience was very professional. I truly appreciate the honesty and efficiency.Amazing service from start to finish. My laptop had serious overheating and performance issues, but the technician diagnosed the problem quickly and fixed it within a day. The communication was clear, pricing was fair, and the overall experience was very professional. I truly appreciate the honesty and efficiency.",
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Mobile Repair Client",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    message:
      "I had a cracked screen and battery issue with my phone. The booking process was simple, and the repair expert arrived right on time. The repair was done neatly and quickly. Pricing was affordable compared to local shops. I would definitely recommend this platform to anyone looking for reliable repair services.",
  },
  {
    id: 3,
    name: "Amit Verma",
    role: "Book Donation User",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    rating: 5,
    message:
      "The donation process was extremely smooth and well organized. I was able to list my books easily, and within a short time, someone in need connected with me. It feels great to see technology being used to help others. This platform truly makes a difference in society.",
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    role: "Tablet Repair Client",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    message:
      "My tablet suddenly stopped charging, and I was worried about data loss. The technician handled it carefully and explained every step of the repair process. Within a few hours, it was working perfectly again. Very transparent and trustworthy service.",
  },
  {
    id: 5,
    name: "Arjun Patel",
    role: "AC Repair Client",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    rating: 4,
    message:
      "My AC was not cooling properly during peak summer, which was frustrating. I booked a service through this platform, and the technician arrived on time. He cleaned the system thoroughly and fixed the gas leakage issue. Cooling performance improved significantly. Very satisfied with the service quality.",
  },
  {
    id: 6,
    name: "Neha Singh",
    role: "Book Donor",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 5,
    message:
      "I had many old academic books that I wanted to donate but didn’t know where. This platform made it incredibly easy to connect with students who needed them. The experience was simple, transparent, and meaningful. I’ll definitely donate again in the future.",
  },
  {
    id: 7,
    name: "Karan Malhotra",
    role: "TV Repair Client",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 4,
    message:
      "My TV suddenly stopped displaying properly, and I thought I would need a new one. Thankfully, the technician diagnosed a panel issue and fixed it at a reasonable cost. The service was fast, and everything was handled professionally.",
  },
  {
    id: 8,
    name: "Pooja Desai",
    role: "Washing Machine Repair Client",
    image: "https://randomuser.me/api/portraits/women/50.jpg",
    rating: 5,
    message:
      "My washing machine was making unusual noises and not spinning correctly. The repair expert identified the motor issue quickly and repaired it efficiently. The entire process was hassle-free and very convenient. Highly recommended!",
  },
  {
    id: 9,
    name: "Vikram Joshi",
    role: "Mobile Screen Repair Client",
    image: "https://randomuser.me/api/portraits/men/64.jpg",
    rating: 5,
    message:
      "I dropped my phone and shattered the screen badly. I expected a high repair cost, but the pricing was fair and transparent. The screen replacement was completed within a few hours, and it now looks brand new. Excellent service quality.",
  },
  {
    id: 10,
    name: "Ananya Rao",
    role: "Laptop Service Client",
    image: "https://randomuser.me/api/portraits/women/30.jpg",
    rating: 4,
    message:
      "My laptop had become extremely slow due to storage issues. The technician upgraded my SSD and optimized the system performance. Now it works faster than before. The entire process was smooth and very professional.",
  },
  {
    id: 11,
    name: "Rohit Gupta",
    role: "Fridge Repair Client",
    image: "https://randomuser.me/api/portraits/men/83.jpg",
    rating: 5,
    message:
      "My refrigerator stopped cooling suddenly, and I was worried about food spoilage. The technician responded quickly and fixed the compressor issue on the same day. Great service and very knowledgeable professional.",
  },
  {
    id: 12,
    name: "Meera Iyer",
    role: "Book Donation User",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    message:
      "This platform makes donating books incredibly easy and meaningful. I was able to help a student preparing for competitive exams. It feels wonderful to contribute to someone’s education in such a simple way.",
  },
  {
    id: 13,
    name: "Siddharth Jain",
    role: "Computer Repair Client",
    image: "https://randomuser.me/api/portraits/men/28.jpg",
    rating: 4,
    message:
      "My desktop kept crashing during work, and it was affecting productivity. The repair expert diagnosed a RAM issue and fixed it quickly. The explanation was clear, and the service was reasonably priced.",
  },
  {
    id: 14,
    name: "Ishita Choudhary",
    role: "Microwave Repair Client",
    image: "https://randomuser.me/api/portraits/women/19.jpg",
    rating: 5,
    message:
      "My microwave stopped heating properly. The technician replaced a faulty component and tested everything thoroughly before leaving. Very professional approach and polite behavior.",
  },
  {
    id: 15,
    name: "Manish Tiwari",
    role: "AC Maintenance Client",
    image: "https://randomuser.me/api/portraits/men/91.jpg",
    rating: 4,
    message:
      "Booked a routine AC maintenance service through the platform. The technician cleaned the filters, checked the gas level, and ensured everything was functioning perfectly. The process was smooth and very convenient.",
  },
];
export {
  repairRequests,
  indianStates,
  ListofRepairers,
  repairerReviews,
  testimonials,
};
