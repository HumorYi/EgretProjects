class LevelReqViewManage {
  private _layer: egret.Sprite
  public constructor(layer: egret.Sprite) {
    this._layer = layer
    this.init()
  }
  private elements: LevelElementView[]
  private init() {
    this.elements = new Array()
  }

  private stepNumText: egret.BitmapText

  /**
   * 创建当前关卡的过关条件元素
   */
  public createCurrentLevelReq() {
    GameData.levelReq.reqElements.forEach((reqElement: LevelRequireElement, i: number) => {
      let el: LevelElementView = this.elements[i]

      if (!el) {
        el = new LevelElementView()
        this.elements.push(el)
      }

      el.elType = reqElement.type
      el.setTexture('e' + el.elType + '_png')
      el.x = 43 + (5 + el.width) * i
      el.y = 95
      el.num = reqElement.num

      this._layer.addChild(el)
    })

    if (!this.stepNumText) {
      this.stepNumText = new egret.BitmapText()
      this.stepNumText.font = RES.getRes('number_fnt')
      this.stepNumText.x = GameData.stageW - 95
      this.stepNumText.y = 90
      this.stepNumText.scaleX = 1.5
      this.stepNumText.scaleY = 1.5

      this.updateStep()

      this._layer.addChild(this.stepNumText)
    }
  }

  /**
   * 判断是否有指定类型
   * */
  public haveReqType(type: string): boolean {
    return this.elements.some((element: LevelElementView) => {
      console.log('haveReqType', typeof type, typeof element.elType, element.elType === type)
      return element.elType === type
    })
  }

  /**
   * 更新步数信息
   */
  public updateStep() {
    this.stepNumText.text = GameData.playerStep.toString()
  }

  /**
   * 通过类型，获取当前元素再视图中的位置信息
   */
  public getPointByType(type: string): egret.Point {
    const p: egret.Point = new egret.Point()

    this.elements
      .filter((element: LevelElementView) => element.elType === type)
      .forEach((element: LevelElementView) => {
        p.x = element.x + element.width / 2
        p.y = element.y + element.height / 2
      })

    return p
  }

  /**
   * 更新数据
   */
  public update() {
    this.elements.forEach((element: LevelElementView, i: number) => {
      element.num = GameData.levelReq.reqElements[i].num
    })
  }
}
