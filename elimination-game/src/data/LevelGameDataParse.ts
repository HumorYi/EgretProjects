class LevelGameDataParse {
  static parseLevelGameData(val: any) {
    GameData.playerStep = val.step
    GameData.levelStep = val.step
    GameData.elementTypes = val.element
    GameData.levelBackgroundImageName = val.bgImg

    LevelGameDataParse.parseLevelReq(val.req)
  }

  private static parseLevelReq(val: any) {
    GameData.levelReq.reset()

    val.forEach((item: { type: string; num: number }) => GameData.levelReq.addElement(item.type, item.num))
  }
}
