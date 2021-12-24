export const COMPONENT_NAME = "wx-qr";
export const DEFAULT_SIZE = "200rpx";

export function getPxFromRpx(rpx: number): number {
  const screenWidth = wx.getSystemInfoSync()['screenWidth'];
  return Math.round(rpx * screenWidth / 750);
}

export function loadImage(canvas: WechatMiniprogram.Canvas, imgSrc: string): Promise<WechatMiniprogram.Image> {
  return new Promise((reslove, reject) => {
    const img = canvas.createImage();
    img.src = imgSrc;
    img.onload = () => {
      reslove(img);
    }
    img.onerror = (e) => {
      reject(e)
    }
  })
}
export function resetCanvasHeighAndWidth(canvas: WechatMiniprogram.Canvas, size: number, needDpr: boolean = true) {
  const ctx: WechatMiniprogram.CanvasContext = canvas.getContext('2d');
  let dpr = 1;
  if (needDpr) {
    dpr = wx.getSystemInfoSync().pixelRatio
  }
  canvas.width = size * dpr
  canvas.height = size * dpr
  ctx.scale(dpr, dpr);
  return canvas
}