import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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
  res.render("Login");
};

// Handle Login
export const handleLogin = (req, res) => {
  const { email, password } = req.body || {}; // Safely destructure to avoid undefined errors

  if (!email || !password) {
    return res.render("Login", { error: "Email and password are required!" });
  }

  // Placeholder for authentication logic
  if (email === "admin@luxenest.com" && password === "password") {
    return res.redirect("/dashboard"); // Redirect to dashboard
  } else {
    return res.render("Login", { error: "Invalid email or password!" });
  }
};

// Register Page
export const getRegisterPage = (req, res) => {
  res.render("Register");
};

// Handle Register
export const handleRegister = (req, res) => {
  const { name, phone, email, password } = req.body || {}; // Safely destructure to avoid undefined errors
};
