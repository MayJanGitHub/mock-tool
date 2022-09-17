module.exports.mockCfg = {
	// 拦截监听端口号，自行配置。如前端url：http://localhost:8081
	port: 8081,
	webProjectFolderNm: '/madp-2b-pc', // 自行配置 前端工程文件夹名称
	mockPosition: '/src/mock/index', // 自行配置 index.js在前端工程中的位置，isLocalMock为true时配置
	// 服务器上mock路径，不用修改
	server_mock_dir: "./mock",
	isAddLocalJson: true, // false: 服务器部署使用，true: 前端本地化开发环境使用
	// 请求路径限定正则，自行配置
	request_url_reg: /\/(pc|auth)+\/*/,
	request_address: "http://10.114.14.97:9080", // 前端请求真实后台地址，前端根据服务配置
	mockJsPath: "./config/mock.js",  // 当前工具mock.js文件路径，不用修改
	isAddLocalMockIndexJs: true, // 是否在前端工程mock目录下创建index.js文件
};
