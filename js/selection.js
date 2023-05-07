// 定义一个 Selection 类，用于创建选择框对象

CAPS.Selection = function (low, high) {

    // 设置选择框的上下限
    this.limitLow = low;
    this.limitHigh = high;

    // 创建一个长宽高均为1的立方体
    this.box = new THREE.BoxGeometry(1, 1, 1);
    // 将该立方体转化为 Mesh 对象，并指定材质为 CAPS.MATERIAL.cap
    this.boxMesh = new THREE.Mesh(this.box, CAPS.MATERIAL.cap);

    // 定义八个顶点
    this.vertices = [
        new THREE.Vector3(), new THREE.Vector3(),
        new THREE.Vector3(), new THREE.Vector3(),
        new THREE.Vector3(), new THREE.Vector3(),
        new THREE.Vector3(), new THREE.Vector3()
    ];
    // 更新顶点坐标
    this.updateVertices();

    var v = this.vertices;

    // 创建 TouchMesh 对象，用于处理交互事件
    this.touchMeshes = new THREE.Object3D();
    // 创建 DisplayMesh 对象，用于显示选择框
    this.displayMeshes = new THREE.Object3D();
    // 定义 meshGeometries 数组，用于存储选择框的 Mesh 对象的几何体
    this.meshGeometries = [];
    // 定义 lineGeometries 数组，用于存储选择框的边缘线的几何体
    this.lineGeometries = [];
    // 定义 selectables 数组，用于存储可以被选中的对象
    this.selectables = [];

    // 定义六个面
    this.faces = [];
    var f = this.faces;
    this.faces.push(new CAPS.SelectionBoxFace('y1', v[0], v[1], v[5], v[4], this));
    this.faces.push(new CAPS.SelectionBoxFace('z1', v[0], v[2], v[3], v[1], this));
    this.faces.push(new CAPS.SelectionBoxFace('x1', v[0], v[4], v[6], v[2], this));
    this.faces.push(new CAPS.SelectionBoxFace('x2', v[7], v[5], v[1], v[3], this));
    this.faces.push(new CAPS.SelectionBoxFace('y2', v[7], v[3], v[2], v[6], this));
    this.faces.push(new CAPS.SelectionBoxFace('z2', v[7], v[6], v[4], v[5], this));

    // 定义十二条边缘线
    var l0  = new CAPS.SelectionBoxLine( v[ 0 ], v[ 1 ], f[ 0 ], f[ 1 ], this );
    var l1  = new CAPS.SelectionBoxLine( v[ 0 ], v[ 2 ], f[ 1 ], f[ 2 ], this );
    var l2  = new CAPS.SelectionBoxLine( v[ 0 ], v[ 4 ], f[ 0 ], f[ 2 ], this );
    var l3  = new CAPS.SelectionBoxLine( v[ 1 ], v[ 3 ], f[ 1 ], f[ 3 ], this );
    var l4  = new CAPS.SelectionBoxLine( v[ 1 ], v[ 5 ], f[ 0 ], f[ 3 ], this );
    var l5  = new CAPS.SelectionBoxLine( v[ 2 ], v[ 3 ], f[ 1 ], f[ 4 ], this );
    var l6  = new CAPS.SelectionBoxLine( v[ 2 ], v[ 6 ], f[ 2 ], f[ 4 ], this );
    var l7  = new CAPS.SelectionBoxLine( v[ 3 ], v[ 7 ], f[ 3 ], f[ 4 ], this );
    var l8  = new CAPS.SelectionBoxLine( v[ 4 ], v[ 5 ], f[ 0 ], f[ 5 ], this );
    var l9  = new CAPS.SelectionBoxLine( v[ 4 ], v[ 6 ], f[ 2 ], f[ 5 ], this );
    var l10 = new CAPS.SelectionBoxLine( v[ 5 ], v[ 7 ], f[ 3 ], f[ 5 ], this );
    var l11 = new CAPS.SelectionBoxLine( v[ 6 ], v[ 7 ], f[ 4 ], f[ 5 ], this );

    this.setBox();
    this.setUniforms();

};

// 定义一个CAPS.Selection对象原型，该对象用于表示选中范围
CAPS.Selection.prototype = {

    // 构造函数
    constructor: CAPS.Selection,

    // 更新顶点
    updateVertices: function () {

        // 设置八个顶点的坐标
        this.vertices[0].set(this.limitLow.x, this.limitLow.y, this.limitLow.z);
        this.vertices[1].set(this.limitHigh.x, this.limitLow.y, this.limitLow.z);
        this.vertices[2].set(this.limitLow.x, this.limitHigh.y, this.limitLow.z);
        this.vertices[3].set(this.limitHigh.x, this.limitHigh.y, this.limitLow.z);
        this.vertices[4].set(this.limitLow.x, this.limitLow.y, this.limitHigh.z);
        this.vertices[5].set(this.limitHigh.x, this.limitLow.y, this.limitHigh.z);
        this.vertices[6].set(this.limitLow.x, this.limitHigh.y, this.limitHigh.z);
        this.vertices[7].set(this.limitHigh.x, this.limitHigh.y, this.limitHigh.z);
    },

    // 更新几何体
    updateGeometries: function () {

        // 更新所有网格几何体的顶点和边界球、边框盒
        for (var i = 0; i < this.meshGeometries.length; i++) {
            this.meshGeometries[i].verticesNeedUpdate = true;
            this.meshGeometries[i].computeBoundingSphere();
            this.meshGeometries[i].computeBoundingBox();
        }

        // 更新所有线条几何体的顶点
        for (var i = 0; i < this.lineGeometries.length; i++) {
            this.lineGeometries[i].verticesNeedUpdate = true;
        }
    },

    // 设置选择框的尺寸和位置
    setBox: function () {

        // 计算选择框的长宽高
        var width = new THREE.Vector3();
        width.subVectors(this.limitHigh, this.limitLow);

        // 设置选择框的缩放和位置
        this.boxMesh.scale.copy(width);
        width.multiplyScalar(0.5).add(this.limitLow);
        this.boxMesh.position.copy(width);
    },

    // 设置uniform变量
    setUniforms: function () {

        // 获取裁剪的uniform变量
        var uniforms = CAPS.UNIFORMS.clipping;

        // 设置裁剪的下限和上限
        uniforms.clippingLow.value.copy(this.limitLow);
        uniforms.clippingHigh.value.copy(this.limitHigh);
    },

	// 设置选择框的值（长、宽、高）
	setValue: function ( axis, value ) {

		// 定义缓冲和限制值
		var buffer = 0.4;
		var limit = 14;

		// 根据轴的不同，设置不同的限制和缓冲
        if (axis === 'x1') {
            this.limitLow.x = Math.max(-limit, Math.min(this.limitHigh.x - buffer, value));
        } else if (axis === 'x2') {
            this.limitHigh.x = Math.max(this.limitLow.x + buffer, Math.min(limit, value));
        } else if (axis === 'y1') {
            this.limitLow.y = Math.max(-limit, Math.min(this.limitHigh.y - buffer, value));
        } else if (axis === 'y2') {
            this.limitHigh.y = Math.max(this.limitLow.y + buffer, Math.min(limit, value));
        } else if (axis === 'z1') {
            this.limitLow.z = Math.max(-limit, Math.min(this.limitHigh.z - buffer, value));
        } else if (axis === 'z2') {
            this.limitHigh.z = Math.max(this.limitLow.z + buffer, Math.min(limit, value));
        }

        this.setBox();
        this.setUniforms();

        this.updateVertices();
        this.updateGeometries();

    }

};

