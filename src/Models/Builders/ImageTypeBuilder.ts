import seedrandom from "seedrandom";

import { ImageTypeModel, ImageTypes } from "../ImageTypes";

class ImageTypeBuilder {
  private _imageType: ImageTypes;
  private _seed: number;
  private _random: seedrandom.PRNG;

  constructor(seed: number = 10) {
    this._imageType = ImageTypeModel;
    this._seed = seed;
    this._random = seedrandom(this._seed.toString(10));
  }

  Build = () => {
    return this._imageType;
  };

  Random = (): ImageTypeBuilder => {
    this._imageType.CreateDate = this._random.int32();
    this._imageType.Id = this._random.int32();
    this._imageType.IsActive = true;
    this._imageType.Value = this._random.int32() + "_value";

    return this;
  };

  WithValueOf = (val: string): ImageTypeBuilder => {
    this._imageType.Value = val;

    return this;
  };

  // Specialized method for testing DB calls
  AnImageFromDB = () => {
    //  update values on each call
    this.Random();

    return {
      "ImageTypes.CreateDate": this._imageType.CreateDate,
      "ImageTypes.Id": this._imageType.Id,
      "ImageTypes.IsActive": this._imageType.IsActive,
      "ImageTypes.Value": this._imageType.Value,
    };
  };
}

export { ImageTypeBuilder };
