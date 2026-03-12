
import example2 from './example2.jpg'
import example from './exmaple.png';
export {
  example2,
  example
}
const repairRequests = [
{ id:1,userId:"USR1023",userName:"Rahul Sharma",deviceType:"Phone",brand:"Redmi",model:"Redmi Note 10",problemTitle:"Screen not working",problemDescription:"Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.Phone fell from hand yesterday. Display is completely black but phone still vibrates and receives calls properly.",budgetRange:900,urgency:"Medium",images:[example2,example,example,example],location:{city:"Pune",state:"Maharashtra",pincode:"411001"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345448,tags:["screen","display","redmi"],warrantyRequired:false,},
{ id:2,userId:"USR1045",userName:"Aakash Verma",deviceType:"Laptop",brand:"HP",model:"Pavilion 15",problemTitle:"Battery not charging",problemDescription:"Laptop only works when plugged in. Battery does not charge even after keeping on power for hours.",budgetRange:1800,urgency:"High",images:["battery.jpg"],location:{city:"Delhi",state:"Delhi",pincode:"110001"},preferredRepairType:"Visit Shop",status:"Bidding",createdAt:1716634345449,tags:["battery","charging"],warrantyRequired:true,},
{ id:3,userId:"USR1090",userName:"Sneha Patil",deviceType:"Headphones",brand:"Boat",model:"Rockerz 255",problemTitle:"One side not working",problemDescription:"Left earbud has no sound output. Right side works fine but volume is very unbalanced.",budgetRange:500,urgency:"Low",images:[],location:{city:"Mumbai",state:"Maharashtra",pincode:"400001"},preferredRepairType:"Pickup",status:"Assigned",createdAt:1716634345450,tags:["audio","earphone"],warrantyRequired:false,},
{ id:4,userId:"USR1122",userName:"Rohit Singh",deviceType:"Phone",brand:"Samsung",model:"Galaxy M31",problemTitle:"Back panel broken",problemDescription:"Glass back cracked badly after accidental fall. Sharp edges visible and phone body feels exposed.",budgetRange:1200,urgency:"Medium",images:["backpanel.jpg"],location:{city:"Lucknow",state:"UP",pincode:"226001"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345451,tags:["body","glass"],warrantyRequired:false,},
{ id:5,userId:"USR1156",userName:"Priya Nair",deviceType:"Laptop",brand:"Dell",model:"Inspiron 14",problemTitle:"Keyboard not working",problemDescription:"Some keyboard keys stopped responding suddenly. Typing is difficult and certain letters never register input.",budgetRange:1500,urgency:"Medium",images:[],location:{city:"Bangalore",state:"Karnataka",pincode:"560001"},preferredRepairType:"Visit Shop",status:"Open",createdAt:1716634345452,tags:["keyboard","laptop"],warrantyRequired:false,},
{ id:6,userId:"USR1188",userName:"Kunal Mehta",deviceType:"Console",brand:"Sony",model:"PS4",problemTitle:"Overheating issue",problemDescription:"Console overheats quickly during gameplay. It shuts down automatically after ten to fifteen minutes of usage.",budgetRange:2500,urgency:"High",images:[],location:{city:"Ahmedabad",state:"Gujarat",pincode:"380001"},preferredRepairType:"Visit Shop",status:"Bidding",createdAt:1716634345453,tags:["console","overheat"],warrantyRequired:true,},
{ id:7,userId:"USR1210",userName:"Neha Kapoor",deviceType:"Phone",brand:"iPhone",model:"iPhone 11",problemTitle:"Battery draining fast",problemDescription:"Battery drains very fast even on normal usage. Phone needs charging multiple times throughout the day.",budgetRange:2200,urgency:"Medium",images:[],location:{city:"Chandigarh",state:"Punjab",pincode:"160001"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345454,tags:["battery","iphone"],warrantyRequired:true,},
{ id:8,userId:"USR1244",userName:"Aman Gupta",deviceType:"Laptop",brand:"Lenovo",model:"ThinkPad E14",problemTitle:"Blue screen error",problemDescription:"Laptop shows blue screen error randomly. Happens frequently during work and sometimes restarts automatically.",budgetRange:1700,urgency:"High",images:[],location:{city:"Jaipur",state:"Rajasthan",pincode:"302001"},preferredRepairType:"Visit Shop",status:"Bidding",createdAt:1716634345455,tags:["software","windows"],warrantyRequired:false,},
{ id:9,userId:"USR1277",userName:"Simran Kaur",deviceType:"Headphones",brand:"JBL",model:"Tune 510BT",problemTitle:"Charging port loose",problemDescription:"Charging cable feels loose inside port. Headphones charge only at certain angles and disconnect easily.",budgetRange:600,urgency:"Low",images:[],location:{city:"Amritsar",state:"Punjab",pincode:"143001"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345456,tags:["charging","audio"],warrantyRequired:false,},
{ id:10,userId:"USR1300",userName:"Mohit Bansal",deviceType:"Phone",brand:"OnePlus",model:"OnePlus 8",problemTitle:"Touch not responding",problemDescription:"Touch screen is not responding in several areas. Swiping and typing have become extremely difficult.",budgetRange:1400,urgency:"Medium",images:[],location:{city:"Gurgaon",state:"Haryana",pincode:"122001"},preferredRepairType:"Pickup",status:"Assigned",createdAt:1716634345457,tags:["touch","display"],warrantyRequired:false,},
{ id:11,userId:"USR1333",userName:"Riya Sen",deviceType:"Phone",brand:"Vivo",model:"Vivo Y20",problemTitle:"Camera not opening",problemDescription:"Rear camera opens but shows only black screen. Front camera works but rear camera fails completely.",budgetRange:800,urgency:"Low",images:[],location:{city:"Surat",state:"Gujarat",pincode:"395003"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345458,tags:["camera","vivo"],warrantyRequired:false,},
{ id:12,userId:"USR1360",userName:"Arjun Malhotra",deviceType:"Laptop",brand:"Asus",model:"TUF Gaming F15",problemTitle:"Fan making loud noise",problemDescription:"Laptop fan suddenly became very loud while gaming. Device also heats up more than usual.",budgetRange:1200,urgency:"Medium",images:[],location:{city:"Indore",state:"Madhya Pradesh",pincode:"452001"},preferredRepairType:"Visit Shop",status:"Bidding",createdAt:1716634345459,tags:["fan","overheating"],warrantyRequired:false,},
{ id:13,userId:"USR1391",userName:"Pooja Mehta",deviceType:"Phone",brand:"Oppo",model:"Oppo A74",problemTitle:"Speaker distorted sound",problemDescription:"Speaker produces distorted cracking sound. Music and calls both have unclear and broken audio output.",budgetRange:700,urgency:"Low",images:[],location:{city:"Nagpur",state:"Maharashtra",pincode:"440001"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345460,tags:["speaker","audio"],warrantyRequired:false,},
{ id:14,userId:"USR1420",userName:"Varun Khanna",deviceType:"Console",brand:"Microsoft",model:"Xbox One S",problemTitle:"Controller not connecting",problemDescription:"Wireless controller does not connect to console. Pairing fails even after resetting both devices.",budgetRange:900,urgency:"Medium",images:[],location:{city:"Delhi",state:"Delhi",pincode:"110078"},preferredRepairType:"Visit Shop",status:"Open",createdAt:1716634345461,tags:["controller","xbox"],warrantyRequired:false,},
{ id:15,userId:"USR1455",userName:"Ananya Rao",deviceType:"Laptop",brand:"Apple",model:"MacBook Air M1",problemTitle:"Screen flickering",problemDescription:"Screen flickers occasionally during usage. Happens more often when brightness is low or changing windows.",budgetRange:3500,urgency:"High",images:[],location:{city:"Mumbai",state:"Maharashtra",pincode:"400050"},preferredRepairType:"Visit Shop",status:"Bidding",createdAt:1716634345462,tags:["screen","macbook"],warrantyRequired:true,},
{ id:16,userId:"USR1480",userName:"Sahil Yadav",deviceType:"Phone",brand:"Samsung",model:"Galaxy A32",problemTitle:"Charging very slow",problemDescription:"Phone takes more than four hours to charge fully. Charging speed is extremely slow compared to before.",budgetRange:600,urgency:"Low",images:[],location:{city:"Patna",state:"Bihar",pincode:"800001"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345463,tags:["charging","battery"],warrantyRequired:false,},
{ id:17,userId:"USR1502",userName:"Ishita Das",deviceType:"Headphones",brand:"Sony",model:"WH-CH510",problemTitle:"Bluetooth disconnects",problemDescription:"Headphones keep disconnecting from Bluetooth randomly. Audio stops suddenly and reconnecting takes time.",budgetRange:500,urgency:"Low",images:[],location:{city:"Kolkata",state:"West Bengal",pincode:"700001"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345464,tags:["bluetooth","audio"],warrantyRequired:false,},
{ id:18,userId:"USR1530",userName:"Raj Verma",deviceType:"Laptop",brand:"Acer",model:"Aspire 7",problemTitle:"Laptop not turning on",problemDescription:"Laptop does not turn on when pressing power button. No lights or fan movement observed.",budgetRange:2000,urgency:"High",images:[],location:{city:"Bhopal",state:"Madhya Pradesh",pincode:"462001"},preferredRepairType:"Visit Shop",status:"Bidding",createdAt:1716634345465,tags:["power","motherboard"],warrantyRequired:false,},
{ id:19,userId:"USR1566",userName:"Kriti Shah",deviceType:"Phone",brand:"Realme",model:"Realme 9",problemTitle:"Fingerprint not working",problemDescription:"Fingerprint sensor does not detect finger. Multiple attempts fail and biometric unlock never works.",budgetRange:400,urgency:"Low",images:[],location:{city:"Pune",state:"Maharashtra",pincode:"411030"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345466,tags:["fingerprint","sensor"],warrantyRequired:false,},
{ id:20,userId:"USR1600",userName:"Dev Joshi",deviceType:"Console",brand:"Nintendo",model:"Switch",problemTitle:"Game card not reading",problemDescription:"Console does not recognize game cartridges. Games fail to load even though cards are clean.",budgetRange:1200,urgency:"Medium",images:[],location:{city:"Hyderabad",state:"Telangana",pincode:"500001"},preferredRepairType:"Visit Shop",status:"Open",createdAt:1716634345467,tags:["console","cartridge"],warrantyRequired:false,},
{ id:21,userId:"USR1625",userName:"Nikhil Jain",deviceType:"Laptop",brand:"MSI",model:"GF63",problemTitle:"GPU overheating",problemDescription:"Laptop shuts down during heavy usage. GPU temperature rises quickly and device becomes extremely hot.",budgetRange:3000,urgency:"High",images:[],location:{city:"Chennai",state:"Tamil Nadu",pincode:"600001"},preferredRepairType:"Visit Shop",status:"Bidding",createdAt:1716634345468,tags:["gpu","overheat"],warrantyRequired:true,},
{ id:22,userId:"USR1650",userName:"Meera Iyer",deviceType:"Phone",brand:"iPhone",model:"iPhone 12",problemTitle:"Face ID not working",problemDescription:"Face ID setup fails repeatedly. Phone cannot recognize face and authentication never completes.",budgetRange:2500,urgency:"Medium",images:[],location:{city:"Kochi",state:"Kerala",pincode:"682001"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345469,tags:["faceid","iphone"],warrantyRequired:true,},
{ id:23,userId:"USR1688",userName:"Aditya Singh",deviceType:"Headphones",brand:"Boat",model:"Airdopes 141",problemTitle:"Mic not working",problemDescription:"Microphone does not pick voice during calls. Other person cannot hear any sound from my side.",budgetRange:300,urgency:"Low",images:[],location:{city:"Jaipur",state:"Rajasthan",pincode:"302020"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345470,tags:["mic","audio"],warrantyRequired:false,},
{ id:24,userId:"USR1720",userName:"Kavya Nair",deviceType:"Laptop",brand:"Dell",model:"XPS 13",problemTitle:"Trackpad not working",problemDescription:"Touchpad suddenly stopped responding. Cursor does not move and clicks are not registering.",budgetRange:900,urgency:"Medium",images:[],location:{city:"Lucknow",state:"Uttar Pradesh",pincode:"226010"},preferredRepairType:"Visit Shop",status:"Open",createdAt:1716634345471,tags:["trackpad","laptop"],warrantyRequired:false,},
{ id:25,userId:"USR1755",userName:"Yash Patel",deviceType:"Phone",brand:"Redmi",model:"Redmi 10",problemTitle:"Network issue",problemDescription:"Phone is not receiving network signals. SIM card works in other phones but not in this device.",budgetRange:700,urgency:"Medium",images:[],location:{city:"Ahmedabad",state:"Gujarat",pincode:"380015"},preferredRepairType:"Pickup",status:"Open",createdAt:1716634345472,tags:["network","signal"],warrantyRequired:false,},

{ id:26,userId:"USR1780",
  userName:"Tanvi Kulkarni",
  deviceType:"Laptop",
  brand:"HP",
  model:"Victus 16",
  problemTitle:"WiFi disconnects",
  problemDescription:"WiFi disconnects frequently on laptop. Internet drops automatically and reconnecting takes several attempts.",
  budgetRange:800,
  urgency:"Low",
  images:[],
  location:{city:"Nagpur",state:"Maharashtra",pincode:"440010"},
  preferredRepairType:"Visit Shop",
  status:"Open",
  createdAt:1716634345473,
  tags:["wifi","network"],
  warrantyRequired:false,}
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
  "Puducherry"
];
const ListofRepairers = [
  {
    id: 1,
    userId: "RPR1023",
    userName: "Rahul Sharma",
    bio: "Hi, I'm Rahul Sharma. I have over 5 years of experience in mobile and laptop repair. I specialize in screen replacement, battery issues, and motherboard troubleshooting. My focus is always on fast and reliable service.",
    PersonalNo:34565432345,
    shopDetails: {
      shopName: "QuickFix Electronics",
      experience: 5,
      skills: ["Mobile Repair", "Laptop Repair", "Screen Replacement"],
      address: "Ganesh Maidan Marg, Lal Bahadur Shastri Marg, Chirag Nagar, Ghatkopar West, Mumbai, Maharashtra 400086, India",
      city: "Mumbai",
       ShopPhoneNo:8765456756,
      pincode: "400001",
      location: { lat: 19.0760, lng: 72.8777 },
      shopImage: "https://example.com/images/shop1.jpg",
      idProof: "https://example.com/documents/idproof1.jpg"
    },
    rating: 4.5,
    totalReviews: 120,
    isVerified: true,
    available: true,
    joinedAt: 1716634345473
  },

  {
    id: 2,
    userId: "RPR2045",
    userName: "Amit Verma",
    bio: "Hello, I'm Amit Verma with 8+ years of experience in AC, washing machine, and refrigerator repairs. I believe in quality workmanship and ensuring complete customer satisfaction.",
   PersonalNo:34565432345,
    shopDetails: {
      shopName: "TechCare Solutions",
      experience: 8,
      skills: ["AC Repair", "Washing Machine Repair", "Refrigerator Service"],
      address: "Shop No.29/B, Nakshtra Cine Shoppe, Ranade Rd, Near Kabutar khana, Dadar West, Dadar, Mumbai, Maharashtra 400028, India",
      ShopPhoneNo:8765456756,
      city: "Kolkata",
      pincode: "700016",
      location: { lat: 22.5726, lng: 88.3639 },
      shopImage: "https://example.com/images/shop2.jpg",
      idProof: "https://example.com/documents/idproof2.jpg"
    },
    rating: 4.8,
    totalReviews: 210,
    isVerified: true,
    available: false,
    joinedAt: 1716634345473
  },

  {
    id: 3,
    userId: "RPR3099",
    userName: "Suresh Patel",
    bio: "I'm Suresh Patel, a professional technician with 3 years of hands-on experience in plumbing and electrical wiring. I provide safe, durable, and cost-effective repair solutions.",
    PersonalNo:34565432345, 
    shopDetails: {
      shopName: "HomeFix Experts",
      experience: 3,
      skills: ["Plumbing", "Electrical Wiring", "Water Heater Repair"],
      address: "Shop No 49, Tiara Mall, Block G, Sector 13, Kharghar, Navi Mumbai, Maharashtra 410210, India",
      city: "Mumbai",
      pincode: "110085",
      ShopPhoneNo:8765456756,
      location: { lat: 28.7041, lng: 77.1025 },
      shopImage: "https://example.com/images/shop3.jpg",
      idProof: "https://example.com/documents/idproof3.jpg"
    },
    rating: 4.0,
    totalReviews: 75,
    isVerified: false,
    available: true,
    joinedAt: 1716634345473
  },

  {
    id: 4,
    userId: "RPR4099",
    userName: "Suresh Patel",
    bio: "With 3+ years of experience in home repair services, I specialize in plumbing and water heater installations. I ensure professional service and timely completion of work.",
    PersonalNo:34565432345,
    shopDetails: {
      shopName: "HomeFix Experts",
      experience: 3,
      skills: ["Plumbing", "Electrical Wiring", "Water Heater Repair"],
      address: "Shop No 103, Ground Floor, Raghuleela Mega Mall, Kandivali West, Mumbai, Maharashtra 400067, India",
      city: "Mumbai",
      ShopPhoneNo:8765456756,
      pincode: "110085",
      location: { lat: 28.7041, lng: 77.1025 },
      shopImage: "https://example.com/images/shop3.jpg",
      idProof: "https://example.com/documents/idproof3.jpg"
    },
    rating: 4.3,
    totalReviews: 75,
    isVerified: false,
    available: true,
    joinedAt: 1716634345473
  },

  {
    id: 5,
    userId: "RPR5099",
    userName: "Suresh Patel",
    bio: "Experienced home service technician based in Bengaluru. I handle plumbing and electrical repairs with attention to safety and long-term reliability.",
    PersonalNo:34565432345,
    shopDetails: {
      shopName: "HomeFix Experts",
      experience: 3,
      skills: ["Plumbing", "Electrical Wiring", "Water Heater Repair"],
      address: "10, Nrupathunga Nagar, J. P. Nagar, Bengaluru, Karnataka 560078, India",
      city: "Bengaluru",
      pincode: "110085",
      ShopPhoneNo:8765456756,
      location: { lat: 28.7041, lng: 77.1025 },
      shopImage: "https://example.com/images/shop3.jpg",
      idProof: "https://example.com/documents/idproof3.jpg"
    },
    rating: 4.6,
    totalReviews: 75,
    isVerified: false,
    available: true,
    joinedAt: 1716634345473
  },

  {
    id: 6,
    userId: "RPR6099",
    userName: "Suresh Patel",
    bio: "Based in Delhi, I provide reliable plumbing and electrical services. My goal is to deliver quality workmanship and build long-term trust with customers.",
    PersonalNo:34565432345,
    shopDetails: {
      shopName: "HomeFix Experts",
      experience: 3,
      skills: ["Plumbing", "Electrical Wiring", "Water Heater Repair"],
      address: "Khazan Basti, Mayapuri Industrial Area Phase II, Mayapuri, New Delhi, Delhi 110046, India",
      city: "Delhi",
      ShopPhoneNo:8765456756,
      pincode: "110085",
      location: { lat: 28.7041, lng: 77.1025 },
      shopImage: "https://example.com/images/shop3.jpg",
      idProof: "https://example.com/documents/idproof3.jpg"
    },
    rating: 4.7,
    totalReviews: 75,
    isVerified: false,
    available: true,
    joinedAt: 1716634345473
  }
];

const repairerReviews = [
  {
    id: 1,
    review: "The repairer was very professional and arrived on time. He carefully checked the issue with my washing machine, explained the problem clearly, and fixed it within an hour. The pricing was fair and transparent. I’m completely satisfied with the service."
  },
  {
    id: 2,
    review: "Good overall experience. The technician diagnosed the AC cooling problem quickly and replaced the faulty part. He also gave some maintenance tips to avoid future issues. Slight delay in arrival, but the work quality was excellent."
  },
  {
    id: 3,
    review: "Very polite and knowledgeable repairer. He handled my refrigerator issue patiently and ensured everything was working perfectly before leaving. The service felt reliable and trustworthy. Would definitely recommend to others."
  },
  {
    id: 4,
    review: "I appreciated the quick response and smooth communication. The repair was done neatly without creating any mess. Charges were reasonable and matched the estimate provided earlier. Overall, a professional and satisfying experience."
  },
  {
    id: 5,
    review: "The repairer showed strong technical skills and solved the problem efficiently. He even tested the appliance multiple times to make sure everything was functioning properly. Very dependable service and good customer handling."
  },
   {
    id: 6,
    review: "The repairer showed strong technical skills and solved the problem efficiently. He even tested the appliance multiple times to make sure everything was functioning properly. Very dependable service and good customer handling."
  }, {
    id: 7,
    review: "The repairer showed strong technical skills and solved the problem efficiently. He even tested the appliance multiple times to make sure everything was functioning properly. Very dependable service and good customer handling."
  }
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
export { repairRequests, indianStates  , ListofRepairers , repairerReviews , testimonials};

 

 