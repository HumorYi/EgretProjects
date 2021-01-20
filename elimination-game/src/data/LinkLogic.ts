class LinkLogic {
  static lines: number[][]

  static isHaveLine() {
    LinkLogic.lines = []

    LinkLogic.handleLine(GameData.MaxRow, GameData.MaxColumn)
    LinkLogic.handleLine(GameData.MaxColumn, GameData.MaxRow)

    return LinkLogic.lines.length > 0
  }

  static handleLine(row: number, col: number) {
    let currentType = ''
    let typeNum = 0

    const handle = (rowIndex: number, colIndex: number, type = '', num = 0) => {
      LinkLogic.isLine(typeNum) && LinkLogic.addLine(rowIndex, colIndex, typeNum)

      currentType = type
      typeNum = num
    }

    const handleLoop = (rowIndex: number, colIndex: number) => {
      const mapItem = GameData.getMapItem(rowIndex, colIndex)

      if (GameData.hadMapItem(mapItem)) {
        const type = GameData.elements[mapItem].type

        if (currentType === type) {
          typeNum++
          return
        }

        handle(rowIndex, colIndex, type, 1)
        return
      }

      handle(rowIndex, colIndex)
    }

    for (let i = 0, j = 0; i < row; i++) {
      for (; j < col; j++) {
        handleLoop(i, j)
      }

      // 避免在行结尾形成一行，导致错误
      handle(i, j)
    }
  }

  static isLine(typeNum: number) {
    return typeNum >= 3
  }

  static addLine(row: number, col: number, typeNum: number) {
    const line: number[] = []

    for (let i = 0; i < typeNum; i++) {
      line.push(GameData.getMapItem(row, col - i - 1))
    }

    LinkLogic.lines.push(line)
  }
}
