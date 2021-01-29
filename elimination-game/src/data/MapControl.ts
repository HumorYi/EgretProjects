class MapControl {
  //创建全地图元素
  createElementAllMap() {
    this.createAllMap()
  }

  //根据空行创建元素
  //在游戏初始时候
  createElements(num: number): string[] {
    return new Array(num).map(() => this.createType())
  }

  //创建全部地图元素
  //游戏开始时调用
  private createAllMap() {
    GameData.loopMapByHorizontal((mapItem: number, row: number, col: number) => {
      if (!GameData.hadMapItem(mapItem)) {
        return
      }

      const id = GameData.unUsedElementIDs[0]
      let type: string = ''
      let rowType: string = ''
      let colType: string = ''

      if (row > 1) {
        const topMapItem = GameData.getMapItem(row - 1, col)
        const topTopMapItem = GameData.getMapItem(row - 2, col)

        if (
          GameData.hadMapItem(topMapItem) &&
          GameData.hadMapItem(topTopMapItem) &&
          GameData.getElementType(topMapItem) === GameData.getElementType(topTopMapItem)
        ) {
          rowType = GameData.getElementType(topMapItem)
        }
      }

      if (col > 1) {
        const rightMapItem = GameData.getMapItem(row, col - 1)
        const rightRightMapItem = GameData.getMapItem(row, col - 2)

        if (
          GameData.hadMapItem(rightMapItem) &&
          GameData.hadMapItem(rightRightMapItem) &&
          GameData.getElementType(rightMapItem) === GameData.getElementType(rightRightMapItem)
        ) {
          colType = GameData.getElementType(rightMapItem)
        }
      }

      while (true) {
        type = this.createType()

        if (type !== rowType && type !== colType) {
          break
        }
      }

      GameData.setElementType(id, type)
      GameData.setElementLocation(id, row * GameData.MaxRow + col)
      GameData.setMapItem(row, col, id)
      GameData.unUsedElementIDs.shift()
    })
  }

  //随机创建一个类型元素
  private createType(): string {
    return GameData.elementTypes[Math.floor(Math.random() * GameData.elementTypes.length)].toString()
  }

  //根据当前删除得地图元素，刷新所有元素得位置
  updateMapLocation() {
    //ids是此次被删除得元素ID
    const ids: number[] = []
    //存储列编号得数据，记录共有几列需要移动位置
    const cols: number[] = []

    // id去重，要更新其他得元素位置，并为这几个IDS定制新的类型和位置
    LinkLogic.lines.forEach((line: number[]) => {
      line.forEach((item: number) => {
        if (ids.indexOf(item) === -1) {
          //针对某一个数据元素更新它得类型
          GameData.setElementType(item, this.createType())
          ids.push(item)
        }
      })
    })

    ids.forEach((id: number) => {
      const col = GameData.getColIndex(GameData.getElementLocation(id))

      cols.indexOf(col) === -1 && cols.push(col)
    })

    //重新得到当前这列ID的排序
    cols.forEach((col: number) => {
      const newColIds: number[] = []
      const removeIds: number[] = []

      for (let row = GameData.MaxRow - 1; row >= 0; row--) {
        const mapItem = GameData.getMapItem(row, col)

        if (ids.indexOf(mapItem) === -1) {
          GameData.hadMapItem(mapItem) && newColIds.push(mapItem)
        } else {
          removeIds.push(mapItem)
        }
      }

      const colIds: number[] = newColIds.concat(removeIds)

      //将元素重新放入map中，并改变元素Location
      for (let row = GameData.MaxRow - 1; row >= 0; row--) {
        const mapItem = GameData.getMapItem(row, col)

        if (GameData.hadMapItem(mapItem)) {
          GameData.setMapItem(row, col, colIds[0])
          GameData.setElementLocation(colIds[0], row * GameData.MaxRow + col)

          colIds.shift()
        }
      }
    })
  }
  /*
    //按照格式打印map数据
    private spr:egret.Sprite = new egret.Sprite();
    logAllMap(root:egret.Sprite)
    {
        this.updates();

        this.spr.touchEnabled=true;
        this.spr.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.tuo,this);
        root.addChild(this.spr);
    }
    private updates()
    {
        var str:string = "";
        var cstr:string = "";

        this.spr.cacheAsBitmap = false;
        this.spr.removeChildren();
        for(var i:number=0;i<GameData.MaxRow;i++)
        {
            for(var t:number=0;t<GameData.MaxColumn;t++)
            {
                if(GameData.mapData[i][t]!=-1)
                {
                    cstr = "|id:"+GameData.mapData[i][t]+"|\n";
                    cstr += "|type:" + GameData.elements[GameData.mapData[i][t]].type+"|\n";
                    cstr += "|eid:" + GameData.elements[GameData.mapData[i][t]].id+"|\n";
                    cstr += "|lot:"+GameData.elements[GameData.mapData[i][t]].location+"|\n";
                    cstr += "|i,t:"+i.toString()+","+t.toString()+"|";
                }
                else
                {
                    cstr = "|id:"+GameData.mapData[i][t]+"|";
                }
                var txt:egret.TextField = new egret.TextField();
                txt.text = cstr;
                txt.size = 12;
                txt.width = 100;
                txt.height = 100;
                txt.y = 70*i;
                txt.x = 50*t;
                this.spr.addChild(txt);
            }
        }
        var shp:egret.Shape = new egret.Shape();
        shp.graphics.beginFill(0,0.4);
        shp.graphics.drawRect(0,0,this.spr.width,this.spr.height);
        shp.graphics.endFill();
        this.spr.addChildAt(shp,0);
        this.spr.cacheAsBitmap = true;
    }
    private tuo(evt:egret.TouchEvent)
    {
        if(this.spr.x == GameData.stageW-20)
        {
            this.spr.x = 0;
        }
        else
        {
            this.spr.x = GameData.stageW-20;
        }
        this.updates();
    }*/
}
