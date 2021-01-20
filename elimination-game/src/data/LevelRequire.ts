class LevelRequire {
  reqElements: LevelRequireElement[]

  constructor() {
    this.reqElements = []
  }

  getLevelReqNum() {
    return this.reqElements.length
  }

  addElement(type: string, num: number) {
    const ele = new LevelRequireElement()
    ele.type = type
    ele.num = num

    this.reqElements.push(ele)
  }

  // 开启下一关卡，清空通关元素
  reset() {
    this.reqElements = []
  }

  // 消除关卡元素，找到对应类型关卡元素，减掉消除关卡元素数量
  changeReqNum(type: string, num: number) {
    const len = this.getLevelReqNum()
    for (let i = 0; i < len; i++) {
      const element = this.reqElements[i]
      if (element.type === type) {
        element.num -= num
        return
      }
    }
  }

  // 判断是否消除关卡所有元素
  isClear() {
    const len = this.getLevelReqNum()
    for (let i = 0; i < len; i++) {
      const element = this.reqElements[i]
      if (element.num !== 0) {
        return false
      }
    }

    return true
  }
}
