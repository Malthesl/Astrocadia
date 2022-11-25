export class Asset {
  image: HTMLImageElement;
  constructor(src: string) {
    this.image = new Image();
    this.image.src = 'assets/' + src;
  }
}