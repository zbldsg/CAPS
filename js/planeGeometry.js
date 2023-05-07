// CAPS.PlaneGeometry = function (v0, v1, v2, v3) {
//     // 继承THREE.Geometry类的所有属性和方法
//     THREE.BufferGeometry.call(this);
//     // THREE.BufferGeometry.prototype.constructor.call(this)
//     // 添加四个顶点
//     this.vertices.push(v0, v1, v2, v3);
//
//     // 添加两个三角面
//     this.faces.push(new THREE.Face3(0, 1, 2));
//     this.faces.push(new THREE.Face3(0, 2, 3));
//
//     // 计算面法向量
//     this.computeFaceNormals();
//     // 计算顶点法向量
//     this.computeVertexNormals();
// };

/*     兼容新版本 zbldsg-begin-----------  */
class PlaneGeometry extends THREE.BufferGeometry {
	constructor(v0, v1, v2, v3) {
		super();
		// 定义矩形的顶点位置
		const positions = new Float32Array([
			v0.x, v0.y, v0.z,
			v1.x, v1.y, v1.z,
			v2.x, v2.y, v2.z,
			v3.x, v3.y, v3.z
		]);

		// 定义矩形的面索引
		const indices = new Uint16Array([
			0, 1, 2,
			0, 2, 3
		]);

		// 将顶点位置添加到BufferGeometry对象中
		this.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		// 将面索引添加到BufferGeometry对象中
		this.setIndex(new THREE.BufferAttribute(indices, 1));

		// 计算法向量
		this.computeVertexNormals();
	}
}


CAPS.PlaneGeometry = PlaneGeometry
// 让PlaneGeometry继承BufferGeometry的原型
// PlaneGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
// PlaneGeometry.prototype.constructor = PlaneGeometry;
/*     兼容新版本 zbldsg-end-----------  */
