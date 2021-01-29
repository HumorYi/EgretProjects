class PropLogic {
  static useProp(propType: number, elLocation: number) {
    const method = PropLogic.propTypeConfig[propType]
    method && method(elLocation)
  }

  private static propTypeConfig = {
    0: PropLogic.same,
    1: PropLogic.bomb,
    2: PropLogic.row,
    3: PropLogic.col,
    4: PropLogic.shovel
  }

  private static same(location: number) {
    LinkLogic.lines = []
    const arr: number[] = []
    const type = GameData.getElementType(GameData.getMapItemByIndex(location))

    GameData.loopMapByHorizontal(
      (mapItem: number) =>
        GameData.hadMapItem(mapItem) && GameData.getElementType(mapItem) === type && arr.push(mapItem)
    )

    LinkLogic.lines.push(arr)
  }

  private static bomb(location: number) {
    LinkLogic.lines = []

    const row = GameData.getRowIndex(location)
    const col = GameData.getRowIndex(location)
    const arr: number[] = [GameData.getElementId(GameData.getMapItem(row, col))]

    const handler = (row, col) => {
      const mapItem = GameData.getMapItem(row, col)

      GameData.hadMapItem(mapItem) && arr.push(GameData.getElementId(mapItem))
    }

    // 上
    row > 0 && handler(row - 1, col)
    // 下
    row < GameData.MaxRow - 1 && handler(row + 1, col)
    // 左
    col > 0 && handler(row, col - 1)
    // 右
    col < GameData.MaxColumn - 1 && handler(row, col + 1)

    LinkLogic.lines.push(arr)
  }

  private static row(location: number) {
    LinkLogic.lines = []
    const arr: number[] = []

    const row = GameData.getRowIndex(location)

    for (let i = 0; i < row; i++) {
      const mapItem = GameData.getMapItem(row, i)
      GameData.hadMapItem(mapItem) && arr.push(GameData.getElementId(mapItem))
    }

    LinkLogic.lines.push(arr)
  }

  private static col(location: number) {
    LinkLogic.lines = []
    const arr: number[] = []

    const col = GameData.getColIndex(location)

    for (let i = 0; i < col; i++) {
      const mapItem = GameData.getMapItem(i, col)
      GameData.hadMapItem(mapItem) && arr.push(GameData.getElementId(mapItem))
    }

    LinkLogic.lines.push(arr)
  }

  private static shovel(location: number) {
    LinkLogic.lines = [[GameData.getElementId(GameData.getMapItemByIndex(location))]]
  }
}
