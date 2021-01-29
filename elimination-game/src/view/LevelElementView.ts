class LevelElementView extends egret.Sprite {
  public constructor() {
    super()
    this.init()
  }
  public elType: string = '' //代表元素类型

  public set num(val: number) {
    if (val <= 0) {
      if (!this.checkMarkBit) {
        this.checkMarkBit = new egret.Bitmap()
        this.checkMarkBit.texture = RES.getRes('checkmark_png')
        this.checkMarkBit.x = (this.bitmap.width - this.checkMarkBit.width) / 2
        this.checkMarkBit.y = this.bitmap.height + this.bitmap.y - this.checkMarkBit.height / 2
        this.addChild(this.checkMarkBit)
        this.removeChild(this.bitText)
      }
    } else {
      this.bitText.text = val.toString()
    }
  }
  public get num(): number {
    return Number(this.bitText.text)
  }
  private bitmap: egret.Bitmap //元素图
  private checkMarkBit: egret.Bitmap //对勾图
  private bitText: egret.BitmapText
  private init() {
    this.touchChildren = false
    if (!this.bitmap) {
      this.bitmap = new egret.Bitmap()
    }

    const bitWidth: number = GameData.getGridWidth()
    this.bitmap.width = bitWidth
    this.bitmap.height = bitWidth

    this.addChild(this.bitmap)

    this.bitText = new egret.BitmapText()
    this.bitText.font = RES.getRes('number_fnt')
    this.bitText.text = '0'
    this.bitText.x = (bitWidth - this.bitText.width) / 2

    this.bitText.y = this.bitmap.height + this.bitmap.y - this.bitText.height / 2
    //console.log(this.bitText.height  );

    this.addChild(this.bitText)
  }

  public setTexture(val: string) {
    this.bitmap.texture = RES.getRes(val)
  }
}
