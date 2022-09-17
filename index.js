const express = require("express");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const router = express.Router();
const morgan = require("morgan");
const cors = require("cors");
const path = require('path')
const errorHandler = require("./middleware/error-handler");
const cfg = require("./config/mock-config");
const app = express();
const { judgePathAndFile } = require("./controller/handlePathFile.js");
const { getMockJsData } = require("./controller/readMockJsFile.js");

// 配置解析表单请求体：application/json
app.use(express.json());
// 配置解析表单请求体：application/x-www-form-urlencoded
app.use(express.urlencoded());
app.use(cookieParser());
// 配置日志输出
app.use(morgan("dev"));

// 配置跨域请求
app.use(cors());
app.use("/", router);

// 在前端项目工程中添加index.js文件
function onceAddMockJs(fn) {
	let done = false;
	return function () {
		if (!done) {
			done = true;
			return fn.apply(this, arguments);
		}
	};
}

let onceAddMockJsFile = onceAddMockJs(async () => {
	const data = await getMockJsData();
	let projectPh = path.resolve(__dirname, '..') + cfg.mockCfg.webProjectFolderNm + cfg.mockCfg.mockPosition; // 该工具与前端工程代码同级
	// let projectPh = path.resolve(__dirname, '..') + cfg.mockCfg.mockPosition; // 该工具在前端工程代码里
	let mockJsPath = projectPh.replace(/\\/g, "/");
	// 在前端项目工程中mock目录创建index.js文件和数据
	judgePathAndFile(mockJsPath, data, "js");
});

router.all(cfg.mockCfg.request_url_reg, async (req, res, next) => {
	const url = cfg.mockCfg.request_address;
	const options = {
		method: req.method,
		url: url + req.url,
		headers: req.headers,
		data: req.body,
	};
	cfg.mockCfg.isAddLocalMockIndexJs && onceAddMockJsFile();
	axios(options)
		.then((response) => {
			let srcPath = !cfg.mockCfg.isAddLocalJson
				? cfg.mockCfg.server_mock_dir
				: path.resolve(__dirname, '..');
			let pathNm = "";
			if (!cfg.mockCfg.isAddLocalJson) {
				pathNm = srcPath + req.path;
			} else {
				let srcDir = srcPath.replace(/\\/g, "/");
				pathNm = srcDir + cfg.mockCfg.webProjectFolderNm + "/src/mock" + req.path; // 该工具与前端工程代码同级
				// pathNm = srcDir + "/src/mock" + req.path; // 该工具在前端工程代码里
			}
			judgePathAndFile(pathNm, response.data, "json");
			res.send(response.data);
			next();
		})
		.catch((err) => {
			res.send(err);
			next();
		});
});

// 挂载统一处理服务端错误中间件
app.use(errorHandler());

// 在所有的路由之后配置处理 404 的内容
app.use((req, res, next) => {
	res.status(404).end();
});

app.listen(cfg.mockCfg.port, () => {
	console.log(`Server is running at http://localhost:${cfg.mockCfg.port}`);
});
