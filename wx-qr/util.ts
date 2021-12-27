export const COMPONENT_NAME = "wx-qr";
export const DEFAULT_SIZE = "200rpx";

const screenWidth = wx.getSystemInfoSync()['screenWidth'];

export function getPxFromRpx(rpx: number): number {
  return Math.round(rpx * screenWidth / 750);
}
export function getRpxFromPx(px: number): number {
  return Math.round(px * 750 / screenWidth);
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
export function resetCanvasHeighAndWidth(canvas: WechatMiniprogram.Canvas, size: number, scale?: number | undefined) {
  const ctx: WechatMiniprogram.CanvasContext = canvas.getContext('2d');
  let dpr = wx.getSystemInfoSync().pixelRatio;
  if (scale) {
    dpr = scale;
  }

  canvas.width = size * dpr
  canvas.height = size * dpr
  ctx.scale(dpr, dpr);
  return canvas
}

export function getRoundNum(num: number, fixedNum: number = 0): number {
  return Number(num.toFixed(fixedNum))
}
export function getPxFromStringOrNumber(pixel: number | string | undefined): number {
  let px = 0;
  if (!pixel) {
    return px
  }
  if (typeof pixel !== 'string') {
    return getPxFromRpx(pixel);
  }

  px = Number(pixel.match(/\d+\.?\d+?/)![0])

  if (pixel.endsWith('px')) {
    return px;
  } else {
    return getPxFromRpx(px)
  }
}

export function getRpxFromStringOrNumber(rpx: number | string | undefined): number {
  let px = 0;
  
  if (!rpx) {
    return px;
  }
  if (typeof rpx === 'number') {
    return rpx
  }
  px = Number(rpx.match(/\d+\.?\d+?/)![0])
  if (rpx.endsWith('px')) {
    return getRpxFromPx(px)
  } else {
    return px
  }
}