/**
 * @description 对象池
 * 1. 大类型 小类型
 * 2. 增加节点
 * 3. 回收节点
 * 4. 删除节点
 */

fn.PoolManager = (function () {
    function PoolManager() {
        this.dictPools_ = cc.js.createMap(true);
    }

    /**
     * @type {PoolManager}
     */
    var instance = undefined;
    Object.defineProperty(PoolManager, "Instance", {
        get() {
            if (!instance) {
                instance = new PoolManager();
            }
            return instance;
        },
        configurable: true
    })

    PoolManager.Release = () => {
        if (instance) {
            instance.release();
        }
    }

    PoolManager.prototype = {
        init: function () {

        },

        release: function () {

        },

        put_node(node) {
            let name = node.name;
            let pool = this.dictPools_[name];
            if (!pool) {
                pool = new cc.NodePool();
                this.dictPools_[name] = pool;
            }
            pool.put(node);
        },

        get_node(prefab) {
            let name = prefab.data.name;
            let pool = this.dictPools_[name];
            if (!pool) {
                pool = new cc.NodePool();
                this.dictPools_[name] = pool;
            }

            let node = undefined;
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = cc.instantiate(prefab);
            }
            return node;
        },

        clear_all() {
            for (let type in this.dictPools_) {
                let pool = this.dictPools_[type];
                pool.clear();
            }
        },

        clear(name) {
            let pool = this.dictPools_[name];
            if (pool) {
                pool.clear();
            }
        }
    }

    return PoolManager;

})();

window.PoolManager = fn.PoolManager;