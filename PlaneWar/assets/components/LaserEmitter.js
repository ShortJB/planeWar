
cc.Class({
    extends: cc.Component,

    properties: {
        prefab: cc.Prefab,
        offset:  cc.v2(0, 0)
    },

    start () {
        let node = cc.instantiate(this.prefab);
        node.position = this.offset;
        node.parent = this.node;
        
    },
});
