/**
 * 游戏数据-全局共用
 *
 * 方式一：静态类
 * 方式二：单例类
 */
class GameData {
  // 地图未使用元素数量
  static mapUnUsedElementNum = 0
  // 地图使用元素数量
  static mapUseElementNum = 0
  // 地图数据
  static mapData: number[][]
  // 玩家剩余步数
  static playerStep = 0
  // 当前关卡过关步数
  static levelStep = 0
  // 当前关卡出现的元素类型
  static elementTypes: number[]
  // 当前关卡过关条件
  static levelReq: LevelRequire
  // 游戏元素对象池
  static elements: GameElement[]
  // 游戏中未使用元素id列表
  static unUsedElementIDs: number[]
  // 当前关卡背景图
  static levelBackgroundImageName = ''

  // 地图最大行数
  static MaxRow = 8
  // 地图最大列数
  static MaxColumn = 8

  // 舞台宽度
  static stageW = 0
  // 舞台高度
  static stageH = 0

  static initData() {
    GameData.initMapData()
    GameData.initLevelReq()
    GameData.initElement()
    GameData.initStage()
  }

  static initMapData() {
    // -1 当前地图元素不可使用
    // -2 当前地图元素可使用，未放置元素 id
    GameData.mapData = []
    for (let i = 0; i < GameData.MaxRow; i++) {
      const map: number[] = []

      for (let j = 0; j < GameData.MaxColumn; j++) {
        map.push(-2)
      }

      GameData.mapData[i] = map
    }
  }

  static initLevelReq() {
    GameData.levelReq = new LevelRequire()
  }

  static initElement() {
    GameData.elements = []
    GameData.unUsedElementIDs = []

    const len = GameData.MaxRow * GameData.MaxColumn

    for (let i = 0; i < len; i++) {
      const ele = new GameElement()
      ele.id = i

      GameData.elements.push(ele)
      GameData.unUsedElementIDs.push(ele.id)
    }
  }

  static initStage() {
    // TODO: 暂未找到获取舞台宽高方法，后续更改
    GameData.stageW = 750
    GameData.stageH = 1334
  }

  static getMapItem(row: number, col: number) {
    return GameData.mapData[row][col]
  }

  static getMapItemByIndex(index: number) {
    return GameData.mapData[GameData.getRowIndex(index)][GameData.getColIndex(index)]
  }

  static hadMapItem(item: number) {
    return item !== -1
  }

  static getRowIndex(index: number) {
    return Math.floor(index / GameData.MaxColumn)
  }

  static getColIndex(index: number) {
    return index % GameData.MaxRow
  }

  static setMapItem(row: number, col: number, val: any) {
    GameData.mapData[row][col] = val
  }

  static setMapItemByIndex(index, val: any) {
    GameData.setMapItem(GameData.getRowIndex(index), GameData.getColIndex(index), val)
  }
}
