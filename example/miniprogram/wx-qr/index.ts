import { AwesomeQR } from "./lib/index";
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
        }
    },
    attached() {
        this.render();
    },
    // : [WechatMiniprogram.Canvas, WechatMiniprogram.CanvasContext] 
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
                backgroundColor,
                backgroundDimming,
                logoScale,
                logoBackgroundColor,
                correctLevel,
                logoMargin,
                logoCornerRadius,
                dotScale,
                bgSrc,
                logoSrc,
                whiteMargin,
                autoColor,
                components
            } = this.data;
            let reg = new RegExp(/\d+(px|rpx)$/g);
            if (!reg.test(size)) {
                console.error('传入的数值非px或rpx，默认按rpx进行处理')
            }
            let pxSize = Number(size.replace(/px|rpx/g, ''));
            if (size.endsWith('rpx')) {
                pxSize = getPxFromRpx(pxSize)
            }
            console.log(dotScale);

            const [qrOutContainer, qrMainContainer, qrBakContainer, qrBgContainer] = await this.getCanvasAndContext(pxSize);
            // console.log(qrMainContainer);
            // const context: WechatMiniprogram.CanvasContext = qrMainContainer.getContext('2d');
            // context.beginPath();
            // context.strokeStyle = "#000000";
            // context.lineWidth = 4;
            // context.lineTo(100, 100);
            // context.lineTo(0, 100);
            // context.lineTo(0, 0);
            // context.fill();
            // context.closePath();
            // context.stroke();

            // wx.canvasToTempFilePath({ canvas: qrMainContainer }).then(rsp => {
            //     console.log(rsp);

            // }).catch(e => {
            //     console.log(e);

            // })

            // return


            new AwesomeQR({
                text: text,
                size: pxSize,
                margin: margin,
                colorDark: colorDark,
                colorLight: colorLight,
                backgroundImage: bgSrc,
                backgroundDimming: backgroundDimming,
                logoImage: logoSrc,
                logoScale: logoScale,
                correctLevel: correctLevel,
                logoMargin: logoMargin,
                logoCornerRadius: logoCornerRadius,
                whiteMargin: toBoolean(whiteMargin),
                dotScale: dotScale,
                autoColor: toBoolean(autoColor),
                components: components,
                canvasContainer: { qrOutContainer, qrMainContainer, qrBakContainer, qrBgContainer }
            }).draw().then(rsp => {
                console.log(rsp)
                this.setData({
                    imgSrc: rsp
                })
            }).catch(err => {
                console.log(err);

            })
        }
    }
})
