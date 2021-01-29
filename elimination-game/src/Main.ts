class Main extends egret.Sprite {
  private _gameLogic: GameLogic

  constructor() {
    super()

    // 监听舞台初始化完成事件
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
  }

  private onAddToStage(evt: egret.EventDispatcher) {
    // 监听配置文件加载完成事件
    RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this)

    // 加载配置资源
    RES.loadConfig('resource/default.res.json', 'resource/')
  }

  private onConfigComplete(evt: RES.ResourceEvent) {
    // 移除配置文件加载完成事件
    RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this)

    // 监听组加载完成事件
    RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this)

    // 加载组
    RES.loadGroup('game')
  }

  private onResourceLoadComplete(evt: RES.ResourceEvent) {
    this.createGame()
  }

  private createGame() {
    const gameLayer: egret.Sprite = new egret.Sprite()
    this._gameLogic = new GameLogic(gameLayer)
    this.addChild(gameLayer)
  }
}
