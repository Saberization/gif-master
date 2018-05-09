(function () {
    'use strict';

    const dragAreaEl = document.getElementById('drag-area');
    const imglistEl = document.getElementById('img-list');
    const uploadEl = document.getElementById('upload');
    const buildEl = document.getElementById('build-btn');
    const previewEl = document.getElementById('preview');

    let haveImage = 0;

    /**
     * 初始化参数
     */
    function init() {
        initListeners();
    }

    /**
     * 事件监听
     */
    function initListeners() {
        dragAreaEl.addEventListener('dragenter', function (e) {
            this.classList.add('dragenter');
        });

        dragAreaEl.addEventListener('dragover', function (e) {
            e.preventDefault();
        }, {
            passive: false
        });

        dragAreaEl.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragenter');

            const dataTransfer = e.dataTransfer;

            handleFile(dataTransfer.files);
        }, {
            passive: false
        });

        document.addEventListener('dragstart', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        uploadEl.addEventListener('change', function () {
            handleFile(this.files);
        });

        buildEl.addEventListener('click', function () {
            // 绘制成 gif
            mergeImgToGif();
        });

        imglistEl.addEventListener('click', function(e) {
            let self = e.target;

            if (self && self.tagName !== 'A') {
                return;
            }

            self.parentElement.remove();
        });
    }

    /**
     * 处理文件显示
     * @param {Array} files 文件对象集合
     */
    function handleFile(files) {
        // 每次处理之前都先清空原先的图片列表
        imglistEl.innerHTML = '';
        haveImage = 0;

        for (let i = 0, len = files.length; i < len; i++) {
            const item = files[i],
                size = item.size;

            if (size / 1024 > 800) {
                alert('图片：' + item.name + '大小超过了 800k');

                return;
            }

            haveImage = 1;

            const p = blobToBase64(item);

            p.then(function (b64) {
                const tpl = `<li class="img-list-item">
                                <img src="${b64}" alt="">
                                <input type="text" class="input input-chat" placeholder="输入对话信息">
                                <div class="timmer">延时:
                                    <input type="text" class="input input-timmer"> ms
                                </div>
                                <a href="javascript:void(0)" class="del">删除</a>
                            </li>`;

                imglistEl.innerHTML += tpl;
            });
        }
    }

    /**
     * 合并图片
     */
    function mergeImgToGif() {
        if (!haveImage) {
            alert('请先上传图片');

            return;
        }

        const children = [].slice.call(imglistEl.children);
        const firstImg = children[0].querySelector('img');
        const width = firstImg.naturalWidth,
            height = firstImg.naturalHeight;

        const gif = new window.GIF({
            width: width,
            height: height
        });

        const canvasHTMLElement = document.createElement('canvas');
        const ctx = canvasHTMLElement.getContext('2d');

        canvasHTMLElement.width = width;
        canvasHTMLElement.height = height;
        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#fff';

        children.forEach((e, i) => {
            ctx.drawImage(e.querySelector('img'), 0, 0);
            ctx.strokeText(e.querySelector('.input-chat').value, width / 2, height - 10);

            gif.addFrame(ctx, {
                delay: e.querySelector('.input-timmer').value || 3,
                copy: true
            });
        });

        gif.on('finished', function (blob) {
            previewEl.src = window.URL.createObjectURL(blob);
        });

        gif.render();
    }

    /**
     * blob 转 base64
     * @param {Object} blob blob对象
     * @returns {Promise} Promise对象
     */
    function blobToBase64(blob) {
        const fileReader = new FileReader();

        fileReader.readAsDataURL(blob);

        return new Promise(function (resolve, reject) {
            fileReader.onload = function (e) {
                resolve(e.target.result);
            };
        });
    }

    init();
}());