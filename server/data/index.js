import mongoose from "mongoose";

const userIds = [
  new mongoose.Types.ObjectId(), // Ramya Krishnamurthy
  new mongoose.Types.ObjectId(), // Shubhra Pandey
  new mongoose.Types.ObjectId(), // P. Karthik Manikantan
  new mongoose.Types.ObjectId(), // Tuhina Tripathi
];

export const users = [
  {
    _id: userIds[0],
    firstName: "Ramya",
    lastName: "Krishnamurthy",
    email: "ramya@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "C://Users//MANI//Desktop//mern-social-media//server//public//assets//ramya.png",
    friends: [],
    location: "Chennai, India",
    occupation: "Gardener",
    viewedProfile: 1000,
    impressions: 5000,
    createdAt: 1615211422,
    updatedAt: 1615211422,
    __v: 0,
  },
  {
    _id: userIds[1],
    firstName: "Shubhra",
    lastName: "Pandey",
    email: "shubhra@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "C://Users//MANI//Desktop//mern-social-media//server//public//assets//snow-white.png",
    friends: [],
    location: "Mumbai, India",
    occupation: "Farmer",
    viewedProfile: 2000,
    impressions: 6000,
    createdAt: 1615211423,
    updatedAt: 1615211423,
    __v: 0,
  },
  {
    _id: userIds[2],
    firstName: "P. Karthik",
    lastName: "Manikantan",
    email: "karthik@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "C://Users//MANI//Desktop//mern-social-media//server//public//assets//Karthik Passport.jpg",
    friends: [],
    location: "Bangalore, India",
    occupation: "Engineer",
    viewedProfile: 3000,
    impressions: 7000,
    createdAt: 1615211424,
    updatedAt: 1615211424,
    __v: 0,
  },
  {
    _id: userIds[3],
    firstName: "Tuhina",
    lastName: "Tripathi",
    email: "tuhina@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "C://Users//MANI//Desktop//mern-social-media//server//public//assets//tuhinatripathi1.png",
    friends: [],
    location: "Delhi, India",
    occupation: "Student",
    viewedProfile: 4000,
    impressions: 8000,
    createdAt: 1615211425,
    updatedAt: 1615211425,
    __v: 0,
  },
];

export const posts = [
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[0],
    firstName: "Ramya",
    lastName: "Krishnamurthy",
    location: "Chennai, India",
    description: "Papayas in my garden, grown organically with no pesticides. Available for sale. Price per papaya is ₹32. DM and comment below for more details.",
    picturePath: "C://Users//MANI//Desktop//mern-social-media//server//public//assets//ramyapapayas.jpg",
    userPicturePath: "C://Users//MANI//Desktop//mern-social-media//server//public//assets//ramya.png",
    likes: new Map([
      [userIds[2], true],
    ]),
    comments: [
      "I am interested for 3 papayas, please send QR code in DMs. - P. Karthik Manikantan",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[1],
    firstName: "Shubhra",
    lastName: "Pandey",
    location: "Mumbai, India",
    description: "Tomatoes grown in my garden, no pesticide used, fully organic. Price per kg is ₹30. DM and comment below for more details.",
    picturePath: "C://Users//MANI//Desktop//mern-social-media//server//public//assets//tomatoes.jpeg",
    userPicturePath: "C://Users//MANI//Desktop//mern-social-media//server//public//assets//snow-white.png",
    likes: new Map([
      [userIds[3], true],
    ]),
    comments: [
      "Very wonderful, I am interested to buy. Please share the exact location here. - Tuhina Tripathi",
    ],
  },
];
