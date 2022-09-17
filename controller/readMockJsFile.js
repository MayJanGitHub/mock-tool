// 读取config/mock.js文件内容，并在前端工程.src/mock中创建index.js文件
const fs = require("fs");
const { promisify } = require("util");
const cfg = require("../config/mock-config");

const readFile = promisify(fs.readFile);

exports.getMockJsData = async (num) => {
	let pathNm = cfg.mockCfg.mockJsPath;
	const data = await readFile(pathNm, 'utf8')
	// console.log("mock.js文件读取成功", data);
	return data;
};

