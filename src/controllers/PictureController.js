import Picture from "../models/Picture.js";
import PictureService from "../services/PictureService.js";

class PictureController {
  async create(req, res) {
    try {
      const picture = await PictureService.create(req.body, req.files.image);
      res.json(picture);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req, res) {
    try {
      const pictures = await Picture.find();
      res.json(pictures);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getOne(req, res) {
    try {
      const picture = await PictureService.getOne(req.params.id);
      res.json(picture);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async update(req, res) {
    try {
      const updatedPicture = await PictureService.update(req.body);
      res.json(updatedPicture);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async delete(req, res) {
    try {
      const picture = await Picture.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Картина удалена" });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
}

export default new PictureController();
