class ElementViewManage extends egret.EventDispatcher {
  private _layer: egret.Sprite //元素存在的容器
  public constructor(elementLayer: egret.Sprite) {
    super()
    this._layer = elementLayer
    this.init()
  }

  /*-----------------------------初始化数据--------------------------------------*/
  //ElementView对象池，全局仅最多GameData.MaxRow*GameData.MaxColumn个，默认为64个
  private elementViews: ElementView[]
  /**
   * 初始化所有数据变量
   */
  private init() {
    this.elementViews = new Array()
    const len: number = GameData.MaxColumn * GameData.MaxRow

    for (let i = 0; i < len; i++) {
      const el: ElementView = new ElementView(this._layer)
      el.id = i
      el.location = GameData.getElementLocation(i)
      el.evm = this // 给ElementView用来触发 ElementViewManageEvent事件
      el.addEventListener(egret.TouchEvent.TOUCH_TAP, this.elTap, this)

      this.elementViews.push(el)
    }
  }

  /*-----------------------------焦点相关控制--------------------------------------*/
  private _invalidCurrentTapID = -1
  private _currentTapID: number = this._invalidCurrentTapID //当前被点击（即将获取焦点）的元素ID，如为-1则表示没有元素获取焦点或无点击对象

  private hadCurrentTapID() {
    return this._currentTapID !== this._invalidCurrentTapID
  }

  private resetCurrentTapID() {
    this.setCurrentTapID(this._invalidCurrentTapID)
  }

  private setCurrentTapID(val: number) {
    this._currentTapID = val
  }

  private elTap(evt: egret.TouchEvent) {
    const ev: ElementView = <ElementView>evt.currentTarget

    //无道具激活
    if (PropViewManage.propType == -1) {
      if (this.hadCurrentTapID()) {
        if (ev.id == this._currentTapID) {
          ev.setFocus(false)

          this.resetCurrentTapID()

          return
        }

        const event: ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.TAP_TWO_ELEMENT) //点击第二个元素 回掉函数
        event.ele1 = this._currentTapID
        event.ele2 = ev.id

        this.dispatchEvent(event)

        return
      }

      ev.setFocus(true)

      this.setCurrentTapID(ev.id)

      return
    }

    //使用道具
    this.hadCurrentTapID() && this.resetCurrentTapID()

    const event: ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.USE_PROP_CLICK)
    event.propToElementLocation = ev.location
    this.dispatchEvent(event)
  }

  public setNewElementFocus(location: number) {
    this.elementViews[this._currentTapID].setFocus(false)
    this.elementViews[location].setFocus(true)
    this._currentTapID = location
  }

  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*-----------------------------显示所有元素，并播放出场动画--------------------------------------*/
  public showAllElements() {
    this._layer.removeChildren()

    const startY: number = GameData.getGridStartY()

    GameData.loopMapByHorizontal((mapItem: number, row: number, col: number) => {
      if (!GameData.hadMapItem(mapItem)) {
        return
      }

      const ele: ElementView = this.elementViews[mapItem]
      ele.setTexture('e' + GameData.getElementType(mapItem) + '_png')
      ele.x = ele.targetX()
      ele.y = startY - ele.width

      ele.show(
        50 * (GameData.MaxColumn * GameData.MaxRow - GameData.mapUnUsedElementNum - (row * GameData.MaxRow + col))
      )
    })
  }
  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*-----------------------------播放 删除动画--------------------------------------*/

  /**
   * isBack = true
   * 可以交换，但是交换后没有发生位置移动
   * 移除焦点
   * 播放一个交换的动画，然后两个位置再换回来
   * isBack=false
   * 播放 删除动画-
   */
  public changeLocationWithScaleOrBack(id1: number, id2: number, isBack = false) {
    //从 e1id 交换到 e2id
    let e1id = id1 //有焦点的元素
    let e2id = id2
    if (this.elementViews[id2].focus) {
      e1id = id2
      e2id = id1
    }

    this.elementViews[e1id].setFocus(false)
    if (this._layer.getChildIndex(this.elementViews[e1id]) < this._layer.getChildIndex(this.elementViews[e2id])) {
      this._layer.swapChildren(this.elementViews[e1id], this.elementViews[e2id])
    }

    if (isBack) {
      //播放交互动画，交换后再返回-
      this.elementViews[e1id].moveAndBack(this.elementViews[e2id].location, true)
      this.elementViews[e2id].moveAndBack(this.elementViews[e1id].location)
    } //播放 删除动画
    else {
      this.elementViews[e1id].moveAndScale(this.elementViews[e2id].location, true)
      this.elementViews[e2id].moveAndScale(this.elementViews[e1id].location)
    }

    this.resetCurrentTapID()
  }

  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*-----------------------------动画播放控制--------------------------------------*/
  private moveEleNum: number = 0
  /**
   * 播放曲线动画，此类型动画用于可消除过关条件得情况
   */

  public playReqRemoveAn(id: number, tx: number, ty: number) {
    this.moveEleNum++

    const el: ElementView = this.elementViews[id]
    el.parent && this._layer.setChildIndex(el, this._layer.numChildren)
    el.playCurveMove(tx, ty)
  }
  /**
   * 播放放大动画，播放后直接删除,用于可删除元素，但元素类型不是关卡过关条件
   */
  public playRemoveAni(id: number) {
    this.moveEleNum++

    const el: ElementView = this.elementViews[id]
    el.parent && this._layer.setChildIndex(el, this._layer.numChildren)
    el.playRemoveAni()
  }

  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  //删除动画完成，现在更新地图元素
  public updateMap(evt: ElementViewManageEvent) {
    this.moveEleNum--

    //不会多次触发 事件
    this.moveEleNum == 0 && this.dispatchEvent(evt)
  }
  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*-----------------------------更新整个地图中元素位置--------------------------------------*/
  public updateMapData() {
    const len: number = this.elementViews.length

    for (let i: number = 0; i < len; i++) {
      this.elementViews[i].location = GameData.getElementLocation(i)
      this.elementViews[i].setTexture('e' + GameData.getElementType(i) + '_png')
      this.elementViews[i].moveNewLocation()
    }
  }

  private moveLocElementNum: number = 0

  public moveNewLocationOver(
    event: ElementViewManageEvent //新位置掉落结束
  ) {
    this.moveLocElementNum++

    if (this.moveLocElementNum !== GameData.MaxColumn * GameData.MaxRow) {
      return
    }

    //不会多次触发 事件
    const evt: ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_VIEW_OVER)
    this.dispatchEvent(evt)
    this.moveLocElementNum = 0 //重置
  }
  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*-----------------------------乱序操作，移动全部元素位置--------------------------------*/
  public updateOrder() {
    //乱序移动指令触发
    const len: number = this.elementViews.length

    egret.Tween.removeAllTweens()

    for (let i: number = 0; i < len; i++) {
      this.elementViews[i].location = GameData.getElementLocation(i)
      this.elementViews[i].move()
    }
  }
  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
}
