import seedrandom from "seedrandom";
import { ImageMetadata, ImageMetadataModel } from "../ImageMetadata";

class ImageMetadataBuilder {
  private _imageMetadata: ImageMetadata;

  private _seed: number;
  private _random: seedrandom.PRNG;

  constructor(seed: number = 10) {
    this._imageMetadata = ImageMetadataModel;
    this._seed = seed;
    this._random = seedrandom(this._seed.toString(10));
  }

  Build = (): ImageMetadata => {
    return this._imageMetadata;
  };

  Random = (): ImageMetadataBuilder => {
    this._imageMetadata.CreateDate = this._random.int32();
    this._imageMetadata.Id = this._random.int32();
    this._imageMetadata.ImageId = this._random.int32();
    this._imageMetadata.IsActive = true;
    this._imageMetadata.Name = this._random.int32() + "_name";
    this._imageMetadata.Value = this._random.int32() + "_value";

    return this;
  };

  WithImageIdOf = (id: number): ImageMetadataBuilder => {
    this._imageMetadata.ImageId = id;

    return this;
  };
}

export { ImageMetadataBuilder };
