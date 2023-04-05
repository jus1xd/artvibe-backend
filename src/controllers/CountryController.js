import Country from "../models/Country.js";
import CountryService from "../services/CountryService.js";

class CountryController {
  async create(req, res) {
    try {
      const country = await CountryService.create(req.body, req.files.image);
      res.json(country);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req, res) {
    try {
      const country = await Country.find();
      res.json(country);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getOne(req, res) {
    try {
      const country = await CountryService.getOne(req.params.id);
      res.json(country);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async update(req, res) {
    try {
      const updatedCountry = await CountryService.update(req.body);
      res.json(updatedCountry);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async delete(req, res) {
    try {
      const country = await Country.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Страна удалена" });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
}

export default new CountryController();
