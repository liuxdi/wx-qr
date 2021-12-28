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
                canvasSize: getRpxFromStringOrNumber(newVal) + "rpx",
            });
        },
        "text,size,margin,colorDark,colorLight,maskPattern,backgroundDimming,logoScale,correctLevel,logoMargin,logoCornerRadius,dotScale,backgroundImage,logoImage,whiteMargin,autoColor,components,version"() {
            this.render();
        },
    },
    lifetimes: {
        attached() {
            // this.render();
        },
        detached() { },
    },
    methods: {
        getCanvasAndContext(size) {
            return new Promise((reslove, reject) => {
                try {
                    const query = this.createSelectorQuery();
                    query
                        .selectAll(".qr-canvas")
                        .fields({ node: true, size: true, id: true })
                        .exec((res) => {
                        const canvasList = res[0].map((item) => {
                            const canvas = resetCanvasHeighAndWidth(item.node, size);
                            return canvas;
                        });
                        reslove(canvasList);
                    });
                }
                catch (error) {
                    console.error(`${COMPONENT_NAME} 组件获取canvas时报错`, error);
                    reject(error);
                }
            });
        },
        async render() {
            const { text, size, margin, colorDark, colorLight, maskPattern, backgroundDimming, logoScale, correctLevel, logoMargin, logoCornerRadius, dotScale, backgroundImage, logoImage, whiteMargin, autoColor, components, version, } = this.data;
            let totalSize = getPxFromStringOrNumber(size);
            this.setData({
                totalSize,
            });
            const [qrMainContainer] = await this.getCanvasAndContext(totalSize);
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
                backgroundImage: backgroundImage,
                backgroundDimming: backgroundDimming,
                whiteMargin: whiteMargin,
                logoImage: logoImage,
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
            if (!text) {
                return;
            }
            this._draw();
        },
        // 获取生成二维码的临时文件
        getQrFile() {
            return this.data.imgSrc;
        },
        // 获取生成二维码的base64
        getQrData(type, encoderOptions) {
            return this.data.qrDraw && this.data.qrDraw.getDataUrl(type, encoderOptions);
        },
        saveImg() {
            wx.saveFile({
                tempFilePath: this.data.imgSrc,
            })
                .then((rsp) => {
                console.log(rsp);
            })
                .catch((err) => {
                console.log(err);
            });
        },
        _draw() {
            this.data.qrDraw
                .draw()
                .then((rsp) => {
                this.setData({
                    imgSrc: rsp,
                });
                this.triggerEvent("load", rsp);
            })
                .catch((err) => {
                this.triggerEvent("error", err);
            });
        },
    },
});
