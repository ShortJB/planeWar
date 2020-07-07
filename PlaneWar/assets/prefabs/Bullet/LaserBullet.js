let Bullet = require('Bullet');

cc.Class({
    extends: Bullet,

    properties: {
    },

    start() {
        this._collider = this.node.getComponent(cc.Collider);
        this._image = this.node.getChildByName('image');

        let fadeTo1 = cc.fadeTo(1, 50);
        let fadeTo2 = cc.fadeTo(1, 255);
        let sequence = cc.sequence(fadeTo1, fadeTo2).repeatForever();
        this._image.runAction(sequence);
    },

    _setContentLength(length) {
        this._image.height = length;
        this._collider.offset.y = length / 2; 
        this._collider.size.height = length;
        this.node.height = length;
        cc.log(length);
    },

    onCollisionStay(other, self) {
        let enemy = other.getComponent('Enemy');
        if (enemy) {
            this._startDamage(enemy);    
        }
    },

    onCollisionExit(other, self) {
        if (this._target && other.node === this._target.node) {
            this._target = null;
        }
    },

    update(dt) {
        if (this._target && this._target.isValid && this._target.hp > 0) {
            let collider = this._target.getComponent(cc.Collider);
            let rect = collider.world.aabb;
            let point = this.node.parent.convertToNodeSpaceAR(cc.v2(rect.x + rect.width / 2, rect.y));
            this._setContentLength(Math.abs(point.y));
            this._updateDamage(dt);
        } else {
            let height = (cc.winSize.height / 2) - this.node.parent.y;
            this._setContentLength(height);
        }
    },

    _startDamage(target) {
        if (this._target && target.node.y >= this._target.node.y) {
            return;
        }
        
        this._target = target;
        this._dt = 0;
    },

    _updateDamage(dt) {
        if (!this._target || !this._target.isValid) {
            return;
        }

        this._dt += dt;
        //每秒伤害
        let damage = this.damage * this._dt;
        if (damage > 1) {
            this._dt = 0;
            let hp = this._target.hp - Math.floor(damage);
            this._target.hp = hp;
            if (hp <= 0) {
                this._target = null;
                this.unschedule(this._updateDamage);
            }
        }
    },

    
});
