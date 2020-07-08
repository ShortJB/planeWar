function getRotation(startPoint, endPoint, offset = 0) {
    let x = endPoint.x - startPoint.x;
    let y = endPoint.y - startPoint.y;
    //与Y轴的夹角弧度
    let radian = Math.atan2(x, y);
    let rotation = (180 * radian / Math.PI) % 360 + offset;
    return rotation;
};

let UpdateRotation = cc.Class({
    extends: cc.Component,
    properties: {
        offsetRotation: 0,
    },
    update() {
        if (!this.samplePoint) {
            this.samplePoint = this.node.position;
            return;
        }

        let distance = this.samplePoint.sub(this.node.position).mag();
        if (distance > 10) {
            let rotation = getRotation(this.samplePoint, this.node.position, this.offsetRotation);
            this.samplePoint = this.node.position;
            //this.node.rotation = rotation;
            this.node.angle = - rotation;
        }
    }
});

module.exports = UpdateRotation;