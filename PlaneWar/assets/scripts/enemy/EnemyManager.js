
var default_target = cc.js.createMap();
default_target.uniqueId = 1;
const GenerateUniqueId = () => {
    return default_target.uniqueId++;
}

/**
 * @description 敌人管理类
 * 1. 增加敌人
 * 2. 删除敌人
 */
fn.EnemyManager = (function () {
    function EnemyManager () {
        this.ememyNodeMap_ = cc.js.createMap(true);
    }

    /** @type {EnemyManager} */
    var instance_ = undefined;
    Object.defineProperty(EnemyManager, "Instance", {
        get: function () {
            if(!instance_) {
                instance_ = new EnemyManager();
            }
            
            return instance_;
        },
        configurable: true,
    });
    
    EnemyManager.Release = () => {
        if(instance_) {
            instance_.release();
        }
    }
    

    EnemyManager.prototype = {
        init() {

        },

        release() {
            this.ememyNodeMap_ = cc.js.createMap();
        },

        /** 
         * 添加敌人
         * @param {cc.Node}
         */
        addEnemy(node) {
            if(node instanceof cc.Node) {
                let uniqueId = node.uniqueId =  (node.uniqueId || GenerateUniqueId());
                this.ememyNodeMap_[uniqueId] = node;
            }
            
        },

        /**
         * 删除敌人
         * @param {cc.Node} node 
         */
        removeEnemy(node) {
            if(node instanceof cc.Node) {
                let uniqueId = node.uniqueId;
                if(!uniqueId) return;
                delete this.ememyNodeMap_[uniqueId];
            }
        },

        /** 获取敌人列表 */
        getEnemys() {
            return this.ememyNodeMap_;
        }

    }
    
    return EnemyManager;
})();

window.EnemyManager = fn.EnemyManager;