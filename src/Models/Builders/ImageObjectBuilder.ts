import seedrandom from "seedrandom";

import { ImageObjectModel, ImageObjects } from "../ImageObjects";

class ImageObjectBuilder {
  private _imageObject: ImageObjects;
  private _seed: number;
  private _random: seedrandom.PRNG;

  constructor(seed: number = 10) {
    this._imageObject = ImageObjectModel;
    this._seed = seed;
    this._random = seedrandom(this._seed.toString(10));
  }

  Build = () => {
    return this._imageObject;
  };

  Random = (): ImageObjectBuilder => {
    this._imageObject.CreateDate = this._random.int32();
    this._imageObject.Id = this._random.int32();
    this._imageObject.ImageId = this._random.int32();
    this._imageObject.IsActive = true;
    this._imageObject.Name = this._random.int32() + "_value";
    this._imageObject.Confidence = this._random();

    return this;
  };

  WithImageIdOf = (id: number): ImageObjectBuilder => {
    this._imageObject.ImageId = id;

    return this;
  };

  WithNameOf = (val: string): ImageObjectBuilder => {
    this._imageObject.Name = val;

    return this;
  };

  WithConfidenceOf = (val: number): ImageObjectBuilder => {
    this._imageObject.Confidence = val;

    return this;
  };
}

export { ImageObjectBuilder };
