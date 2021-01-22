class MapDataParse {
  static createMapData(val: number[]) {
    const len = val.length

    for (let i = 0; i < len; i++) {
      GameData.setMapItemByIndex(val[i], -1)
    }

    GameData.mapUnUsedElementNum = len
    GameData.mapUseElementNum = GameData.MaxRow * GameData.MaxColumn - len
  }
}
