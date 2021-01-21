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

  static isNextHaveLine() {
    for (let row = 0; row < GameData.MaxRow; row++) {
      for (let col = 0; col < GameData.MaxColumn; col++) {
        const currentMapItem = GameData.getMapItem(row, col)
        // 当前地图项有效，寻找周围的六个点
        if (GameData.hadMapItem(currentMapItem)) {
          // 纵向判断-列没到右边界
          if (col < GameData.MaxColumn - 1) {
            const rightMapItem = GameData.getMapItem(row, col + 1)

            // 右侧地图有效 且 与当前地图类型相等
            if (
              GameData.hadMapItem(rightMapItem) &&
              GameData.elements[currentMapItem].type === GameData.elements[rightMapItem].type
            ) {
              // 左侧地图可使用，及判断左侧地图 上、下、左边是否与当前地图类型一致
              if (col > 0 && GameData.hadMapItem(GameData.getMapItem(row, col - 1))) {
                // 左上地图类型 与 当前地图类型一致
                if (row > 0) {
                  const leftTopMapItem = GameData.getMapItem(row - 1, col - 1)

                  if (
                    leftTopMapItem &&
                    GameData.hadMapItem(leftTopMapItem) &&
                    GameData.elements[leftTopMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }

                // 左下地图类型 与 当前地图类型一致
                if (row < GameData.MaxRow - 1) {
                  const leftBottomMapItem = GameData.getMapItem(row + 1, col - 1)

                  if (
                    GameData.hadMapItem(leftBottomMapItem) &&
                    GameData.elements[leftBottomMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }

                // 左左地图类型 与 当前地图类型一致
                if (col > 1) {
                  const leftLeftMapItem = GameData.getMapItem(row, col - 2)

                  if (
                    GameData.hadMapItem(leftLeftMapItem) &&
                    GameData.elements[leftLeftMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }
              }

              // 右右侧地图可使用，及判断右右侧地图 上、下、右边是否与当前地图类型一致
              if (col < GameData.MaxColumn - 2 && GameData.hadMapItem(GameData.getMapItem(row, col + 2))) {
                // 右上地图类型 与 当前地图类型一致
                if (row > 0) {
                  const rightRightTopMapItem = GameData.getMapItem(row - 1, col + 2)

                  if (
                    rightRightTopMapItem &&
                    GameData.hadMapItem(rightRightTopMapItem) &&
                    GameData.elements[rightRightTopMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }

                // 右下地图类型 与 当前地图类型一致
                if (row < GameData.MaxRow - 1) {
                  const rightRightBottomMapItem = GameData.getMapItem(row + 1, col + 2)

                  if (
                    GameData.hadMapItem(rightRightBottomMapItem) &&
                    GameData.elements[rightRightBottomMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }

                // 右右地图类型 与 当前地图类型一致
                if (col < GameData.MaxColumn - 3) {
                  const rightRightRightMapItem = GameData.getMapItem(row, col + 3)

                  if (
                    GameData.hadMapItem(rightRightRightMapItem) &&
                    GameData.elements[rightRightRightMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }
              }
            }
          }

          // 横向判断-行没到下边界
          if (row < GameData.MaxRow - 1) {
            const topMapItem = GameData.getMapItem(row + 1, col)

            // 上侧地图有效 且 与当前地图类型相等
            if (
              GameData.hadMapItem(topMapItem) &&
              GameData.elements[currentMapItem].type === GameData.elements[topMapItem].type
            ) {
              // 上侧地图可使用，及判断上侧地图 左、右、上边是否与当前地图类型一致
              if (row > 0 && GameData.hadMapItem(GameData.getMapItem(row - 1, col))) {
                // 左上地图类型 与 当前地图类型一致
                if (col > 0) {
                  const leftTopMapItem = GameData.getMapItem(row - 1, col - 1)

                  if (
                    leftTopMapItem &&
                    GameData.hadMapItem(leftTopMapItem) &&
                    GameData.elements[leftTopMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }

                // 右上地图类型 与 当前地图类型一致
                if (col < GameData.MaxColumn - 1) {
                  const rightTopMapItem = GameData.getMapItem(row - 1, col + 1)

                  if (
                    GameData.hadMapItem(rightTopMapItem) &&
                    GameData.elements[rightTopMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }

                // 上上地图类型 与 当前地图类型一致
                if (row > 1) {
                  const topTopMapItem = GameData.getMapItem(row - 2, col)

                  if (
                    GameData.hadMapItem(topTopMapItem) &&
                    GameData.elements[topTopMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }
              }

              // 下下侧地图可使用，及判断下下侧地图 左、右、下边是否与当前地图类型一致
              if (row < GameData.MaxRow - 2 && GameData.hadMapItem(GameData.getMapItem(row + 2, col))) {
                // 下下左地图类型 与 当前地图类型一致
                if (col > 0) {
                  const leftBottomBottomMapItem = GameData.getMapItem(row + 2, col - 1)

                  if (
                    leftBottomBottomMapItem &&
                    GameData.hadMapItem(leftBottomBottomMapItem) &&
                    GameData.elements[leftBottomBottomMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }

                // 下下右地图类型 与 当前地图类型一致
                if (col < GameData.MaxColumn - 1) {
                  const rightBottomBottomMapItem = GameData.getMapItem(row + 2, col + 1)

                  if (
                    GameData.hadMapItem(rightBottomBottomMapItem) &&
                    GameData.elements[rightBottomBottomMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }

                // 下下下地图类型 与 当前地图类型一致
                if (row < GameData.MaxRow - 3) {
                  const bottomBottomBottomMapItem = GameData.getMapItem(row + 3, col)

                  if (
                    GameData.hadMapItem(bottomBottomBottomMapItem) &&
                    GameData.elements[bottomBottomBottomMapItem].type === GameData.elements[currentMapItem].type
                  ) {
                    return true
                  }
                }
              }
            }
          }

          // 如果有两个方块在同一行或同一列，且中间间隔一个空地图
        }
      }
    }
  }
}
