import angular from 'angular'
import moment from 'moment'

export default function (
  $scope,
  $rootScope,
  $location,
  Core,
  $stateParams,
  $timeout,
  Util,
  Layer
) {
  Layer.loading()
  $scope.TMP = $rootScope.TPL_ROOT + 'trend_detail/' + $stateParams.type + '_detail.tpl.html'

  $scope.gid = $stateParams.gid
  $scope.type = $stateParams.type

  $scope.tagTab = 0
  $scope.tags = [
    {name: '最近20期', value: '20'},
    {name: '最近30期', value: '30'},
    {name: '最近50期', value: '50'}
    // {name: '最近100期', value: '100'}
  ]

  Core.get('activity/game_trend/get_game_trend_list?gid=' + $scope.gid, function (json) {
      const c = angular.fromJson(json)
      if (c.code == 200) {
          $scope.rows = c.data.rows
          $scope.initRowData($stateParams.type)
          $scope.chooseData($scope.tagTab)
      }
  }, false)

  $scope.chooseData = function(tagTab) {
    $scope.tagTab = tagTab
    const _idx = $scope.tags[tagTab].value
    if(!isNaN(_idx)) {
      $scope.data = $scope.rows.slice(-_idx)
      $stateParams.type != 'lhc' && $scope.doDraw('redraw', _idx)
      if($stateParams.type == 'lhc') {
        Util.clearDraw()
        $scope.lhcData = $scope.lhcData.slice(-_idx)
      }
      $timeout(function() {
        Layer.closeLoading()
      }, 500)
    } else {
      const _today = moment().format('YYYY-MM-DD')
      const _yeday = moment().subtract(1, 'day').format('YYYY-MM-DD')
      const _ybday = moment().subtract(2, 'day').format('YYYY-MM-DD')
      let _date = ''
      if(_idx == 't') {
        _date = _today
      }
      if(_idx == 'y') {
        _date = _yeday
      }
      if(_idx == 'by') {
        _date = _ybday
      }
      $scope.data = $scope.rows.filter((e) => {
        return _date == moment(e.open_time).format('YYYY-MM-DD')
      })
      $stateParams.type != 'lhc' && $scope.doDraw('redraw', $scope.data.length)
      $stateParams.type == 'lhc' && Util.clearDraw()
      Layer.closeLoading()
    }
  }

  //第一位代表万千百等等
  //第二位代表万位百位有多少数字等
  $scope.dataConfig = {
    ssc: [5, 10],
    s_ssc: [5, 10],
    k3: [3, 6],
    s_k3: [3, 6],
    '11x5': [5, 11],
    's_11x5': [5, 11],
    yb: [3, 10],
    s_yb: [3, 10],
    pk10: [10, 10],
    s_pk10: [10, 10],
    pcdd: [3, 10],
    s_kl10: [8, 20]
  }

  $scope.initRowData = function(type) {
    if(type!= 'lhc') {
      $scope.createRowData(...$scope.dataConfig[type], type)
      $scope.handleLastData(...$scope.dataConfig[$stateParams.type])
    } else {
      $scope.handleLhc()
    }
  }

  $scope.handleLhc = function() {
    let _data = $scope.rows
    const calSum = function(str) {
      return str.split(',').reduce((a, b) => {return Number(a) + Number(b)})
    }
    const calSumBig = function(number) {
      return number > 174 ? '大' : '小'
    }
    const calDan = function(number) {
      return number % 2 == 0 ? '双' : '单'
    }
    const calSpecialWeiBig = function(number) {
      return number % 10 > 4 ? '尾大' : '尾小'
    }
    const calSpecialBig = function(number) {
      return number > 24 ? '大' : '小'
    }
    const calSepcialSumBig = function(number) {
      return number > 6 ? '和大' : '和小'
    }
    const calBo = function(arr) {
      const _arr = arr.map((el) => {
        return el.sb
      })

      const special = _arr.pop()
      let ret = {}
      let color = ''
      const redLen = _arr.filter((e) => {return e=='red'}).length
      const blueLen = _arr.filter((e) => {return e=='blue'}).length
      const greenLen = _arr.filter((e) => {return e=='green'}).length
      const compare = [
        {color: 'red', len: redLen},
        {color: 'blue', len: blueLen},
        {color: 'green', len: greenLen}
      ].sort(function(a, b) {
        return a.len < b.len
      })

      if(compare[0].len > compare[1].len) {
        color = compare[0].color
      } else if(compare[0].len == compare[1].len ) {
        if(compare[1].len == compare[2].len) {
          color = special
        } else if(special == compare[0].color) {
          color = compare[0].color
        } else if(special == compare[1].color) {
          color = compare[1].color
        } else {
          color = ''
        }
      }
      switch(color) {
        case 'red': ret = {name: '红波', color: 'red'}; break
        case 'blue': ret = {name: '蓝波', color: 'blue'}; break
        case 'green': ret = {name: '绿波', color: 'green'}; break
        default: ret = {name: '和值', color: 'black'}; break
      }
      return ret
    }
    _data.forEach(function(e) {
      e.sum = calSum(e.number)
      e.sumBig = calSumBig(e.sum)
      e.sumDan = calDan(e.sum)
      e.special = e.number_arr.slice(-1)[0].num
      e.special = e.special < 10 ? '0' + e.special : e.special
      e.specialBig = calSpecialBig(e.special)
      e.specialDan = calDan(e.special)
      e.specialWeiBig = calSpecialWeiBig(e.special)
      e.specialSum = e.special.split('').reduce((a, b) => {return Number(a) + Number(b)})
      e.specialSumBig = calSepcialSumBig(e.specialSum)
      e.specialSumDan = calDan(e.specialSum)
      e.bo = calBo(e.number_arr)
    })

    $scope.lhcData = _data
  }

  $scope.createRowData = function(a, b, cptype) {
    let data = $scope.rows.slice()
    const handleData = function(_digitalArr, type, currIdx, prizeNum) {
      _digitalArr.forEach((el, m) => {
        const _IDX = cptype == 'k3' || cptype == 's_k3' || cptype == '11x5' || cptype == 's_11x5' || cptype == 'pk10' || cptype == 's_pk10' || cptype == 's_kl10' ? m + 1 : m
        //竖直方向： 如果上一个为字符串，并且 当前的索引和当前开奖不同，为1
        if(typeof data[currIdx-1][type][m] === 'string' && _IDX != prizeNum) {
          _digitalArr[m] = 1
        } else {
          //如果 当前索引不等于开奖，则上一个的值+1
          if(_IDX != prizeNum) {
            _digitalArr[m] = data[currIdx-1][type][m] + 1
          } else {
            //否则就等于开奖号码
            _digitalArr[m] = prizeNum
          }
        }
      })
    }
    const _IDX1 = cptype == 'k3' || cptype == 's_k3' || cptype == '11x5' || cptype == 's_11x5' || cptype == 'pk10' || cptype == 's_pk10' || cptype == 's_kl10' ? 1 : 0
    data.forEach((e, i) => {
      let colArr = Core.createArr(a)
      colArr.forEach(function(el, j) {
        e['col' + j] = Core.createArrSetVal(b, 1)
        e['col' + j][Number(e.number_arr[j]) - _IDX1] = e.number_arr[j]
        if(i > 0) {
          handleData(e['col' + j], 'col' + j, i, e.number_arr[j])
        }
      })
    })
    $scope.data = data
  }

  $scope.handleLastData = function(m, n) {
    let colsCache = Core.createArrSetVal(1, Util.createArrs( m * n))
    $scope.rows.forEach((el) => {
      let tmp = []
      for(var x in el) {
        if(x.indexOf('col') >= 0) {
          tmp = tmp.concat(el[x])
        }
      }
      tmp.forEach(function(e, y) {
        colsCache[0][y].push(e)
      })
    })

    $scope.loseData = Core.createArrSetVal(1, Util.createArrs( m * n))
    //外层1层循环
    colsCache.forEach(function(el, idx) {
      //内部列循环
      el.forEach(function(elem, cidx) {
        let tmpArr = elem.map((element) => {
          return typeof element === 'string' ? 'X' : element
        }).join('').match(/X+/g)
        tmpArr = tmpArr ? tmpArr.map(function(y) {
          return y.length
        }) : [0]
        const maxChu = Math.max(...tmpArr)
        const avaLoseArr = elem.filter(function(el) {
          return typeof el !== 'string'
        })
        const maxLose = avaLoseArr.length ? Math.max(...avaLoseArr) : 0
        const avaLose = avaLoseArr.length == 0 ? 0 : Math.floor(avaLoseArr.reduce((a, b) => {return a + b}, 0)/avaLoseArr.length)
        $scope.loseData[idx][cidx]={avaLose, maxLose, maxChu}
      })
    })
  }

  $scope.checkType = function(e) {
    return typeof e === 'string'
  }

  $scope.doDraw = function() {
    $timeout(function() {
      const lenConfig = {
        ssc: 5,
        s_ssc: 5,
        k3: 3,
        s_k3: 3,
        '11x5': 5,
        's_11x5': 5,
        yb: 3,
        s_yb: 3,
        pk10: 10,
        s_pk10: 10,
        pcdd: 10,
        s_kl10: 8
      }
      if(lenConfig[$stateParams.type]) {
        Util.drawLines(lenConfig[$stateParams.type])
      } else {
        Util.clearDraw()
      }
    })
  }
}