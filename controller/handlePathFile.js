const fs = require("fs");

function writePathFile(path, codes, type) {
	let recTp = type;
	let pathA = path.split("/");
	pathA.pop(); // 移除数组末尾项
	createDirsSync(pathA.join("/"), function () {
		// 写入文件内容的回调函数
		// console.log("写入文件内容的回调函数", path, codes);
		let tp = recTp === 'json' ? '.json' : '.js';
		let str = path + tp;
		const data = recTp === 'json' ? JSON.stringify(codes, null, "  ") : codes;
		fs.writeFile(str, data, function (value) {
			codes = "";
		});
	});
}

// 判断有没有当前文件夹，有就查询下一层文件夹，没有就创建
function createDirsSync(dir, callback) {
	let dirs = dir.split("/");
	if (dirs[0] == "." || dirs[0] == "..") {
		dirs[1] = dirs[0] + "/" + dirs[1];
		dirs.shift();
	}
	if (dirs[dirs.length - 1] == "") {
		dirs.pop();
	}
	let len = dirs.length;
	let i = 0;
	let url = dirs[i];
	// 启动递归函数
	mkDirs(url);
	// 逐级检测有没有当前文件夹，没有创建，有就继续检测下一级
	function mkDirs(url) {
		if (fs.existsSync(url)) {
			i = i + 1;
			if (len > i) {
				url = url + "/" + dirs[i];
				mkDirs(url);
			} else {
				callback();
			}
		} else {
			mkDir(url);
		}
	}
	// 创建文件
	function mkDir(url) {
		fs.mkdirSync(url);
		i = i + 1;
		if (len > i) {
			url = url + "/" + dirs[i];
			mkDir(url);
		} else {
			callback();
		}
	}
}

exports.judgePathAndFile = async (path, jsonData, tp) => {
	writePathFile(path, jsonData, tp);
};
