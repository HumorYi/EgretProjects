class MapDataParse {
  static createMapData(val: number[]) {
    val.forEach((item: number) => GameData.setMapItemByIndex(item, -1))

    GameData.mapUnUsedElementNum = val.length
    GameData.mapUseElementNum = GameData.MaxRow * GameData.MaxColumn - GameData.mapUnUsedElementNum
  }
}
