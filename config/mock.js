// 1.引入文件
const fs = require("fs");
const Mock = require("mockjs");
const path = require('path')
const pathReg = /\/(pc|auth)+\/*/; // 请求路径限定规则，自行配置
const mockSrcDir = '/src/mock/'; // mock文件夹在前端工程中的路径，自行配置
// 2.读取json文件
function getJsonFile(filePath) {
	// 读取指定的json文件
	const json = fs.readFileSync(filePath, 'utf-8');
	// 解析并返回
	return JSON.parse(json)

}

// 3.返回一个函数
module.exports = function (app) {
	if ( process.env.Mock && process.env.Mock == "true" ) {
		app.all(pathReg, (rep, res) => {
			// 响应时，返回 mock data的json数据
			let filePath = path.normalize(process.cwd() + mockSrcDir + rep.path + '.json');
			// console.log("已请求本地Json数据->", filePath)
			const articleList = getJsonFile(filePath)
			// 将json传入 Mock.mock 方法中，生成的数据返回给浏览器
			res.json(Mock.mock(articleList))
		})
	}
};

