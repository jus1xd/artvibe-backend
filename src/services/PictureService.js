import Picture from "../models/Picture.js";
import fileService from "./fileService.js";

class PictureService {
  async create(picture, image) {
    const fileName = fileService.saveFile(image);
    const createdPicture = await Picture.create({
      ...picture,
      image: fileName,
    });
    return createdPicture;
  }

  async getAll() {
    const pictures = await Picture.find();
    return pictures;
  }

  async getOne(id) {
    if (!id) {
      throw new Error("ID не указан");
    }
    const picture = await Picture.findById(id);
    return picture;
  }

  async update(picture) {
    if (!picture._id) {
      throw new Error("ID не указан");
    }
    const updatedPicture = await Picture.findByIdAndUpdate(
      picture._id,
      picture,
      {
        new: true,
      }
    );
    return updatedPicture;
  }

  async delete(id) {
    if (!id) {
      throw new Error("ID не указан");
    }
    const picture = await Picture.findByIdAndDelete(id);
    return picture;
  }
}

export default new PictureService();
