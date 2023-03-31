import Router from "express";
import AuthorController from "./controllers/AuthorController.js";
import CountryController from "./controllers/CountryController.js";
import PictureController from "./controllers/PictureController.js";

const router = new Router();

router.post("/authors", AuthorController.create);
router.get("/authors", AuthorController.getAll);
router.get("/authors/:id", AuthorController.getOne);
router.put("/authors", AuthorController.update);
router.delete("/authors/:id", AuthorController.delete);

router.post("/pictures", PictureController.create);
router.get("/pictures", PictureController.getAll);
router.get("/pictures/:id", PictureController.getOne);
router.put("/pictures", PictureController.update);
router.delete("/pictures/:id", PictureController.delete);

router.post("/countries", CountryController.create);
router.get("/countries", CountryController.getAll);
router.get("/countries/:id", CountryController.getOne);
router.put("/countries", CountryController.update);
router.delete("/countries/:id", CountryController.delete);

export default router;
