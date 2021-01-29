class GameLogic {
  private _gameStage: egret.Sprite
  private elementViewManage: ElementViewManage
  private levelViewManage: LevelReqViewManage
  private mapControl: MapControl
  private propViewManage: PropViewManage

  public constructor(gameStage: egret.Sprite) {
    this._gameStage = gameStage
    this.init()
  }

  /*-----------------------------初始化数据,创建各种控制器--------------------------------------*/
  private init() {
    GameData.initData() //初始化数据

    const levelData = RES.getRes('level1_json') //初始化GameData数据

    MapDataParse.createMapData(levelData.map) //创建地图数据
    LevelGameDataParse.parseLevelGameData(levelData)
    ElementTypeParse.creatElementTypeData(levelData.element)

    this.mapControl = new MapControl()
    this.mapControl.createElementAllMap()

    const gameBackground: GameBackground = new GameBackground()
    this._gameStage.addChild(gameBackground)
    gameBackground.changeBackground()

    const levelViewManage: egret.Sprite = new egret.Sprite()
    this._gameStage.addChild(levelViewManage)
    this.levelViewManage = new LevelReqViewManage(levelViewManage)
    this.levelViewManage.createCurrentLevelReq()

    const propViewManage: egret.Sprite = new egret.Sprite()
    this._gameStage.addChild(propViewManage)
    this.propViewManage = new PropViewManage(propViewManage)

    const elementViewManage: egret.Sprite = new egret.Sprite()
    this._gameStage.addChild(elementViewManage)
    this.elementViewManage = new ElementViewManage(elementViewManage)
    this.elementViewManage.showAllElements()

    // /注册侦听器，即指定事件由  哪个对象  的哪个方法来接受
    //下面监听的事件 只能有evm 来触发
    this.elementViewManage.addEventListener(ElementViewManageEvent.REMOVE_ANIMATION_OVER, this.removeAndOver, this)
    this.elementViewManage.addEventListener(ElementViewManageEvent.TAP_TWO_ELEMENT, this.viewTouchTap, this)
    this.elementViewManage.addEventListener(ElementViewManageEvent.UPDATE_MAP, this.createNewElement, this)
    this.elementViewManage.addEventListener(ElementViewManageEvent.UPDATE_VIEW_OVER, this.checkOtherElementLink, this)
    this.elementViewManage.addEventListener(ElementViewManageEvent.USE_PROP_CLICK, this.usePropClick, this)
  }

  /*-----------------------------元素置换动画播放结束，数据操作，并播放删除动画--------------------------------------*/
  /**
   * 即将删除的元素移动结束
   * 开始搜索删除数据，并且播放删除动画
   * 更新地图数据
   * 更新其他数据
   */
  private removeAndOver(evt: ElementViewManageEvent) {
    console.log('需要消除' + LinkLogic.lines)

    LinkLogic.lines.forEach((line: number[]) => {
      line.forEach((item: number) => {
        const elType = GameData.getElementType(item)

        //有相同关卡类型,运动到指定位置
        if (this.levelViewManage.haveReqType(elType)) {
          const p: egret.Point = this.levelViewManage.getPointByType(elType)

          GameData.levelReq.changeReqNum(elType, 1)
          this.levelViewManage.update()
          this.elementViewManage.playReqRemoveAn(item, p.x, p.y)

          return
        }

        this.elementViewManage.playRemoveAni(item)
      })
    })
  }
  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*-----------------------------视图管理器中存在两个被tap的元素，进行判断--------------------------------------*/
  private viewTouchTap(evt: ElementViewManageEvent) {
    if (LinkLogic.canMove(evt.ele1, evt.ele2)) {
      // 判断两个位置移动后是否可以消除
      const lineRel = LinkLogic.isHaveLineByIndex(
        GameData.getElementLocation(evt.ele1),
        GameData.getElementLocation(evt.ele2)
      )

      // 执行移动
      this.elementViewManage.changeLocationWithScaleOrBack(evt.ele1, evt.ele2, !lineRel)

      // 可以移动，更新步数
      if (lineRel && GameData.playerStep > 0) {
        GameData.playerStep--
        this.levelViewManage.updateStep()
      }

      return
    }

    this.elementViewManage.setNewElementFocus(evt.ele2) //两个元素从空间位置上不可交换，设置新焦点
  }
  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*---------------------------所有元素都删除完毕后，创建新元素，并刷新视图---------------------------------*/
  private createNewElement(evt: ElementViewManageEvent) {
    //多次调用 问题 通过计数器 解决
    console.log('刷新地图数据！！！！！！！！')
    this.mapControl.updateMapLocation()
    this.elementViewManage.updateMapData()
  }
  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*-----------------------------删除动画完成后，检测地图中是否存在剩余可消除元素--------------------------------------*/
  private checkOtherElementLink(evt: ElementViewManageEvent) {
    if (LinkLogic.isHaveLine()) {
      //地图中还有可消除的元素
      this.removeAndOver(null)
    } else if (!LinkLogic.isNextHaveLine()) {
      console.log('检查是否有可消除元素!')

      while (true) {
        console.log('执行乱序')
        LinkLogic.changeOrder() //乱序

        if (!LinkLogic.isHaveLine() && LinkLogic.isNextHaveLine()) {
          //没有可消除的元素了且存在移动一步可消除的项目
          this.elementViewManage.updateOrder()
          break
        }
      }
    }

    console.log('所有动画逻辑结束')
    //检测步数和关卡数
    this.isGameOver()
  }

  /*-----------------------------携带道具被点击--------------------------------------*/
  private usePropClick(evt: ElementViewManageEvent) {
    PropLogic.useProp(PropViewManage.propType, evt.propToElementLocation) //操作数据
    this.propViewManage.useProp()
    this.removeAndOver(null) //播放删除动画
  }
  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
  /*-----------------------------检测当前游戏是否GameOver------------------------------*/
  private gameOverPanel: GameOverPanel
  private isGameOver() {
    console.log('过关元素是否清空', GameData.levelReq.isClear())
    if (this.gameOverPanel) {
      return
    }

    const isClear = GameData.levelReq.isClear()
    const isOver = GameData.playerStep == 0

    if (isOver || isClear) {
      this.gameOverPanel = new GameOverPanel()
      this._gameStage.addChild(this.gameOverPanel)

      this.gameOverPanel.show(isOver ? isClear : true)
    }
  }
  /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
}
