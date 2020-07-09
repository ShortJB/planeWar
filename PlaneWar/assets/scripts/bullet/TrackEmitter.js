
cc.Class({
    extends: cc.Component,

    properties: {
        bullet_: {
            type: cc.Prefab,
            default: null,
            displayName: "TrackBullet"
        },

        offset: cc.v2(0, 0),
        rotation: 0,
        rate: 1,
        spin: 0,
    },

    onLoad() {
        this.schedule(this._emmitNode, this.rate);

    },

    _emmitNode() {
        let node = fn.PoolManager.Instance.get_node(this.bullet_);
        node.position = this.offset.add(this.node.position);
        node.parent = this.node.parent;
        node.angle = -this.rotation;
        // let node = cc.instantiate(this.bullet_);
        // node.position = this.offset.add(this.node.position);
        // node.parent = this.node.parent;
        // node.angle = -this.rotation;
    },


    update: function (dt) {
        if (this.spin === 0) {
            return;
        }
        this.rotation += dt * this.spin;
    }



});
