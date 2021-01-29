class LinkLogic {
  static lines: number[][]

  static isHaveLine() {
    LinkLogic.lines = []

    LinkLogic.handleLine(GameData.MaxRow, GameData.MaxColumn)
    LinkLogic.handleLine(GameData.MaxColumn, GameData.MaxRow, true)

    return LinkLogic.lines.length > 0
  }

  static handleLine(row: number, col: number, isCol = false) {
    let currentType = ''
    let typeNum = 0

    const handle = (rowIndex: number, colIndex: number, type = '', num = 0) => {
      LinkLogic.isLine(typeNum) && LinkLogic.addLine(rowIndex, colIndex, typeNum, isCol)

      currentType = type
      typeNum = num
    }

    const handleLoop = (rowIndex: number, colIndex: number) => {
      const mapItem = GameData.getMapItem(rowIndex, colIndex)

      if (GameData.hadMapItem(mapItem)) {
        const type = GameData.getElementType(mapItem)

        if (currentType === type) {
          typeNum++
          return
        }

        handle(rowIndex, colIndex, type, 1)
        return
      }

      handle(rowIndex, colIndex)
    }

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        handleLoop(isCol ? j : i, isCol ? i : j)
      }

      // 避免在行结尾形成一行，导致错误
      handle(isCol ? col : i, isCol ? i : col)
    }
  }

  static isLine(typeNum: number) {
    return typeNum >= 3
  }

  static addLine(row: number, col: number, typeNum: number, isCol: boolean) {
    const line: number[] = []
    const getIndex = (total, current) => total - current - 1

    for (let i = 0; i < typeNum; i++) {
      const rowIndex = isCol ? getIndex(row, i) : row
      const colIndex = isCol ? col : getIndex(col, i)

      line.push(GameData.getMapItem(rowIndex, colIndex))
    }

    LinkLogic.lines.push(line)
  }

  static isEqualMapType(currentMapItem, compareMapItem) {
    return (
      compareMapItem &&
      GameData.hadMapItem(compareMapItem) &&
      GameData.getElementType(compareMapItem) === GameData.getElementType(currentMapItem)
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

  static isHaveLineByIndex(p1: number, p2: number) {
    const p1id = GameData.getMapItemByIndex(p1)
    const p2id = GameData.getMapItemByIndex(p2)
    // 交换两个地图元素的值
    GameData.setMapItemByIndex(p1, p2id)
    GameData.setMapItemByIndex(p2, p1id)

    // 判断交换完成后是否能连线
    const haveLine = LinkLogic.isHaveLine()
    if (haveLine) {
      // 交换两个地图元素位置
      GameData.setElementLocation(p1id, p2)
      GameData.setElementLocation(p2id, p1)
    } else {
      // 交换回两个地图元素的值，即地图保持不变
      GameData.setMapItemByIndex(p1, p1id)
      GameData.setMapItemByIndex(p2, p2id)
    }

    return haveLine
  }

  /**
   * 判断两个点是否可以互相移动，关系是否为上下，左右
   */
  static canMove(id1: number, id2: number): boolean {
    const id1Location = GameData.getElementLocation(id1)
    const id2Location = GameData.getElementLocation(id2)

    const l1row: number = GameData.getRowIndex(id1Location)
    const l1col: number = GameData.getColIndex(id1Location)

    const l2row: number = GameData.getRowIndex(id2Location)
    const l2col: number = GameData.getColIndex(id2Location)

    console.log('判断两点互换位置', id1, id1Location, l1row, l1col, '第二个', id2, id2Location, l2row, l2col)

    return (
      (l1row == l2row && (l1col - l2col == 1 || l1col - l2col == -1)) ||
      (l1col == l2col && (l1row - l2row == 1 || l1row - l2row == -1))
    )
  }

  /**
   * 洗牌 打乱所有顺序,在没有能连接的情况下使用
   */
  static changeOrder(): void {
    const arr: number[] = new Array()

    GameData.loopMapByHorizontal((mapItem: number) => {
      if (!GameData.hadMapItem(mapItem)) {
        return
      }

      arr.push(mapItem)
    })

    GameData.loopMapByHorizontal((mapItem: number, row: number, col: number) => {
      if (!GameData.hadMapItem(mapItem)) {
        return
      }

      const index = Math.floor(Math.random() * arr.length)

      GameData.setMapItem(row, col, arr[index])
      GameData.setElementLocation(arr[index], row * GameData.MaxColumn + col)

      arr.splice(index, 1) //从数组中删除 下标index的元素
    })
  }
}
