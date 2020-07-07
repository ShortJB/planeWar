
const RADIAN = Math.PI / 180;

cc.Class({
    extends: cc.Component,

    properties: {
        prefab: cc.Prefab,
        rate: 1,        //发射间隔
        speed: 1000,    //移动速度
        offset: cc.v2(0, 0),
        rotation: 0,
        spin: 0,
    },

    start() {
        this.schedule(this._emmitNode, this.rate);
    },

    _emmitNode() {
        //创建子弹
        let node = cc.instantiate(this.prefab);
        node.position = this.offset.add(this.node.position);
        node.parent = this.node.parent;
        node.rotation = this.rotation;
        
        //计算终点
        let endPoint = cc.v2();
        endPoint.x = cc.winSize.height * Math.sin(this.rotation * RADIAN);
        endPoint.y = cc.winSize.height * Math.cos(this.rotation * RADIAN);
        
        //计算飞行持续时间
        let distance = endPoint.sub(node.position).mag();
        let duration = distance / this.speed;

        //运行动作
        let moveBy = cc.moveBy(duration, endPoint);
        let removeSelf = cc.removeSelf();
        let sequence = cc.sequence(moveBy, removeSelf);
        node.runAction(sequence);
    },

    update(dt) {
        if (this.spin === 0) {
            return;
        }
        this.rotation += dt * this.spin;
    }
});
