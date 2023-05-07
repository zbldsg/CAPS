CAPS.SelectionBoxLine = function (v0, v1, f0, f1, selection) {

    //创建线条的Geometry对象，并将点v0和v1添加到其中
    // var lineGeometry = new THREE.BGeometry();
    // lineGeometry.vertices.push(v0, v1);

    //计算线段的长度，并将结果存储到lineGeometry中
    // lineGeometry.computeLineDistances();

    /*     兼容新版本 zbldsg-begin-----------  */
    // 创建 BufferGeometry 对象
    var lineGeometry = new THREE.BufferGeometry();

    // 创建 Float32Array 类型的数组，并传入 vertices
    var positions = new Float32Array([v0.x, v0.y, v0.z, v1.x, v1.y, v1.z]);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 计算线段的长度
    var lineDistances = new Float32Array(2);
    lineDistances[0] = 0;
    lineDistances[1] = v0.distanceTo(v1);
    lineGeometry.setAttribute('lineDistance', new THREE.BufferAttribute(lineDistances, 1));

    /*     兼容新版本 zbldsg-end-----  */

    //设置lineGeometry对象为可变的
    lineGeometry.dynamic = true;

    //将lineGeometry添加到selection对象的lineGeometries数组中
    selection.lineGeometries.push(lineGeometry);

    //创建线条的LineSegments对象，并使用CAPS.MATERIAL.BoxWireframe材质进行渲染
    this.line = new THREE.LineSegments(lineGeometry, CAPS.MATERIAL.BoxWireframe);

    //将线条的LineSegments对象添加到selection对象的displayMeshes数组中
    selection.displayMeshes.add(this.line);

    //将线条对象this添加到面f0和f1的lines数组中
    f0.lines.push(this);
    f1.lines.push(this);
};

CAPS.SelectionBoxLine.prototype = {

    constructor: CAPS.SelectionBoxLine,


    //设置线条对象的高亮效果
    setHighlight: function (b) {
        //如果b为true，则使用CAPS.MATERIAL.BoxWireActive材质进行渲染；否则使用CAPS.MATERIAL.BoxWireframe材质进行渲染
        this.line.material = b ? CAPS.MATERIAL.BoxWireActive : CAPS.MATERIAL.BoxWireframe;
    }

};

