const RADIAN = Math.PI / 180;

var enemyTemp = {};
var posTemp = cc.v2();
var distanceTemp = 0;

/**
 * @description 追踪子弹
 * 1.子弹发射时需要寻找目标，子弹默认会寻找离自己最近的，并且不满足4.1和4.2条件的目标。
 * 2.子弹如果没有找到目标的情况下发射出去了，则按照初始速度飞行。
 * 3.子弹在运动过程中如果失去目标，则按照当前速度飞行。
 * 4.子弹一旦锁定目标，就会一直追踪打击目标，直到击中目标或者当目标满足下面条件时放弃并重新寻找目标：
 * 4.1 目标离开屏幕范围
 * 4.2 子弹与目标之间的夹角大于135度角度
 */

cc.Class({
    extends: cc.Component,

    properties: {
        bulletSpeed: {
            type: cc.Integer,
            default: 0
        },

        damage: {
            type: cc.Integer,
            default: 0
        }
    },

    onLoad() {
        this.reset();
    },

    reset() {
        /** 是否已经死亡 */
        this.isDie_ = false;
        /** 是否已经有追踪目标 */
        this.ishadTarget_ = false;
        /** 追踪目标 */
        this.target_ = undefined;
        /** 切换子弹图片 0：正常 1：爆炸 */
        this.set_bullet_frame(0);
    },

    update: function (dt) {
        // 在销毁中
        if (this.isDie_) { return; }

        // 子弹是添加到foreground节点
        let scene_rect = this.node.parent.getBoundingBox();
        if (!scene_rect.contains(this.node.position)) {// 飞出屏幕了
            this.hitTheTarget();
            return;
        }

        // 如果当前追踪目标无效，寻找下一追踪目标
        if (this.ishadTarget_) {// 已有目标
            if (this.isValidNode(this.target_)) { // 目标有效
                if (!this.filter(this.target_)) {
                    // 下一个目标
                    this.ishadTarget_ = false;
                }
            } else { // 追踪目标已销毁
                this.ishadTarget_ = false;
            }
        }

        // 当前目标
        let target_node = this.ishadTarget_ ? this.target_ : this.get_target();
        let targetPos = cc.v2();

        if (!this.isValidNode(target_node)) {// 失去追踪目标
            //以当前的方向移动
            let sideLength = cc.winSize.height;
            let pos = this.node.position;
            let angle = -this.node.angle / 180 * Math.PI;
            targetPos = cc.v2(pos.x + sideLength * Math.sin(angle), pos.y + sideLength * Math.cos(angle)); // endx = x + sin()
        } else {
            targetPos = this.target_.position;
        }

        let bulletPos = this.node.position;
        //单位化向量
        let normalizeVec = targetPos.subtract(bulletPos).normalizeSelf();

        this.node.x += normalizeVec.x * this.bulletSpeed * dt;
        this.node.y += normalizeVec.y * this.bulletSpeed * dt;
        // 角度变化以y轴正方向为起点，逆时针角度递增 
        // 360° = 2Π弧度  
        // 1弧度 = 360°/ 2Π = 180°/Π = 180 / Math.PI
        // Π = Math.PI
        //根据朝向计算出夹角弧度
        this.node.angle = cc.v2(0, 1).signAngle(normalizeVec) * 180 / Math.PI;
        if (this.isValidNode(target_node)) {
            let rect = target_node.getBoundingBox();
            if (rect.contains(this.node.position)) {
                let enemy = target_node.getComponent('Enemy');
                if (enemy) {
                    this._startDamage(enemy);
                }
            }
        }
    },

    /**
     * 销毁子弹
     */
    hitTheTarget() {
        this.isDie_ = true;
        // 爆炸图片
        this.set_bullet_frame(1);
        this.scheduleOnce(() => {
            this.reset();
            fn.PoolManager.Instance.put_node(this.node)
        }, 0.2);
    },

    /**
     * 获取追踪目标
     * @returns {cc.Node | undefined}
     */
    get_target() {
        // 所有的敌机
        enemyTemp = fn.EnemyManager.Instance.getEnemys();
        let pos = this.node.position;
        let distance = Number.MAX_SAFE_INTEGER;
        let target_node = undefined;
        // 距离最短的
        for (let key in enemyTemp) {
            /**@type {cc.Node} */
            let target = enemyTemp[key];
            //let enemy = node.getComponent("Enemy");
            posTemp = target.position;
            // 不符合追踪条件
            if (!this.filter(target) || !this.isValidNode(target)) {
                continue;
            }

            // 寻找最近的目标
            distanceTemp = posTemp.sub(pos).mag()
            if (distance >= distanceTemp) {
                distance = distanceTemp;
                target_node = target;
            }
        }

        if (target_node) {
            this.ishadTarget_ = true;
        }
        this.target_ = target_node;

        return target_node;
    },

    /**
     * 子弹伤害
     * @param {} target 
     */
    _startDamage(target) {
        if (target.hp) {
            target.hp -= this.damage;
        }
        //子弹爆炸
        this.hitTheTarget();
        //this.node.destroy();
    },

    /** 
     * 敌机节点是否有效 
     * @returns {boolean}
     * */
    isValidNode(node) {
        if (node && node.isValid) {
            let enemy = node ? node.getComponent("Enemy") : undefined;
            if (enemy && !enemy.get_die()) {
                return true;
            }
        }
        return false;
    },

    /**
     * 不符合追踪条件
     * 1. 屏幕外
     * 2. 夹角大于90度的
     */
    filter(target) {
        let target_pos = target.position;
        // 屏幕外
        let offset = cc.v2(40, 40); // 飞出屏幕外40
        if (Math.abs(target_pos.y) > (cc.winSize.height / 2 + offset.x) || Math.abs(target_pos.x) > (cc.winSize.width / 2 + offset.y)) {
            return false;
        }

        // 夹角大于90度的
        let bulletPos = this.node.position;
        let normalizeVec = target_pos.subtract(bulletPos).normalizeSelf();
        let angle = cc.v2(0, 1).signAngle(normalizeVec) * 180 / Math.PI;
        if (Math.abs(angle) > 135) {
            return false;
        }

        return true;
    },

    /**
     * 设置子弹图片(0：正常 1：爆炸)
     * @param {boolean} value 
     */
    set_bullet_frame(value) {
        let sprite_node = this.node.getChildByName("image");
        let spriteEx = sprite_node.getComponent("SpriteEx");
        if (spriteEx) {
            spriteEx.index = value;
        }
    },
});
