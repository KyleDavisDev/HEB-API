import seedrandom from "seedrandom";
import { Image, ImageModel } from "../Image";
import { ImageTypeModel, ImageTypes } from "../ImageTypes";
import { ImageMetadataBuilder } from "./ImageMetadataBuilder";

class ImageBuilder {
  private _image: Image;
  private _seed: number;
  private _random: seedrandom.PRNG;
  private _metaBuilder;

  constructor(seed: number = 10) {
    this._image = ImageModel;
    this._seed = seed;
    this._random = seedrandom(this._seed.toString(10));
    this._metaBuilder = new ImageMetadataBuilder(this._seed);
  }

  Build = (): Image => {
    return this._image;
  };

  ARandomImage = (): ImageBuilder => {
    this._image.Id = this._random.int32();

    const imageType = ImageTypeModel;
    imageType.CreateDate = this._random.int32();
    imageType.Id = this._random.int32();
    imageType.IsActive = true;
    imageType.Value = this._random.int32() + " value";

    // build out our array of metaData
    const metaData = [
      this._metaBuilder.Random().WithImageIdOf(this._image.Id).Build(),
      this._metaBuilder.Random().WithImageIdOf(this._image.Id).Build(),
      this._metaBuilder.Random().WithImageIdOf(this._image.Id).Build(),
    ];

    this._image.CreateDate = Date.now();
    this._image.IsActive = true;
    this._image.Label = this._random.int32() + " label text";
    this._image.Path = "https://google.com/" + this._random.int32();
    this._image.Metadata = metaData;
    this._image.Objects = [];
    this._image.Type = imageType;

    return this;
  };

  ANewImage = (): ImageBuilder => {
    return new ImageBuilder(++this._seed);
  };
}
