import type { ComponentOptions } from '../../wx-qr/lib/awesome-qr';
const options: ComponentOptions = {
  data: {
    scale: 0.3
  },
  // timing: {
  //   scale: 0.2,
  //   protectors: true
  // },
  // alignment: {
  //   scale: 0.2
  // },
  // cornerAlignment: {
  //   scale: 0.2
  // }
}
Component({
  data: {
    ComponentOptions: options
  },
  methods: {
  }
})
