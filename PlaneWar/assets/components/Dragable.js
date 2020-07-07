/**
 * 可拖动组件
 */
cc.Class({
    extends: cc.Component,
    properties: {
        target: cc.Node,
    },
    onLoad() {
        //注册TOUCH_MOVE事件
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        cc.log('onload');
    },

    _onTouchMove(touchEvent) {
        //获取触摸移动增量
        let delta = touchEvent.getDelta();
        let node = this.target || this.node;
        //当前节点位置+增量，更新节点位置
        node.position = delta.add(node.position);
    }
});