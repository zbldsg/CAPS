CAPS.picking = function (simulation) {

// 定义变量
    var intersected = null;  // 鼠标交互时当前选中的对象
    var mouse = new THREE.Vector2();  // 鼠标位置向量
    var ray = new THREE.Raycaster();  // 射线

    // 定义法向量对象
    var normals = {
        x1: new THREE.Vector3(-1, 0, 0),
        x2: new THREE.Vector3(1, 0, 0),
        y1: new THREE.Vector3(0, -1, 0),
        y2: new THREE.Vector3(0, 1, 0),
        z1: new THREE.Vector3(0, 0, -1),
        z2: new THREE.Vector3(0, 0, 1)
    };

    // 创建一个平面
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 4, 4), CAPS.MATERIAL.Invisible);
    simulation.scene.add(plane);  // 将平面添加到场景中

    // 定义 targeting 函数
    var targeting = function (event) {

        mouse.setToNormalizedDeviceCoordinates(event, window);  // 将鼠标位置设置为标准化设备坐标

        ray.setFromCamera(mouse, simulation.camera);	// 从摄像机和鼠标位置创建一条射线

        var intersects = ray.intersectObjects(simulation.selection.selectables);  // 检测射线和选择对象之间的交集

        // 如果检测到交集
        if (intersects.length > 0) {

            var candidate = intersects[0].object;  // 获取第一个相交的对象

            // 如果当前选中的对象不是与相交对象相同
            if (intersected !== candidate) {

                if (intersected !== null) {
                    intersected.guardian.rayOut();  // 调用上一个选中对象的 rayOut 方法
                }

                candidate.guardian.rayOver();  // 调用当前选中对象的 rayOver 方法

                intersected = candidate;  // 将选中对象设置为当前对象

                simulation.renderer.domElement.style.cursor = 'pointer';  // 改变鼠标样式
                simulation.throttledRender();  // 渲染场景

            }

        } else if (intersected !== null) {  // 如果没有相交的对象

            intersected.guardian.rayOut();  // 调用上一个选中对象的 rayOut 方法
            intersected = null;  // 将选中对象设置为 null

            simulation.renderer.domElement.style.cursor = 'auto';  // 恢复鼠标样式
            simulation.throttledRender();  // 渲染场景

        }

    };

    // 定义开始拖拽的函数，该函数接受一个事件参数
    var beginDrag = function (event) {

        // 将鼠标坐标转换为标准化设备坐标
        mouse.setToNormalizedDeviceCoordinates(event, window);

        // 根据标准化设备坐标和相机生成一条光线
        ray.setFromCamera(mouse, simulation.camera);

        // 获取所有可选择物体和光线相交的物体
        var intersects = ray.intersectObjects(simulation.selection.selectables);

        // 如果有相交的物体
        if (intersects.length > 0) {

            // 阻止默认行为和事件传播
            event.preventDefault();
            event.stopPropagation();

            // 禁用控制器
            simulation.controls.enabled = false;

            // 获取第一个相交物体的交点和轴
            var intersectionPoint = intersects[0].point;
            var axis = intersects[0].object.axis;

            // 根据轴将交点置于对应的坐标轴上
            if (axis === 'x1' || axis === 'x2') {
                intersectionPoint.setX(0);
            } else if (axis === 'y1' || axis === 'y2') {
                intersectionPoint.setY(0);
            } else if (axis === 'z1' || axis === 'z2') {
                intersectionPoint.setZ(0);
            }

            // 将平面置于交点处
            plane.position.copy(intersectionPoint);

            // 根据轴生成一个新的法向量，然后将平面朝向该法向量
            var newNormal = simulation.camera.position.clone().sub(
                simulation.camera.position.clone().projectOnVector(normals[axis])
            );
            plane.lookAt(newNormal.add(intersectionPoint));

            // 将鼠标样式设置为move
            simulation.renderer.domElement.style.cursor = 'move';

            // 渲染画面
            simulation.throttledRender();

            // 定义持续拖拽的函数，该函数接受一个事件参数
            var continueDrag = function (event) {

                // 阻止默认行为和事件传播
                event.preventDefault();
                event.stopPropagation();

                // 将鼠标坐标转换为标准化设备坐标
                mouse.setToNormalizedDeviceCoordinates(event, window);

                // 根据标准化设备坐标和相机生成一条光线
                ray.setFromCamera(mouse, simulation.camera);

                // 获取光线和平面相交的点
                var intersects = ray.intersectObject(plane);

                // 如果有相交的点
                if (intersects.length > 0) {
                    // 根据拖拽轴的方向，设置新的值
                    if (axis === 'x1' || axis === 'x2') {
                        value = intersects[0].point.x;
                    } else if (axis === 'y1' || axis === 'y2') {
                        value = intersects[0].point.y;
                    } else if (axis === 'z1' || axis === 'z2') {
                        value = intersects[0].point.z;
                    }

                    // 将新的值设置到选择对象中
                    simulation.selection.setValue(axis, value);
                    // 更新渲染
                    simulation.throttledRender();

                }

            };

            // 定义一个函数用于处理拖拽结束事件
            var endDrag = function (event) {

                // 启用控制器
                simulation.controls.enabled = true;

                // 恢复鼠标指针样式
                simulation.renderer.domElement.style.cursor = 'pointer';

                // 移除事件监听器
                document.removeEventListener('mousemove', continueDrag, true);
                document.removeEventListener('touchmove', continueDrag, true);
                document.removeEventListener('mouseup', endDrag, false);
                document.removeEventListener('touchend', endDrag, false);
                document.removeEventListener('touchcancel', endDrag, false);
                document.removeEventListener('touchleave', endDrag, false);
            };

            document.addEventListener('mousemove', continueDrag, true);
            document.addEventListener('touchmove', continueDrag, true);

            document.addEventListener('mouseup', endDrag, false);
            document.addEventListener('touchend', endDrag, false);
            document.addEventListener('touchcancel', endDrag, false);
            document.addEventListener('touchleave', endDrag, false);

        }

    };

    simulation.renderer.domElement.addEventListener('mousemove', targeting, true);
    simulation.renderer.domElement.addEventListener('mousedown', beginDrag, false);
    simulation.renderer.domElement.addEventListener('touchstart', beginDrag, false);

};

