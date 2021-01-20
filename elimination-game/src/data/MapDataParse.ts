class MapDataParse {
  static createMapData(val: number[]) {
    const len = val.length
    let index = 0

    for (let i = 0; i < len; i++) {
      index = val[i]

      const row = Math.floor(index / GameData.MaxColumn)
      const col = index % GameData.MaxRow

      GameData.mapData[row][col] = -1
    }

    GameData.mapUnUsedElementNum = len
    GameData.mapUseElementNum = GameData.MaxRow * GameData.MaxColumn - len
  }
}
