class PropViewManage {
  private _layer: egret.Sprite

  public constructor(root: egret.Sprite) {
    this._layer = root
    this.init()
  }

  private _props: PropView[]
  private init() {
    this._props = new Array()
    this.createData()
  }

  /**
   * 随机生成 道具 数量
   */
  private createData() {
    for (let i: number = 0; i < 5; i++) {
      const prop: PropView = new PropView(i)
      prop.x = 15 + (5 + prop.width) * i
      prop.y = GameData.stageH - prop.height - 10 //- 15;
      prop.num = Math.floor(Math.random() * 5)
      prop.id = i

      prop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this)

      this._layer.addChild(prop)
      this._props.push(prop)
    }
  }

  private _currentID: number = -1
  /**
   * 处理道具被点击事件
   */
  private click(evt: egret.TouchEvent) {
    const currentID = (<PropView>evt.currentTarget).id

    if (this._currentID != -1 && this._currentID == currentID) {
      this._props[this._currentID].setFocus(false)
      this._currentID = -1
      PropViewManage.propType = -1

      return
    }

    this._currentID = currentID
    this._props[this._currentID].setFocus(true)
    PropViewManage.propType = this._props[this._currentID].propType
  }

  public static propType: number = -1 //道具类型
  /**
   * 使用道具
   */
  public useProp() {
    this._props[this._currentID].num--
    this._props[this._currentID].setFocus(false)
    this._currentID = -1
    PropViewManage.propType = -1
  }
}
