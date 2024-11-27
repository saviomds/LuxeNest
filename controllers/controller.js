import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// json file work i wasnt work bcz of assert I decide to use Stick with CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = fs.readFileSync(path.join(__dirname, "../data/hotels.json"));
const hotels = JSON.parse(rawData);

// Set Language
export const setLanguage = (req, res) => {
  const lang = req.query.lang || "en"; // Default to 'en'
  req.session.lang = lang; // Set the selected language in session
  res.redirect("/"); // Redirect to the homepage
};

// Welcome Page
export const welcomePage = (req, res) => {
  const lang = req.session.lang || "en";
  const data = {
    en: {
      title: "Welcome to LuxeNest",
      message: "LuxeNest!", // This will be the glowing text
      redirectUrl: "/Book", // URL to redirect to
    },
    fr: {
      title: "Bienvenue sur LuxeNest",
      message: "LuxeNest!", // This will be the glowing text
      redirectUrl: "/Book", // URL to redirect to
    },
  };
  res.render("Index", data[lang]);
};

// Book Page
export const getBookPage = (req, res) => {
  const lang = req.session.lang || "en";
  const data = {
    en: {
      title: "Book Your Stay - LuxeNest",
      message: "Book Your Stay",
      paragraph: "Explore our curated selection of hotels and motels.",
      bookbtn: "Book now",
    },
    fr: {
      title: "Réservez votre séjour - LuxeNest",
      message: "Réservez votre séjour",
      paragraph: "Découvrez notre sélection d'hôtels et de motels.",
      bookbtn: "Réservez maintenant",
    },
  };

  // Render the view with the language data and hotels
  res.render("Book", { ...data[lang], hotels });
};

export const getHotelDetails = (req, res) => {
  const hotelId = req.params.id;
  const lang = req.session.lang || "en";

  // Load the language data
  const data = {
    en: {
      title: "Hotel Details - LuxeNest",
      message: "Explore the details of our selected hotels.",
      hotelId: "The “Id” hotel now has:",
      bookbtn: "Book now",
    },
    fr: {
      title: "Détails de l'hôtel - LuxeNest",
      message: "Découvrez les détails de nos hôtels sélectionnés.",
      hotelId: "L'hôtel « Id » a maintenant :",
      bookbtn: "Réservez maintenant",
    },
  };

  // Read the hotels.json file and parse the data
  const hotelsFilePath = path.join(__dirname, "../data/hotels.json");
  fs.readFile(hotelsFilePath, "utf8", (err, jsonData) => {
    if (err) {
      return res.status(500).send("Error loading hotel data");
    }

    // Parse the JSON data into an array
    const hotels = JSON.parse(jsonData);

    // Find the hotel by ID
    const hotel = hotels.find((h) => h.id === parseInt(hotelId));

    // If the hotel is not found, return a 404 error
    if (!hotel) {
      return res.status(404).send("Hotel not found");
    }

    // Pass the language data and hotel details to the EJS template
    res.render("HotelDetails", {
      ...data[lang],
      hotel,
      user: req.session.user || null,
    });
  });
};

// Book Now Button Logic
export const handleBookNow = (req, res) => {
  if (!req.session.user) {
    // If no user session exists, redirect to login
    return res.redirect("/login");
  }

  const hotelId = req.params.id;

  // Proceed to the booking process, once user is logged in
  res.render("BookingPage", { hotelId });
};

// Login Page
export const getLoginPage = (req, res) => {
  res.render("Login", { email: "" }); // Provide default email value
};
export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .render("Login", { error: "User not found. 🤔", email: email || "" });
    }

    // Compare the entered password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .render("Login", { error: "Invalid password. 🤷", email });
    }

    // Password matches - set session and redirect
    req.session.user = {
      email: user.email,
      name: user.name,
    };

    return res.redirect("/Dash"); // Redirect to the home page or dashboard
  } catch (err) {
    console.error(err);
    // Ensure proper error rendering
    return res
      .status(500)
      .render("Login", { error: "Server error. 🚩", email: email || "" });
  }
};

// Register Page
export const getRegisterPage = (req, res) => {
  res.render("Register", {
    name: "",
    phone: "",
    email: "",
    error: "",
    success: "",
  });
};
export const handleRegister = async (req, res) => {
  const { name, phone, email, password } = req.body;

  try {
    const saltRounds = 10; // Higher numbers increase security but also processing time
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, phone, email, password: hashedPassword });
    await newUser.save();

    // Clear fields on successful registration
    return res.render("Register", {
      success: "Registration successful, You may now login 🤩",
      name: "",
      phone: "",
      email: "",
    });
  } catch (err) {
    console.error(err);
    // Pass the entered data back to the view in case of an error
    return res.status(400).render("Register", {
      error: "Error registering user. Email might already exist 😕.",
      name: name || "",
      phone: phone || "",
      email: email || "",
    });
  }
};
export const getDashboard = (req, res) => {
  // Ensure the user is logged in
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect to login if not authenticated
  }

  // Extract email and name from session
  const { email, name } = req.session.user;

  // Pass the email and name to the Dash view
  res.render("Dash", { email, name });
};

export const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
};
