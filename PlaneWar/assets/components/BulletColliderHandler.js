


cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    start () {
        //获取碰撞检测系统
        var manager = cc.director.getCollisionManager();
        //默认碰撞检测系统是禁用的，需要手动开启碰撞检测系统
        manager.enabled = true;
        //开启debugDraw后可在显示碰撞区域
        manager.enabledDebugDraw = true;
    },

    onCollisionEnter(other, self) {
        cc.log(other.name);
    },
});
