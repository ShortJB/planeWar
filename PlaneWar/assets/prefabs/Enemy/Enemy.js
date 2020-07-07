cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {
     //获取碰撞检测系统
     var manager = cc.director.getCollisionManager();
     //默认碰撞检测系统是禁用的，需要手动开启碰撞检测系统
     manager.enabled = true;
     //开启debugDraw后可在显示碰撞区域
     //manager.enabledDebugDraw = true;
});

cc.Class({
    extends: cc.Component,

    properties: {
        maxHP: {
            type: cc.Integer,
            default: 0,
            notify() {
                this._updateHpBar();
            }
        },

        _hp: 0,
        hp: {
            type: cc.Integer,
            get() {
                return this._hp;
            },

            set(value) {
                this._hp = Math.max(value, 0);
                this._updateHpBar();
                if (this._hp === 0) {
                    this._playDestroy();
                }
            }
        },
    },

    start() {
        this._collider = this.node.getComponent(cc.Collider);
    },

    _updateHpBar() {
        let hpBar = this.node.getChildByName('hpBar');
        let progressBar = hpBar.getComponent(cc.ProgressBar);
        progressBar.progress = this._hp / this.maxHP;
    },

    _playDestroy() {
        //this.node.stopAllActions();
        this._collider.enabled = false;
        let fadeOut = cc.fadeOut(0.5);
        let scaleTo = cc.scaleTo(0.3, 0.1);
        let spawn = cc.spawn(fadeOut, scaleTo);
        let remove = cc.removeSelf();
        this.node.runAction(cc.sequence(spawn, remove));
    },
});
