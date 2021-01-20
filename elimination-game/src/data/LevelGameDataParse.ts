class LevelGameDataParse {
  static levelGameData(val: any) {
    GameData.playerStep = val.step
    GameData.levelStep = val.step
    GameData.elementTypes = val.element
    GameData.levelBackgroundImageName = val.levelBgImg

    LevelGameDataParse.levelReq(val.levelReq)
  }

  private static levelReq(val: any) {
    GameData.levelReq.reset()

    val.forEach((item: any) => GameData.levelReq.addElement(item.type, item.num))
  }
}
