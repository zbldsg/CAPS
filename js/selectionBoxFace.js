//定义一个CAPS.SelectionBoxFace构造函数，它接受5个顶点和一个selection参数
CAPS.SelectionBoxFace = function (axis, v0, v1, v2, v3, selection) {

    //创建一个frontFaceGeometry对象，使用顶点v0, v1, v2, v3，表示一个四边形
    var frontFaceGeometry = new CAPS.PlaneGeometry(v0, v1, v2, v3);
    frontFaceGeometry.dynamic = true; //动态更新几何体
    selection.meshGeometries.push(frontFaceGeometry); //将frontFaceGeometry添加到meshGeometries数组中

    //创建一个frontFaceMesh对象，并将axis和guardian属性赋值，用于射线拾取时的区分
    var frontFaceMesh = new THREE.Mesh(frontFaceGeometry, CAPS.MATERIAL.Invisible);
    frontFaceMesh.axis = axis;
    frontFaceMesh.guardian = this;
    selection.touchMeshes.add(frontFaceMesh); //将frontFaceMesh添加到touchMeshes集合中
    selection.selectables.push(frontFaceMesh); //将frontFaceMesh添加到selectables数组中

    //创建一个backFaceGeometry对象，使用顶点v3, v2, v1, v0，表示一个四边形
    var backFaceGeometry = new CAPS.PlaneGeometry(v3, v2, v1, v0);
    backFaceGeometry.dynamic = true; //动态更新几何体
    selection.meshGeometries.push(backFaceGeometry); //将backFaceGeometry添加到meshGeometries数组中

    //创建一个backFaceMesh对象，使用CAPS.MATERIAL.BoxBackFace材质
    var backFaceMesh = new THREE.Mesh(backFaceGeometry, CAPS.MATERIAL.BoxBackFace);
    selection.displayMeshes.add(backFaceMesh); //将backFaceMesh添加到displayMeshes集合中

    this.lines = new Array(); //初始化lines数组为空
};

CAPS.SelectionBoxFace.prototype = {

    constructor: CAPS.SelectionBoxFace,

    //射线进入该面时，高亮该面对应的边线
    rayOver: function () {
        this.highlightLines(true);
    },

    //射线离开该面时，取消高亮该面对应的边线
    rayOut: function () {
        this.highlightLines(false);
    },

    //高亮该面对应的边线
    highlightLines: function (b) {
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].setHighlight(b);
        }
    }

};

