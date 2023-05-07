// sets this vector to the coordinates of a mouse event, uses touch event if applicable
// 设置这个向量为鼠标事件的坐标，如果适用的话使用触摸事件
THREE.Vector2.prototype.setFromEvent = function ( event ) {

	this.x = ( event.clientX !== undefined ) ? event.clientX : ( event.touches && event.touches[ 0 ].clientX );
	this.y = ( event.clientY !== undefined ) ? event.clientY : ( event.touches && event.touches[ 0 ].clientY );
	return this;

};

// calculate mouse position in normalized device coordinates
// 计算归一化设备坐标中的鼠标位置
THREE.Vector2.prototype.setToNormalizedDeviceCoordinates = function ( event, window ) {

	this.setFromEvent( event );
	this.x = ( this.x / window.innerWidth ) * 2 - 1;
	this.y = - ( this.y / window.innerHeight ) * 2 + 1;
	return this;

};

