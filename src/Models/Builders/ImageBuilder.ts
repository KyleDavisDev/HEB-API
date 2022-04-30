import seedrandom from "seedrandom";
import { Image, ImageModel } from "../Image";
import { ImageMetadataBuilder } from "./ImageMetadataBuilder";
import { ImageObjectBuilder } from "./ImageObjectBuilder";
import { ImageTypeBuilder } from "./ImageTypeBuilder";

class ImageBuilder {
  private _image: Image;
  private _metaBuilder;
  private _imageType;
  private _objectBuilder;
  private _seed: number;
  private _random: seedrandom.PRNG;

  constructor(seed: number = 10) {
    this._image = ImageModel;
    this._seed = seed;
    this._random = seedrandom(this._seed.toString(10));
    this._metaBuilder = new ImageMetadataBuilder(this._seed);
    this._imageType = new ImageTypeBuilder(this._seed);
    this._objectBuilder = new ImageObjectBuilder(this._seed);
  }

  Build = (): Image => {
    return this._image;
  };

  ABareRandomImage = (): ImageBuilder => {
    this._image.Id = this._random.int32();
    this._image.CreateDate = Date.now();
    this._image.IsActive = true;
    this._image.Label = this._random.int32() + " label text";
    this._image.Path = "https://google.com/" + this._random.int32();
    this._image.Metadata = [];
    this._image.Objects = [];
    this._image.Type = this._imageType.Random().Build();

    return this;
  };

  AFullRandomImage = (): ImageBuilder => {
    this._image.Id = this._random.int32();

    const imageType = this._imageType.Random().Build();

    // build out our array of metaData
    const metaData = [
      this._metaBuilder.Random().WithImageIdOf(this._image.Id).Build(),
      this._metaBuilder.Random().WithImageIdOf(this._image.Id).Build(),
      this._metaBuilder.Random().WithImageIdOf(this._image.Id).Build(),
    ];

    const objects = [
      this._objectBuilder.Random().WithImageIdOf(this._image.Id).Build(),
      this._objectBuilder.Random().WithImageIdOf(this._image.Id).Build(),
      this._objectBuilder.Random().WithImageIdOf(this._image.Id).Build(),
    ];

    this._image.CreateDate = Date.now();
    this._image.IsActive = true;
    this._image.Label = this._random.int32() + " label text";
    this._image.Path = "https://google.com/" + this._random.int32();
    this._image.Metadata = metaData;
    this._image.Objects = objects;
    this._image.Type = imageType;

    return this;
  };

  ANewImage = (): ImageBuilder => {
    return new ImageBuilder(++this._seed);
  };

  // Specialized method for testing DB calls
  AnImageFromDB = () => {
    //  update values on each call
    this.ABareRandomImage();

    return {
      "Images.CreateDate": this._image.CreateDate,
      "Images.Id": this._image.Id,
      "Images.IsActive": this._image.IsActive,
      "Images.Label": this._image.Label,
      "Images.Path": this._image.Path,
    };
  };
}

export { ImageBuilder };
