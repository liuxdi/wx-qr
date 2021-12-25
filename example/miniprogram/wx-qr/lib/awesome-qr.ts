// import { Canvas, CanvasRenderingContext2D, Image, loadImage } from "skia-canvas";
import { canvasContainer } from "../type";
import { getRoundNum, loadImage, resetCanvasHeighAndWidth } from "../util";
import { QRCodeModel, QRErrorCorrectLevel, QRUtil } from "./qrcode";
type Canvas = WechatMiniprogram.Canvas;
type CanvasRenderingContext2D = WechatMiniprogram.CanvasContext
const defaultScale = 0.4;
export type ComponentOptions = {
  /**
   * Component options for data/ECC.
   */
  data?: {
    /**
     * Scale factor for data/ECC dots.
     * @default 1
     */
    scale?: number;
  };

  /**
   * Component options for timing patterns.
   */
  timing?: {
    /**
     * Scale factor for timing patterns.
     * @default 1
     */
    scale?: number;

    /**
     * Protector for timing patterns.
     * @default false
     */
    protectors?: boolean;
  };

  /**
   * Component options for alignment patterns.
   */
  alignment?: {
    /**
     * Scale factor for alignment patterns.
     * @default 1
     */
    scale?: number;

    /**
     * Protector for alignment patterns.
     * @default false
     */
    protectors?: boolean;
  };

  /**
   * Component options for alignment pattern on the bottom-right corner.
   */
  cornerAlignment?: {
    /**
     * Scale factor for alignment pattern on the bottom-right corner.
     * @default 1
     */
    scale?: number;

    /**
     * Protector for alignment pattern on the bottom-right corner.
     * @default true
     */
    protectors?: boolean;
  };
};

export type Options = {
  /**
   * Text to be encoded in the QR code.
   */
  text: string;

  /**
   * Size of the QR code in pixel.
   *
   * @defaultValue 400
   */
  size?: number;

  /**
   * Size of margins around the QR code body in pixel.
   *
   * @defaultValue 20
   */
  margin?: number;

  /**
   * Error correction level of the QR code.
   *
   * Accepts a value provided by _QRErrorCorrectLevel_.
   *
   * For more information, please refer to [https://www.qrcode.com/en/about/error_correction.html](https://www.qrcode.com/en/about/error_correction.html).
   *
   * @defaultValue 0
   */
  correctLevel?: number;

  /**
   * **This is an advanced option.**
   *
   * Specify the mask pattern to be used in QR code encoding.
   *
   * Accepts a value provided by _QRMaskPattern_.
   *
   * To find out all eight mask patterns, please refer to [https://en.wikipedia.org/wiki/File:QR_Code_Mask_Patterns.svg](https://en.wikipedia.org/wiki/File:QR_Code_Mask_Patterns.svg)
   *
   * For more information, please refer to [https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Masking](https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Masking).
   */
  maskPattern?: number;

  /**
   * **This is an advanced option.**
   *
   * Specify the version to be used in QR code encoding.
   *
   * Accepts an integer in range [1, 40].
   *
   * For more information, please refer to [https://www.qrcode.com/en/about/version.html](https://www.qrcode.com/en/about/version.html).
   */
  version?: number;

  /**
   * Options to control components in the QR code.
   *
   * @deafultValue undefined
   */
  components?: ComponentOptions;

  /**
   * Color of the blocks on the QR code.
   *
   * Accepts a CSS &lt;color&gt;.
   *
   * For more information about CSS &lt;color&gt;, please refer to [https://developer.mozilla.org/en-US/docs/Web/CSS/color_value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
   *
   * @defaultValue "#000000"
   */
  colorDark?: string;

  /**
   * Color of the empty areas on the QR code.
   *
   * Accepts a CSS &lt;color&gt;.
   *
   * For more information about CSS &lt;color&gt;, please refer to [https://developer.mozilla.org/en-US/docs/Web/CSS/color_value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
   *
   * @defaultValue "#ffffff"
   */
  colorLight?: string;

  /**
   * Automatically calculate the _colorLight_ value from the QR code's background.
   *
   * @defaultValue true
   */
  autoColor?: boolean;

  /**
   * Background image to be used in the QR code.
   *
   * Accepts a `data:` string in web browsers or a Buffer in Node.js.
   *
   * @defaultValue undefined
   */
  backgroundImage?: string;

  /**
   * Color of the dimming mask above the background image.
   *
   * Accepts a CSS &lt;color&gt;.
   *
   * For more information about CSS &lt;color&gt;, please refer to [https://developer.mozilla.org/en-US/docs/Web/CSS/color_value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
   *
   * @defaultValue "rgba(0, 0, 0, 0)"
   */
  backgroundDimming?: string;

  /**
   * GIF background image to be used in the QR code.
   *
   * @defaultValue undefined
   */
  gifBackground?: ArrayBuffer;

  /**
   * Use a white margin instead of a transparent one which reveals the background of the QR code on margins.
   *
   * @defaultValue true
   */
  whiteMargin?: boolean;

  /**
   * Logo image to be displayed at the center of the QR code.
   *
   * Accepts a `data:` string in web browsers or a Buffer in Node.js.
   *
   * When set to `undefined` or `null`, the logo is disabled.
   *
   * @defaultValue undefined
   */
  logoImage?: string;

  /**
   * Ratio of the logo size to the QR code size.
   *
   * @defaultValue 0.2
   */
  logoScale?: number;

  /**
   * Size of margins around the logo image in pixels.
   *
   * @defaultValue 6
   */
  logoMargin?: number;

  /**
   * Corner radius of the logo image in pixels.
   *
   * @defaultValue 8
   */
  logoCornerRadius?: number;

  /**
   * @deprecated
   *
   * Ratio of the real size to the full size of the blocks.
   *
   * This can be helpful when you want to make more parts of the background visible.
   *
   * @deafultValue 0.4
   */
  dotScale?: number;
  /**
   *
   * 由于微信不能直接通过createElement生成canvas,目前通过传参形式进行
   *
   */
  canvasContainer?: Record<canvasContainer, WechatMiniprogram.Canvas>;
};

export class AwesomeQR {
  private canvas!: Canvas;
  private canvasContext!: CanvasRenderingContext2D;
  private qrCode?: QRCodeModel;
  private options!: Options;

  static CorrectLevel = QRErrorCorrectLevel;

  private static defaultComponentOptions: ComponentOptions = {
    data: {
      scale: 1,
    },
    timing: {
      scale: 1,
      protectors: false,
    },
    alignment: {
      scale: 1,
      protectors: false,
    },
    cornerAlignment: {
      scale: 1,
      protectors: true,
    },
  };

  static defaultOptions: Options = {
    text: "",
    size: 400,
    margin: 20,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRErrorCorrectLevel.M,
    backgroundImage: undefined,
    backgroundDimming: "rgba(0,0,0,0)",
    logoImage: undefined,
    logoScale: 0.2,
    logoMargin: 4,
    logoCornerRadius: 8,
    whiteMargin: true,
    components: AwesomeQR.defaultComponentOptions,
    autoColor: true,
  };

  constructor(options: Partial<Options>) {
    this.setOptions(options)
    // this.canvas = new Canvas(options.size!, options.size!);

  }

  draw(): Promise<string | undefined> {
    return new Promise((resolve) => this._draw().then(resolve));
  }
  setOptions(options: Partial<Options>): Options {
    const _options = Object.assign({}, options);
    (Object.keys(AwesomeQR.defaultOptions) as (keyof Options)[]).forEach((k) => {
      if (!(k in _options)) {
        Object.defineProperty(_options, k, { value: AwesomeQR.defaultOptions[k], enumerable: true, writable: true });
      }
    });

    if (!_options.components) {
      _options.components = AwesomeQR.defaultComponentOptions;
    } else if (typeof _options.components === "object") {
      (Object.keys(AwesomeQR.defaultComponentOptions) as (keyof ComponentOptions)[]).forEach((k) => {
        if (!(k in _options.components!)) {
          Object.defineProperty(_options.components!, k, {
            value: AwesomeQR.defaultComponentOptions[k],
            enumerable: true,
            writable: true,
          });
        } else {
          Object.defineProperty(_options.components!, k, {
            value: { ...AwesomeQR.defaultComponentOptions[k], ..._options.components![k] },
            enumerable: true,
            writable: true,
          });
        }
      });
    }
    if (_options.dotScale !== null && _options.dotScale !== undefined) {
      if (_options.dotScale! <= 0 || _options.dotScale! > 1) {
        throw new Error("dotScale should be in range (0, 1].");
      }
      _options.components.data!.scale = _options.dotScale;
      _options.components.timing!.scale = _options.dotScale;
      _options.components.alignment!.scale = _options.dotScale;
    }




    this.options = _options as Options;

    this.canvas = options.canvasContainer!.qrMainContainer
    this.canvasContext = this.canvas.getContext("2d");

    this.qrCode = new QRCodeModel(-1, this.options.correctLevel!)

    if (Number.isInteger(this.options.maskPattern)) {
      this.qrCode.maskPattern = this.options.maskPattern!;
    }
    if (Number.isInteger(this.options.version)) {
      this.qrCode.typeNumber = this.options.version!;
    }
    this.qrCode.addData(this.options.text);
    this.qrCode.make();
    return _options as Options;
  }
  private _clear() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private static _prepareRoundedCornerClip(
    canvasContext: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
    canvasContext.arcTo(x + w, y, x + w, y + h, r);
    canvasContext.arcTo(x + w, y + h, x, y + h, r);
    canvasContext.arcTo(x, y + h, x, y, r);
    canvasContext.arcTo(x, y, x + w, y, r);
    canvasContext.closePath();
  }

  private static _getAverageRGB(image: WechatMiniprogram.Image, options: AwesomeQR["options"]) {
    const blockSize = 5;
    const defaultRGB = {
      r: 0,
      g: 0,
      b: 0,
    };
    let width, height;
    let i = -4;
    const rgb = {
      r: 0,
      g: 0,
      b: 0,
    };
    let count = 0;
    //  @ts-ignore
    height = image.naturalHeight || image.height;
    //  @ts-ignore
    width = image.naturalWidth || image.width;
    const canvas = options.canvasContainer!.qrBgContainer
    const context = canvas.getContext("2d");

    if (!context) {
      return defaultRGB;
    }

    let data;
    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      return defaultRGB;
    }

    while ((i += blockSize * 4) < data.data.length) {
      if (data.data[i] > 200 || data.data[i + 1] > 200 || data.data[i + 2] > 200) continue;
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }

    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;
  }

  private static _drawDot(
    canvasContext: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    nSize: number,
    xyOffset: number = 0,
    dotScale: number = 1
  ) {
    canvasContext.fillRect(
      (centerX + xyOffset) * nSize,
      (centerY + xyOffset) * nSize,
      dotScale * nSize,
      dotScale * nSize
    );
  }

  private static _drawAlignProtector(
    canvasContext: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    nSize: number
  ) {
    canvasContext.clearRect((centerX - 2) * nSize, (centerY - 2) * nSize, 5 * nSize, 5 * nSize);
    canvasContext.fillRect((centerX - 2) * nSize, (centerY - 2) * nSize, 5 * nSize, 5 * nSize);
  }

  private static _drawAlign(
    canvasContext: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    nSize: number,
    xyOffset: number = 0,
    dotScale: number = 1,
    colorDark: string,
    hasProtector: boolean
  ) {
    const oldFillStyle = canvasContext.fillStyle;
    canvasContext.fillStyle = colorDark;
    new Array(4).fill(0).map((_, i) => {
      AwesomeQR._drawDot(canvasContext, centerX - 2 + i, centerY - 2, nSize, xyOffset, dotScale);
      AwesomeQR._drawDot(canvasContext, centerX + 2, centerY - 2 + i, nSize, xyOffset, dotScale);
      AwesomeQR._drawDot(canvasContext, centerX + 2 - i, centerY + 2, nSize, xyOffset, dotScale);
      AwesomeQR._drawDot(canvasContext, centerX - 2, centerY + 2 - i, nSize, xyOffset, dotScale);
    });
    AwesomeQR._drawDot(canvasContext, centerX, centerY, nSize, xyOffset, dotScale);
    if (!hasProtector) {
      canvasContext.fillStyle = "rgba(255, 255, 255, 0.6)";
      new Array(2).fill(0).map((_, i) => {
        AwesomeQR._drawDot(canvasContext, centerX - 1 + i, centerY - 1, nSize, xyOffset, dotScale);
        AwesomeQR._drawDot(canvasContext, centerX + 1, centerY - 1 + i, nSize, xyOffset, dotScale);
        AwesomeQR._drawDot(canvasContext, centerX + 1 - i, centerY + 1, nSize, xyOffset, dotScale);
        AwesomeQR._drawDot(canvasContext, centerX - 1, centerY + 1 - i, nSize, xyOffset, dotScale);
      });
    }
    canvasContext.fillStyle = oldFillStyle;
  }

  private async _draw(): Promise<string | undefined> {
    const nCount = this.qrCode?.moduleCount!;
    const rawSize = this.options.size!;
    let rawMargin = this.options.margin!;

    if (rawMargin < 0 || rawMargin * 2 >= rawSize) {
      rawMargin = 0;
    }

    const margin = Math.ceil(rawMargin);
    const rawViewportSize = rawSize - 2 * rawMargin;

    const whiteMargin = this.options.whiteMargin!;
    const backgroundDimming = this.options.backgroundDimming!;
    const nSize = getRoundNum(rawViewportSize / nCount, 1)
    const viewportSize = nSize * nCount;
    let size = getRoundNum(viewportSize + 2 * margin, 1);

    // console.log({ rawViewportSize, size, correctLevel: this.options.correctLevel, nCount })
    // const mainCanvas = new Canvas(size, size);
    const mainCanvas = this.options.canvasContainer!.qrMainContainer;
    const mainCanvasContext = mainCanvas.getContext("2d");

    this._clear();

    // Translate to make the top and left margins off the viewport
    mainCanvasContext.save();
    mainCanvasContext.translate(margin, margin);

    // const backgroundCanvas = new Canvas(size, size);
    const backgroundCanvas = this.options.canvasContainer!.qrBgContainer;
    const backgroundCanvasContext = backgroundCanvas.getContext("2d");
    if (!!this.options.backgroundImage) {
      const backgroundImage = await loadImage(backgroundCanvas, this.options.backgroundImage!);

      backgroundCanvasContext.drawImage(
        backgroundImage,
        0,
        0,
        backgroundImage.width,
        backgroundImage.height,
        0,
        0,
        size,
        size
      );
      if (this.options.autoColor) {
        const avgRGB = AwesomeQR._getAverageRGB(backgroundImage, this.options);
        this.options.colorDark = `rgb(${avgRGB.r},${avgRGB.g},${avgRGB.b})`;
      }
      backgroundCanvasContext.rect(0, 0, size, size);
      backgroundCanvasContext.fillStyle = backgroundDimming;
      backgroundCanvasContext.fill();
    } else {
      backgroundCanvasContext.rect(0, 0, size, size);
      backgroundCanvasContext.fillStyle = this.options.colorLight!;
      backgroundCanvasContext.fill();
    }
    const alignmentPatternCenters = QRUtil.getPatternPosition(this.qrCode!.typeNumber);
    const dataScale = this.options.components?.data?.scale || defaultScale;
    const dataXyOffset = (1 - dataScale) * 0.5;
    console.log(dataXyOffset);

    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        const bIsDark = this.qrCode!.isDark(row, col);
        const isBlkPosCtr = (col < 8 && (row < 8 || row >= nCount - 8)) || (col >= nCount - 8 && row < 8);
        const isTiming = (row == 6 && col >= 8 && col <= nCount - 8) || (col == 6 && row >= 8 && row <= nCount - 8);
        let isProtected = isBlkPosCtr || isTiming;

        for (let i = 1; i < alignmentPatternCenters.length - 1; i++) {
          isProtected =
            isProtected ||
            (row >= alignmentPatternCenters[i] - 2 &&
              row <= alignmentPatternCenters[i] + 2 &&
              col >= alignmentPatternCenters[i] - 2 &&
              col <= alignmentPatternCenters[i] + 2);
        }

        const nLeft = col * nSize + (isProtected ? 0 : dataXyOffset * nSize);
        const nTop = row * nSize + (isProtected ? 0 : dataXyOffset * nSize);
        mainCanvasContext.strokeStyle = bIsDark ? this.options.colorDark! : this.options.colorLight!;
        mainCanvasContext.lineWidth = 0.5;
        mainCanvasContext.fillStyle = bIsDark ? this.options.colorDark! : "rgba(255, 255, 255, 0.6)";
        if (alignmentPatternCenters.length === 0) {
          if (!isProtected) {
            mainCanvasContext.fillRect(
              nLeft,
              nTop,
              (isProtected ? (isBlkPosCtr ? 1 : 1) : dataScale) * nSize,
              (isProtected ? (isBlkPosCtr ? 1 : 1) : dataScale) * nSize
            );
          }
        } else {
          const inAgnRange = col < nCount - 4 && col >= nCount - 4 - 5 && row < nCount - 4 && row >= nCount - 4 - 5;
          if (!isProtected && !inAgnRange) {
            // if align pattern list is empty, then it means that we don't need to leave room for the align patterns
            mainCanvasContext.fillRect(
              nLeft,
              nTop,
              (isProtected ? (isBlkPosCtr ? 1 : 1) : dataScale) * nSize,
              (isProtected ? (isBlkPosCtr ? 1 : 1) : dataScale) * nSize
            );
          }
        }
      }
    }

    const cornerAlignmentCenter = alignmentPatternCenters[alignmentPatternCenters.length - 1];

    // - PROTECTORS
    const protectorStyle = "rgba(255, 255, 255, 0.6)";

    // - FINDER PROTECTORS
    mainCanvasContext.fillStyle = protectorStyle;
    mainCanvasContext.fillRect(0, 0, 8 * nSize, 8 * nSize);
    mainCanvasContext.fillRect(0, (nCount - 8) * nSize, 8 * nSize, 8 * nSize);
    mainCanvasContext.fillRect((nCount - 8) * nSize, 0, 8 * nSize, 8 * nSize);
    // - TIMING PROTECTORS
    if (this.options.components?.timing?.protectors) {
      mainCanvasContext.fillRect(8 * nSize, 6 * nSize, (nCount - 8 - 8) * nSize, nSize);
      mainCanvasContext.fillRect(6 * nSize, 8 * nSize, nSize, (nCount - 8 - 8) * nSize);
    }

    // - CORNER ALIGNMENT PROTECTORS
    if (this.options.components?.cornerAlignment?.protectors) {
      AwesomeQR._drawAlignProtector(mainCanvasContext, cornerAlignmentCenter, cornerAlignmentCenter, nSize);
    }

    // - ALIGNMENT PROTECTORS
    if (this.options.components?.alignment?.protectors) {
      for (let i = 0; i < alignmentPatternCenters.length; i++) {
        for (let j = 0; j < alignmentPatternCenters.length; j++) {
          const agnX = alignmentPatternCenters[j];
          const agnY = alignmentPatternCenters[i];
          if (agnX === 6 && (agnY === 6 || agnY === cornerAlignmentCenter)) {
            continue;
          } else if (agnY === 6 && (agnX === 6 || agnX === cornerAlignmentCenter)) {
            continue;
          } else if (agnX === cornerAlignmentCenter && agnY === cornerAlignmentCenter) {
            continue;
          } else {
            AwesomeQR._drawAlignProtector(mainCanvasContext, agnX, agnY, nSize);
          }
        }
      }
    }

    // - FINDER
    mainCanvasContext.fillStyle = this.options.colorDark!;
    mainCanvasContext.fillRect(0, 0, 7 * nSize, nSize);
    mainCanvasContext.fillRect((nCount - 7) * nSize, 0, 7 * nSize, nSize);
    mainCanvasContext.fillRect(0, 6 * nSize, 7 * nSize, nSize);
    mainCanvasContext.fillRect((nCount - 7) * nSize, 6 * nSize, 7 * nSize, nSize);
    mainCanvasContext.fillRect(0, (nCount - 7) * nSize, 7 * nSize, nSize);
    mainCanvasContext.fillRect(0, (nCount - 7 + 6) * nSize, 7 * nSize, nSize);
    mainCanvasContext.fillRect(0, 0, nSize, 7 * nSize);
    mainCanvasContext.fillRect(6 * nSize, 0, nSize, 7 * nSize);
    mainCanvasContext.fillRect((nCount - 7) * nSize, 0, nSize, 7 * nSize);
    mainCanvasContext.fillRect((nCount - 7 + 6) * nSize, 0, nSize, 7 * nSize);
    mainCanvasContext.fillRect(0, (nCount - 7) * nSize, nSize, 7 * nSize);
    mainCanvasContext.fillRect(6 * nSize, (nCount - 7) * nSize, nSize, 7 * nSize);

    mainCanvasContext.fillRect(2 * nSize, 2 * nSize, 3 * nSize, 3 * nSize);
    mainCanvasContext.fillRect((nCount - 7 + 2) * nSize, 2 * nSize, 3 * nSize, 3 * nSize);
    mainCanvasContext.fillRect(2 * nSize, (nCount - 7 + 2) * nSize, 3 * nSize, 3 * nSize);

    // - TIMING
    const timingScale = this.options.components?.timing?.scale || defaultScale;
    const timingXyOffset = (1 - timingScale) * 0.5;
    for (let i = 0; i < nCount - 8; i += 2) {
      AwesomeQR._drawDot(mainCanvasContext, 8 + i, 6, nSize, timingXyOffset, timingScale);
      AwesomeQR._drawDot(mainCanvasContext, 6, 8 + i, nSize, timingXyOffset, timingScale);
    }

    // - CORNER ALIGNMENT PROTECTORS
    const cornerAlignmentScale = this.options.components?.cornerAlignment?.scale || defaultScale;
    const cornerAlignmentXyOffset = (1 - cornerAlignmentScale) * 0.5;
    AwesomeQR._drawAlign(
      mainCanvasContext,
      cornerAlignmentCenter,
      cornerAlignmentCenter,
      nSize,
      cornerAlignmentXyOffset,
      cornerAlignmentScale,
      this.options.colorDark!,
      this.options.components?.cornerAlignment?.protectors || false
    );

    // - ALIGNEMNT
    const alignmentScale = this.options.components?.alignment?.scale || defaultScale;
    const alignmentXyOffset = (1 - alignmentScale) * 0.5;
    for (let i = 0; i < alignmentPatternCenters.length; i++) {
      for (let j = 0; j < alignmentPatternCenters.length; j++) {
        const agnX = alignmentPatternCenters[j];
        const agnY = alignmentPatternCenters[i];
        if (agnX === 6 && (agnY === 6 || agnY === cornerAlignmentCenter)) {
          continue;
        } else if (agnY === 6 && (agnX === 6 || agnX === cornerAlignmentCenter)) {
          continue;
        } else if (agnX === cornerAlignmentCenter && agnY === cornerAlignmentCenter) {
          continue;
        } else {
          AwesomeQR._drawAlign(
            mainCanvasContext,
            agnX,
            agnY,
            nSize,
            alignmentXyOffset,
            alignmentScale,
            this.options.colorDark!,
            this.options.components?.alignment?.protectors || false
          );
        }
      }
    }

    // Fill the margin
    if (whiteMargin) {
      mainCanvasContext.fillStyle = "#FFFFFF";
      mainCanvasContext.fillRect(-margin, -margin, size, margin);
      mainCanvasContext.fillRect(-margin, viewportSize, size, margin);
      mainCanvasContext.fillRect(viewportSize, -margin, margin, size);
      mainCanvasContext.fillRect(-margin, -margin, margin, size);
    }
    mainCanvasContext.lineTo(1, 1, 10, 10)

    if (!!this.options.logoImage) {
      const logoImage = await loadImage(mainCanvas, this.options.logoImage!);

      let logoScale = this.options.logoScale!;
      let logoMargin = this.options.logoMargin!;
      let logoCornerRadius = this.options.logoCornerRadius!;
      if (logoScale <= 0 || logoScale >= 1.0) {
        logoScale = 0.2;
      }
      if (logoMargin < 0) {
        logoMargin = 0;
      }
      if (logoCornerRadius < 0) {
        logoCornerRadius = 0;
      }

      const logoSize = viewportSize * logoScale;
      const x = 0.5 * (size - logoSize);
      const y = x;
      // Restore the canvas
      // After restoring, the top and left margins should be taken into account
      mainCanvasContext.restore();

      // Clean the area that the logo covers (including margins)
      mainCanvasContext.fillStyle = "#FFFFFF";
      mainCanvasContext.save();
      AwesomeQR._prepareRoundedCornerClip(
        mainCanvasContext,
        x - logoMargin,
        y - logoMargin,
        logoSize + 2 * logoMargin,
        logoSize + 2 * logoMargin,
        logoCornerRadius + logoMargin
      );

      mainCanvasContext.clip();
      const oldGlobalCompositeOperation = mainCanvasContext.globalCompositeOperation;
      mainCanvasContext.globalCompositeOperation = "destination-out";
      mainCanvasContext.fill();
      mainCanvasContext.globalCompositeOperation = oldGlobalCompositeOperation;
      mainCanvasContext.restore();

      // Draw logo image
      mainCanvasContext.save();
      AwesomeQR._prepareRoundedCornerClip(mainCanvasContext, x, y, logoSize, logoSize, logoCornerRadius);
      mainCanvasContext.clip();
      mainCanvasContext.drawImage(logoImage, x, y, logoSize, logoSize);
      mainCanvasContext.restore();

      // Re-translate the canvas to translate the top and left margins into invisible area
      mainCanvasContext.save();
      mainCanvasContext.translate(margin, margin);
    }
    console.log(size, rawSize, margin);
    // return

    // console.log(mainCanvas.getContext("2d").canvas)

    // Swap and merge the foreground and the background
    backgroundCanvasContext.drawImage(mainCanvas.getContext("2d").canvas, 0, 0, size, size);
    mainCanvasContext.drawImage(backgroundCanvas.getContext("2d").canvas, -margin, -margin, size, size);

    // Scale the final image
    // const outCanvas = new Canvas(rawSize, rawSize); //document.createElement("canvas");
    // const outCanvas = this.options.canvasContainer!.qrOutContainer
    // const outCanvasContext = outCanvas.getContext("2d");

    // outCanvasContext.drawImage(mainCanvas.getContext("2d").canvas, 0, 0, rawSize, rawSize);
    // resetCanvasHeighAndWidth(mainCanvas,size,1)
    this.canvas = mainCanvas;
    return new Promise((reslove, reject) => {
      wx.canvasToTempFilePath({
        canvas: this.canvas,
        quality: 1,
        destWidth: this.canvas.width,
        destHeight: this.canvas.height
      }).then(rsp => {
        reslove(rsp.tempFilePath)
      }).catch(err => {
        console.error('canvasToTempFilePath 失败', err);
        reject(err)
      })
    })


    // Promise.resolve(this.canvas.toDataURL(format, 1));
  }
}
