import express from "express";
import {
  welcomePage,
  getBookPage,
  getLoginPage,
  handleLogin,
  getRegisterPage,
  handleRegister,
  setLanguage,
  getHotelDetails,
  handleBookNow,
  handleLogout,
  getDashboard,
} from "../controllers/controller.js";
export const router = express.Router();

// Home page route
router.get("/", welcomePage);
router.get("/book", getBookPage);
// View the hotel details page
router.get("/book/hotel/:id", getHotelDetails);
// Handle the "Book Now" process
router.get("/book/hotel/:id/book", handleBookNow);
router.get("/login", getLoginPage);
router.post("/login", handleLogin);
router.get("/register", getRegisterPage);
router.post("/register", handleRegister);
// Route for changing language
router.get("/set-language", setLanguage);
router.get("/Dash", getDashboard);

// logout
router.get("/Logout", handleLogout);
