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

  static isEqualMapType(currentMapItem, compareMapItem) {
    return (
      compareMapItem &&
      GameData.hadMapItem(compareMapItem) &&
      GameData.elements[compareMapItem].type === GameData.elements[currentMapItem].type
    )
  }

  static isNextHaveLine() {
    for (let row = 0; row < GameData.MaxRow; row++) {
      for (let col = 0; col < GameData.MaxColumn; col++) {
        const currentMapItem = GameData.getMapItem(row, col)

        // 当前地图项无效，跳过后续有效执行过程
        if (!GameData.hadMapItem(currentMapItem)) {
          continue
        }

        // 当前地图项有效，寻找周围的六个点
        // 纵向判断-列没到右边界，右侧地图有效 且 与当前地图类型相等
        if (
          col < GameData.MaxColumn - 1 &&
          LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row, col + 1))
        ) {
          // 左侧地图可使用，即判断左侧地图 上、下、左边是否与当前地图类型一致
          if (col > 0 && GameData.hadMapItem(GameData.getMapItem(row, col - 1))) {
            // 左上
            if (row > 0 && LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row - 1, col - 1))) {
              return true
            }

            // 左下
            if (
              row < GameData.MaxRow - 1 &&
              LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row + 1, col - 1))
            ) {
              return true
            }

            // 左左
            if (col > 1 && LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row, col - 2))) {
              return true
            }
          }

          // 右右侧地图可使用，即判断右右侧地图 上、下、右边是否与当前地图类型一致
          if (col < GameData.MaxColumn - 2 && GameData.hadMapItem(GameData.getMapItem(row, col + 2))) {
            // 右上
            if (row > 0 && LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row - 1, col + 2))) {
              return true
            }

            // 右下
            if (
              row < GameData.MaxRow - 1 &&
              LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row + 1, col + 2))
            ) {
              return true
            }

            // 右右
            if (
              col < GameData.MaxColumn - 3 &&
              LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row, col + 3))
            ) {
              return true
            }
          }
        }

        // 横向判断-行没到下边界，上侧地图有效 且 与当前地图类型相等
        if (row < GameData.MaxRow - 1 && LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row + 1, col))) {
          // 上侧地图可使用，即判断上侧地图 左、右、上边是否与当前地图类型一致
          if (row > 0 && GameData.hadMapItem(GameData.getMapItem(row - 1, col))) {
            // 左上
            if (col > 0 && LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row - 1, col - 1))) {
              return true
            }

            // 右上
            if (
              col < GameData.MaxColumn - 1 &&
              LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row - 1, col + 1))
            ) {
              return true
            }

            // 上上
            if (row > 1 && LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row - 2, col))) {
              return true
            }
          }

          // 下下侧地图可使用，即判断下下侧地图 左、右、下边是否与当前地图类型一致
          if (row < GameData.MaxRow - 2 && GameData.hadMapItem(GameData.getMapItem(row + 2, col))) {
            // 下下左
            if (col > 0 && LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row + 2, col - 1))) {
              return true
            }

            // 下下右
            if (
              col < GameData.MaxColumn - 1 &&
              LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row + 2, col + 1))
            ) {
              return true
            }

            // 下下下
            if (
              row < GameData.MaxRow - 3 &&
              LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row + 3, col))
            ) {
              return true
            }
          }
        }

        // 如果有两个方块在同一行或同一列，且中间间隔一个空地图
        // 横向判断，右侧底图可用，判断右右侧地图是否与当前地图类型一致
        if (
          col < GameData.MaxColumn - 2 &&
          GameData.hadMapItem(GameData.getMapItem(row, col + 1)) &&
          LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row, col + 2))
        ) {
          // 右上
          if (row > 0 && LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row - 1, col + 1))) {
            return true
          }

          // 右下
          if (
            row < GameData.MaxRow - 1 &&
            LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row + 1, col + 1))
          ) {
            return true
          }
        }

        // 纵向判断，下侧底图可用，判断下下侧地图是否与当前地图类型一致
        if (
          row < GameData.MaxRow - 2 &&
          GameData.hadMapItem(GameData.getMapItem(row + 1, col)) &&
          LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row + 2, col))
        ) {
          // 左下
          if (col > 0 && LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row + 1, col - 1))) {
            return true
          }

          // 右下
          if (
            col < GameData.MaxColumn - 1 &&
            LinkLogic.isEqualMapType(currentMapItem, GameData.getMapItem(row + 1, col + 1))
          ) {
            return true
          }
        }
      }
    }

    return false
  }

  static isMoveLineByIndex(p1: number, p2: number) {
    // 交换两个地图元素的值
    GameData.setMapItemByIndex(p1, GameData.getMapItemByIndex(p2))
    GameData.setMapItemByIndex(p2, GameData.getMapItemByIndex(p1))
  }
}
