import angular from 'angular'
import Clipboard from 'clipboard'
// import $ from 'jQuery'
export default function ($scope, $sce, Core, Layer) {
    Core.get('user/user/agent_show', function (json) {
        const c = angular.fromJson(json)
        if (c.code == 200) {
            $scope.data = c.data
        }
    }, false)
    $scope.agent_copy = function () {
        let clipboard = new Clipboard('.agent-btn-copy')
        clipboard.on('success', function (e) {
            e.clearSelection()
        })
        Layer.alert('链接已复制成功', '温馨提示')
    }
}