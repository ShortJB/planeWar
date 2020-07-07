
let Bullet = cc.Class({
    extends: cc.Component,
    properties: {
        damage: 1,
    },

    onCollisionEnter(other, self) {
        let enemy = other.getComponent('Enemy');
        if (enemy) {
            this._startDamage(enemy);
        }
    },

    _startDamage(target) {
        if (target.hp) {
            target.hp -= this.damage;
        }
        //子弹爆炸
        this.node.destroy();
    },

    endDamage() {
    },

});

module.exports = Bullet;