class PropView extends egret.Sprite {
  public constructor(type: number) {
    super()
    this._type = type
    this.init()
  }

  //道具元素界面
  private _view_box: egret.Bitmap //道具盒子
  private _view_activate: egret.Bitmap //激活道具图像
  // private _view_disable:egret.Bitmap;   //禁用道具图像
  private _numText: egret.BitmapText //数字文本
  private _type: number = -1 //道具类型
  public id: number = -1

  public get propType(): number {
    return this._type
  }

  private init() {
    this.createView()
    this.createNumText()
    this.addChild(this._view_activate)
    this.addChild(this._view_box)
    this.addChild(this._numText)
    this.setActivateState(true)
  }

  private createNumText() {
    this._numText = new egret.BitmapText()
    this._numText.font = RES.getRes('number_fnt')
    this._numText.x = this._view_activate.width - 31
  }

  private createView() {
    var _interval: number = 15
    var _width: number = (GameData.stageW - _interval * 6) / 5
    if (!this._view_activate) {
      this._view_activate = new egret.Bitmap()
      this._view_activate.texture = RES.getRes(this.getActivateTexture(this._type))
      this._view_activate.width = _width
      this._view_activate.height = _width
    }
    /*if(!this._view_disable)
        {
            this._view_disable = new egret.Bitmap();
            this._view_disable.texture = RES.getRes(this.getDisableTexture(this._type));
            this._view_disable.width = _width;
            this._view_disable.height = _width;
        }*/
    if (!this._view_box) {
      this._view_box = new egret.Bitmap()
      this._view_box.texture = RES.getRes('propbox_png')
      this._view_box.width = this._view_activate.width + 10
      this._view_box.height = this._view_activate.height + 10
      this._view_box.x = -5
      this._view_box.y = -5
    }
  }

  private _num: number = 0 //数量
  public get num(): number {
    return this._num
  }
  public set num(val: number) {
    this._num = val
    this._numText.text = val.toString()
    this.setActivateState(val > 0)
  }

  private setActivateState(val: boolean) {
    this.touchEnabled = val

    const _view_activate_key = val ? this.getActivateTexture(this._type) : this.getDisableTexture(this._type)
    const _view_box_key = val ? 'propbox_png' : 'propboxdisable_png'
    const _numText_key = val ? 'number_fnt' : 'numberdisable_fnt'

    this._view_activate.texture = RES.getRes(_view_activate_key)
    this._view_box.texture = RES.getRes(_view_box_key)
    this._numText.font = RES.getRes(_numText_key)

    /*
        if(val)
        {
            if(this._view_disable.parent)
            {
                this.removeChild(this._view_disable);
            }
            this.addChild(this._view_activate);
            this.addChild(this._view_box);
            this.addChild(this._numText);
        }
        else
        {
            if(this._view_activate.parent)
            {
                this.removeChild(this._view_activate);
            }
            if(this._numText.parent)
            {
                this.removeChild(this._numText);
            }
            if(this._view_box.parent)
            {
                this.removeChild(this._view_box);
            }
            this.addChild(this._view_disable);
        }*/
  }

  private getActivateTexture(type: number): string {
    const config = {
      0: 'tongse_png',
      1: 'zhadan_png',
      2: 'zhenghang_png',
      3: 'zhenglie_png',
      4: 'chanzi_png'
    }
    return config[type] || ''
  }
  private getDisableTexture(type: number): string {
    const config = {
      0: 'tongsedisable_png',
      1: 'zhadandisable_png',
      2: 'zhenghangdisable_png',
      3: 'zhengliedisable_png',
      4: 'chanzidisable_png'
    }
    return config[type] || ''
  }

  public setFocus(val: boolean) {
    this._view_box.texture = RES.getRes(val ? 'propboxactive_png' : 'propbox_png')
  }
}
