const host = window.location.host
export let API = 'https://www.gc09fvmowuhksl.com/'
if (host == 'pc.gc.com' || host == 'gc.pc.com' || host == 'wang.gch5.com' || host == 'wang.gch5.com:5000') {
    API = 'http://www.gc360.com/'
} else if (host == 'sc.pc.com' || host == 'pc.sc.com' || host == 'pc.sc.com:5001' || host == 'sc.h5.dev:5000') {
    API = 'http://www.sc360.com/'
} else if (host == 'pc.sc.com') {
    API = 'http://www.sc360.com/'
} else if (host == 'pc.guocaiapi.com' || host == '803645.com') {
    API = 'http://xjpuserapigctest.guocaiapi.com/'
} else {
    API = 'https://www.gc09fvmowuhksl.com/'
}

export const IMG_ROOT = __DEV__ ? 'src/assets/' : './'

export const STATIC_ROOT = '' //__DEV__ ? 'http://localhost:5000' : 'http://www.guocai.com'
