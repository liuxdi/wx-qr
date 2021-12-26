import { AwesomeQR, Options } from "./lib/index";
import { qrTypes } from "./type";
import { COMPONENT_NAME, DEFAULT_SIZE, getPxFromRpx, resetCanvasHeighAndWidth } from "./util";

function toBoolean(data: any) {
    return Boolean(data)
}

Component({
    properties: qrTypes,
    data: {
        imgSrc: "",
        canvasSize: DEFAULT_SIZE
    },
    observers: {
        size(newVal) {
            let size = newVal;
            if (typeof newVal === 'number') {
                size = newVal + 'rpx';
            }
            this.setData({
                canvasSize: size
            })
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
        getCanvasAndContext(size: number): Promise<WechatMiniprogram.Canvas[]> {
            return new Promise((reslove, reject) => {
                try {
                    const query = this.createSelectorQuery();
                    query.selectAll('.qr-canvas').fields({ node: true, size: true, id: true }).exec(res => {
                        const canvasList = res[0].map(((item: { node: WechatMiniprogram.Canvas; }) => {
                            const canvas: WechatMiniprogram.Canvas = resetCanvasHeighAndWidth(item.node, size);
                            return canvas
                        }))
                        reslove(canvasList)
                    })
                } catch (error) {
                    console.error(`${COMPONENT_NAME} 组件获取canvas时报错`, error)
                    reject(error)
                }
            })
        },
        async render(): Promise<void> {
            const {
                text,
                size,
                margin,
                colorDark,
                colorLight,
                maskPattern,
                backgroundDimming,
                logoScale,
                correctLevel,
                logoMargin,
                logoCornerRadius,
                dotScale,
                bgSrc,
                logoSrc,
                whiteMargin,
                autoColor,
                components,
                version
            } = this.data;
            let reg = new RegExp(/\d+(px|rpx)$/g);
            if (!reg.test(size)) {
                console.error('传入的数值非px或rpx，默认按rpx进行处理')
            }
            let pxSize = Number(size.replace(/px|rpx/g, ''));
            if (size.endsWith('rpx')) {
                pxSize = getPxFromRpx(pxSize)
            }
            // console.log('aaaaa',maskPattern);

            const [qrMainContainer] = await this.getCanvasAndContext(pxSize);
            let option: Options = {
                text: text,
                size: pxSize,
                margin: margin,
                correctLevel: correctLevel,
                maskPattern,
                version,
                components: components,
                colorDark: colorDark,
                colorLight: colorLight,
                autoColor: toBoolean(autoColor),
                backgroundImage: bgSrc,
                backgroundDimming: backgroundDimming,
                whiteMargin: toBoolean(whiteMargin),
                logoImage: logoSrc,
                logoScale: logoScale,
                logoMargin: logoMargin,
                logoCornerRadius: logoCornerRadius,
                dotScale: dotScale,
                canvasContainer: { qrMainContainer },
            };
            if (!this.data.qrDraw) {
                this.data.qrDraw = new AwesomeQR(option);
            } else {
                this.data.qrDraw.setOptions(option);
            }
            this._draw();

        },

        // 获取生成二维码的临时文件
        getQrFile() {
            return this.data.imgSrc
        },
        // 获取生成二维码的base64
        getQrData() {
            // todo
            return null
        },
        saveImg() {
            wx.saveFile({
                tempFilePath: this.data.imgSrc
            }).then(rsp => {
                console.log(rsp);

            }).catch(err => {
                console.log(err);

            })
        },
        _draw() {
            this.data.qrDraw.draw().then((rsp: string) => {
                console.log(rsp)
                this.setData({
                    imgSrc: rsp
                })
            }).catch((err: any) => {
                console.log(err);

            })
        }
    }
})
