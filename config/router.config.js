module.exports = [
	// 用户登录 注册 忘记密码
	{
		path: "/user",
		component: "../layouts/userLayout",
		routes: [
			{ path: "/user", redirect: "/user/login" },
			{ path: "/user/login", component: "./user/login" },
		],
	},
	// app
	{
		path: "/",
		component: "../layouts/basicLayout",
		routes: [
			//没有权限
			{
				path: "/noAuth",
				name: "router.name.noAuth",
				component: "./noAuth",
			},

			/**** 首页 ******/
			{
				path: "/",
				name: "router.name.home",
				component: "./home",
			},
			{
				path: "/shop/list",
				name: "router.name.shop",
				component: "./shop",
			},
			{
				path: "/shop/list/create",
				name: "router.name.shop",
				component: "./shop/edit",
			},
			{
				path: "/shop/list/edit",
				name: "router.name.shop",
				component: "./shop/edit",
			},

			{
				path: "/500",
				name: "500",
				component: "./500",
			},
			{
				name: "404",
				component: "./404",
			},
		],
	},
];
