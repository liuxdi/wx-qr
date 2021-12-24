Component({
  methods: {
    onLoad(e) {
      return
      const query = wx.createSelectorQuery();
      query.select('#test').fields({ node: true, size: true, id: true }).exec(res => {
        const canvas: WechatMiniprogram.Canvas = res[0].node;
        const ctx: WechatMiniprogram.CanvasContext = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr);
        const context = ctx;
        context.beginPath();
        context.strokeStyle = "#000000";
        context.lineWidth = 4;
        context.lineTo(100, 100);
        context.lineTo(0, 100);
        context.lineTo(0, 0);
        context.fill();
        context.closePath();
        context.stroke();
      })
    }
  }
})
