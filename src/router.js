import Router from "express";
import AuthorController from "./controllers/AuthorController.js";

const router = new Router();

router.post("/authors", AuthorController.create);
router.get("/authors", AuthorController.getAll);
router.get("/authors/:id", AuthorController.getOne);
router.put("/authors", AuthorController.update);
router.delete("/authors/:id", AuthorController.delete);

export default router;
