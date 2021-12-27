/// <reference types="miniprogram-api-typings" />
export declare const COMPONENT_NAME = "wx-qr";
export declare const DEFAULT_SIZE = "200rpx";
export declare function getPxFromRpx(rpx: number): number;
export declare function getRpxFromPx(px: number): number;
export declare function loadImage(canvas: WechatMiniprogram.Canvas, imgSrc: string): Promise<WechatMiniprogram.Image>;
export declare function resetCanvasHeighAndWidth(canvas: WechatMiniprogram.Canvas, size: number, scale?: number | undefined): WechatMiniprogram.Canvas;
export declare function getRoundNum(num: number, fixedNum?: number): number;
export declare function getPxFromStringOrNumber(pixel: number | string | undefined): number;
export declare function getRpxFromStringOrNumber(rpx: number | string | undefined): number;
