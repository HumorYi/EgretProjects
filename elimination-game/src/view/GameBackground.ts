class GameBackground extends egret.Sprite {
  constructor() {
    super()
  }

  private horizontalSpace = 20

  private bgImage: egret.Bitmap
  private girdBg: egret.Bitmap[]

  public changeBackground(): void {
    this.cacheAsBitmap = false
    this.removeChildren()
    this.createBackgroundImage()
    this.createMapBg()
    this.createLevelReqBg()
    this.createStepBg()
    this.cacheAsBitmap = true
  }

  private createBackgroundImage() {
    if (!this.bgImage) {
      this.bgImage = new egret.Bitmap()
    }

    this.bgImage.texture = RES.getRes(GameData.levelBackgroundImageName)
    this.bgImage.width = GameData.stageW
    this.bgImage.height = GameData.stageH

    this.addChild(this.bgImage)

    const propBg: egret.Bitmap = new egret.Bitmap()
    propBg.texture = RES.getRes('propbg_png')
    propBg.width = GameData.stageW
    propBg.height = GameData.stageW / 5 + 20
    propBg.y = GameData.stageH - propBg.height

    this.addChild(propBg)
  }

  private isEven(val: number) {
    return (val & 1) === 0
  }

  private isOdd(val: number) {
    return (val & 1) === 1
  }

  private createMapBg() {
    if (!this.girdBg) {
      this.girdBg = []
    }

    const gridWidth: number = (GameData.stageW - this.horizontalSpace * 2) / GameData.MaxColumn
    const startY: number = GameData.stageH - (GameData.stageW - 30) / 6 - 60 - gridWidth * GameData.MaxRow

    let grid: egret.Bitmap

    GameData.loopMapByHorizontal((mapItem: number, row: number, col: number) => {
      if (!GameData.hadMapItem(mapItem)) {
        return
      }

      const max = row * GameData.MaxRow + col
      const resKey =
        (this.isEven(row) && this.isEven(col)) || (this.isOdd(row) && this.isOdd(col))
          ? 'elementbg1_png'
          : 'elementbg2_png'

      if (this.girdBg.length <= max) {
        grid = new egret.Bitmap()
        this.girdBg.push(grid)
      } else {
        grid = this.girdBg[max]
      }

      grid.width = gridWidth
      grid.height = gridWidth
      grid.x = this.horizontalSpace + gridWidth * col
      grid.y = startY + gridWidth * row

      grid.texture = RES.getRes(resKey)

      this.addChild(grid)
    })
  }

  private createLevelReqBg() {
    const girdWidth: number = (GameData.stageW - this.horizontalSpace * 2) / GameData.MaxColumn
    const bg: egret.Bitmap = new egret.Bitmap()
    bg.texture = RES.getRes('levelreqbg_png')
    bg.width = GameData.levelReq.getLevelReqNum() * (10 + girdWidth) + 20
    bg.height = girdWidth + 60
    bg.x = 20
    bg.y = 50
    this.addChild(bg)

    const levelReqTitle: egret.Bitmap = new egret.Bitmap()
    levelReqTitle.texture = RES.getRes('levelreqtitle_png')
    levelReqTitle.x = bg.x + (bg.width - levelReqTitle.width) / 2
    levelReqTitle.y = bg.y - 18
    this.addChild(levelReqTitle)
  }

  private createStepBg() {
    const bg: egret.Bitmap = new egret.Bitmap()
    bg.texture = RES.getRes('levelregbg_png')
    bg.width = 100
    bg.height = 100
    bg.x = GameData.stageW - 110
    bg.y = 50
    this.addChild(bg)

    const surplusStepTitle: egret.Bitmap = new egret.Bitmap()
    surplusStepTitle.texture = RES.getRes('sursteptitle_png')
    surplusStepTitle.x = bg.x + (bg.width - surplusStepTitle.width) / 2
    surplusStepTitle.y = bg.y + 10
    this.addChild(surplusStepTitle)
  }
}
