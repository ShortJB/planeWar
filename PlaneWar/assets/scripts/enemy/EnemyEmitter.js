
cc.Class({
    extends: cc.Component,

    properties: {
        parentNode: cc.Node,
        prefab: cc.Prefab,
        clip: cc.AnimationClip,
        rate: 1,
        id: 0,
    },

    start () {
        this.schedule(this._createEnemy, this.rate);
    },

    _createEnemy() {
        let node = cc.instantiate(this.prefab);
        node.parent = this.parentNode;
        let enemy = node.getComponent('Enemy');
        enemy.id = this.id;
        fn.EnemyManager.Instance.addEnemy(node);
        let animation = node.addComponent(cc.Animation);
        animation.addClip(this.clip);
        animation.play(this.clip.name);
        animation.on('finished', () => {
            fn.EnemyManager.Instance.removeEnemy(node);
            node.destroy();    
        });
    }
});
