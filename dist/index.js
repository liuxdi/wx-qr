var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AwesomeQR } from "./lib/index";
import { qrTypes } from "./type";
import { COMPONENT_NAME, DEFAULT_SIZE, getPxFromStringOrNumber, getRpxFromStringOrNumber, resetCanvasHeighAndWidth } from "./util";
Component({
    properties: qrTypes,
    data: {
        imgSrc: "",
        canvasSize: DEFAULT_SIZE,
    },
    observers: {
        size(newVal) {
            this.setData({
                canvasSize: getRpxFromStringOrNumber(newVal) + 'rpx'
            });
        },
        'text,size,margin,colorDark,colorLight,maskPattern,backgroundDimming,logoScale,correctLevel,logoMargin,logoCornerRadius,dotScale,bgSrc,logoSrc,whiteMargin,autoColor,components,version'() {
            this.render();
        }
    },
    lifetimes: {
        attached() {
            // this.render();
        },
        detached() {
        },
    },
    methods: {
        getCanvasAndContext(size) {
            return new Promise((reslove, reject) => {
                try {
                    const query = this.createSelectorQuery();
                    query.selectAll('.qr-canvas').fields({ node: true, size: true, id: true }).exec(res => {
                        const canvasList = res[0].map(((item) => {
                            const canvas = resetCanvasHeighAndWidth(item.node, size);
                            return canvas;
                        }));
                        reslove(canvasList);
                    });
                }
                catch (error) {
                    console.error(`${COMPONENT_NAME} 组件获取canvas时报错`, error);
                    reject(error);
                }
            });
        },
        render() {
            return __awaiter(this, void 0, void 0, function* () {
                const { text, size, margin, colorDark, colorLight, maskPattern, backgroundDimming, logoScale, correctLevel, logoMargin, logoCornerRadius, dotScale, bgSrc, logoSrc, whiteMargin, autoColor, components, version } = this.data;
                let totalSize = getPxFromStringOrNumber(size);
                this.setData({
                    totalSize
                });
                const [qrMainContainer] = yield this.getCanvasAndContext(totalSize);
                let option = {
                    text: text,
                    size: totalSize,
                    margin: getPxFromStringOrNumber(margin),
                    correctLevel: correctLevel,
                    maskPattern,
                    version,
                    components: components,
                    colorDark: colorDark,
                    colorLight: colorLight,
                    autoColor: autoColor,
                    backgroundImage: bgSrc,
                    backgroundDimming: backgroundDimming,
                    whiteMargin: whiteMargin,
                    logoImage: logoSrc,
                    logoScale: logoScale,
                    logoMargin: getPxFromStringOrNumber(logoMargin),
                    logoCornerRadius: getPxFromStringOrNumber(logoCornerRadius),
                    dotScale: dotScale,
                    canvasContainer: { qrMainContainer },
                };
                if (!this.data.qrDraw) {
                    this.data.qrDraw = new AwesomeQR(option);
                }
                else {
                    this.data.qrDraw.setOptions(option);
                }
                this._draw();
                setTimeout(() => {
                    // option.text += 'aasdsdgwsdgwerqwer';
                    // option.logoMargin=0
                    option.logoCornerRadius = 20;
                    this.data.qrDraw.setOptions(option);
                    this._draw();
                }, 2000);
            });
        },
        // 获取生成二维码的临时文件
        getQrFile() {
            return this.data.imgSrc;
        },
        // 获取生成二维码的base64
        getQrData() {
            // todo
            return null;
        },
        saveImg() {
            wx.saveFile({
                tempFilePath: this.data.imgSrc
            }).then(rsp => {
                console.log(rsp);
            }).catch(err => {
                console.log(err);
            });
        },
        _draw() {
            this.data.qrDraw.draw().then((rsp) => {
                console.log(rsp);
                this.setData({
                    imgSrc: rsp
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    }
});
