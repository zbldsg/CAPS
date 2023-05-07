CAPS.Simulation = function () {

    this.scene = undefined;
    this.capsScene = undefined;
    this.backStencil = undefined;
    this.frontStencil = undefined;

    this.camera = undefined;
    this.renderer = undefined;
    this.controls = undefined;

    this.showCaps = true;

    this.init();

};

// 定义 CAPS.Simulation 构造函数
CAPS.Simulation.prototype = {

    // 构造函数属性指向 CAPS.Simulation
    constructor: CAPS.Simulation,

    // 初始化函数
    init: function () {
        var self = this;

        // 创建 ColladaLoader 对象
        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;

        // 加载 house.dae 模型
        loader.load('./models/house.dae', function (collada) {
            // 初始化场景
            self.initScene(collada.scene);
        });

        // 创建渲染容器
        var container = document.createElement('div');
        document.body.appendChild(container);

        // 创建透视摄像机
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.set(20, 20, 30);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // 创建场景和 CAPS 场景
        this.scene = new THREE.Scene();
        this.capsScene = new THREE.Scene();
        this.backStencil = new THREE.Scene();
        this.frontStencil = new THREE.Scene();

        // 创建 CAPS.Selection 对象
        this.selection = new CAPS.Selection(
            new THREE.Vector3(-7, -14, -14),
            new THREE.Vector3(14, 9, 3)
        );
        this.capsScene.add(this.selection.boxMesh);
        this.scene.add(this.selection.touchMeshes);
        this.scene.add(this.selection.displayMeshes);

        // 创建 WebGLRenderer 对象
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xffffff);
        this.renderer.autoClear = false;
        container.appendChild(this.renderer.domElement);

        // 创建 throttledRender 方法
        var throttledRender = CAPS.SCHEDULE.deferringThrottle(this._render, this, 40);
        this.throttledRender = throttledRender;

        // 注册拾取事件
        CAPS.picking(this);

        // 创建 OrbitControls 对象
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.addEventListener('change', throttledRender);

        // 创建 onWindowResize 方法并注册 resize 事件
        var onWindowResize = function () {
            self.camera.aspect = window.innerWidth / window.innerHeight;
            self.camera.updateProjectionMatrix();
            self.renderer.setSize(window.innerWidth, window.innerHeight);
            throttledRender();
        };
        window.addEventListener('resize', onWindowResize, false);

        // 获取 showCapsInput 元素
        var showCapsInput = document.getElementById('showCaps');
        this.showCaps = showCapsInput.checked;

        // 创建 onShowCaps 方法并注册 change 事件
        var onShowCaps = function () {
            self.showCaps = showCapsInput.checked;
            throttledRender();
        };
        showCapsInput.addEventListener('change', onShowCaps, false);

        // 调用 throttledRender 方法
        throttledRender();

    },

    // 初始化场景
    initScene: function (collada) {

        // 递归函数，将节点和其子节点的材质设置为指定的材质
        var setMaterial = function (node, material) {
            node.material = material;
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    setMaterial(node.children[i], material);
                }
            }
        };

        // 克隆Collada模型，设置背部材质和比例，添加到后部模板组中
        var back = collada.clone();
        setMaterial(back, CAPS.MATERIAL.backStencil);
        back.scale.set(0.03, 0.03, 0.03);
        back.updateMatrix();
        this.backStencil.add(back);

        // 克隆Collada模型，设置前部材质和比例，添加到前部模板组中
        var front = collada.clone();
        setMaterial(front, CAPS.MATERIAL.frontStencil);
        front.scale.set(0.03, 0.03, 0.03);
        front.updateMatrix();
        this.frontStencil.add(front);

        // 设置Collada模型的材质和比例，添加到场景中
        setMaterial(collada, CAPS.MATERIAL.sheet);
        collada.scale.set(0.03, 0.03, 0.03);
        collada.updateMatrix();
        this.scene.add(collada);

        // 渲染场景
        this.throttledRender();

    },

// 渲染场景
    _render: function () {

        // 清空渲染器
        this.renderer.clear();

        // 获取WebGL上下文
        var gl = this.renderer.context;

        // 如果显示Caps
        if (this.showCaps) {

            console.log(this.renderer,'我是render')
            // 启用模板测试
            // this.renderer.state.setStencilTest(true);
            //
            // // 设置背部模板
            // this.renderer.state.setStencilFunc(gl.ALWAYS, 1, 0xff);
            // this.renderer.state.setStencilOp(gl.KEEP, gl.KEEP, gl.INCR);
            // this.renderer.render(this.backStencil, this.camera);
            //
            // // 设置前部模板
            // this.renderer.state.setStencilFunc(gl.ALWAYS, 1, 0xff);
            // this.renderer.state.setStencilOp(gl.KEEP, gl.KEEP, gl.DECR);
            // this.renderer.render(this.frontStencil, this.camera);
            //
            // // 设置Caps模板
            // this.renderer.state.setStencilFunc(gl.EQUAL, 1, 0xff);
            // this.renderer.state.setStencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            // this.renderer.render(this.capsScene, this.camera);
            //
            // // 禁用模板测试
            // this.renderer.state.setStencilTest(false);

        }

        // 渲染场景
        this.renderer.render(this.scene, this.camera);

    }

};

