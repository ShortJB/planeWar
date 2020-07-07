
cc.Class({
    editor: {
        requireComponent: cc.Camera,
    },
    extends: cc.Component,

    properties: {
        speed: 300,
        loopGrounds: [cc.Node],  
    },

    start () {
        this.camera = this.getComponent(cc.Camera);
        //初始化背景图片位置
        let node = this.loopGrounds[0];
        node.position = cc.v2(0, 0);
        for (let i = 1; i < this.loopGrounds.length; i++) {
            let front = this.loopGrounds[i - 1];
            node = this.loopGrounds[i];
            node.position = cc.v2(0, front.y + (front.height + node.height) / 2);   
        } 
    },

    update(dt) {
        let current = this.loopGrounds[0];
        let offset = (cc.winSize.height - current.height) / 2;     
        if (this.camera.node.y > current.y + current.height + offset) { 
            let last = this.loopGrounds[this.loopGrounds.length - 1];
            this.loopGrounds.shift();
            this.loopGrounds.push(current);
            current.y = last.y + (last.height + current.height) / 2;
        }
        this.node.y += dt * this.speed;
    }
});