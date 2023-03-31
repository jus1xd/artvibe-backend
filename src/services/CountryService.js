import Country from "../models/Country.js";
import fileService from "./fileService.js";

class CountryService {
  async create(country, image) {
    const fileName = fileService.saveFile(image);
    const createdCountry = await Country.create({
      ...country,
      image: fileName,
    });
    return createdCountry;
  }

  async getAll() {
    const countries = await Country.find();
    return countries;
  }

  async getOne(id) {
    if (!id) {
      throw new Error("ID не указан");
    }
    const country = await Country.findById(id);
    return country;
  }

  async update(country) {
    if (!country._id) {
      throw new Error("ID не указан");
    }
    const updatedCountry = await Country.findByIdAndUpdate(
      country._id,
      country,
      {
        new: true,
      }
    );
    return updatedCountry;
  }

  async delete(id) {
    if (!id) {
      throw new Error("ID не указан");
    }
    const country = await Country.findByIdAndDelete(id);
    return country;
  }
}

export default new CountryService();
