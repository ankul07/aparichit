const {
  AddCrime,
  getAllCrime,
  getGarudPurans,
} = require("../controller/crime.controller");
const authMiddleware = require("../middleware/AuthMiddleware");

const router = require("express").Router();

router.post("/addcrime", authMiddleware, AddCrime);
router.get("/getAllcrime", getAllCrime);
router.get("/garudpuran", getGarudPurans);

module.exports = router;
