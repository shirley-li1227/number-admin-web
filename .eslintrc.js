module.exports = {
	extends: "eslint-config-umi",
	globals: {
		SERVICE_EVN: false
	},
	rules: {
		"arrow-spacing": 2, //=>的前/后括号
		quotes: [2, "single"], //单引号
		"no-var": 2, //对var警告
		semi: [2, "always"],
		"no-trailing-spaces": 1, //一行结束后面有空格就发出警告
		"no-cond-assign": 2, //禁止在条件表达式中使用赋值语句
		"no-const-assign": 2, //禁止修改const声明的变量
		"no-dupe-keys": 2, //在创建对象字面量时不允许键重复
		"no-duplicate-case": 2, //switch中的case标签不能重复
		"no-dupe-args": 2, //函数参数不能重复
		"no-empty": 2, //块语句中的内容不能为空
		"no-extra-semi": 2, //禁止多余的冒号
		"no-func-assign": 2, //禁止重复的函数声明
		"no-redeclare": 2, //禁止重复声明变量
		"no-spaced-func": 2, //函数调用时 函数名与()之间不能有空格
		"no-undef": 2, //不能有未定义的变量
		"no-implied-eval": 2, //禁止使用隐式eval
		"no-inner-declarations": [2, "functions"], //禁止在块语句中使用声明（变量或函数）
		"no-invalid-regexp": 2, //禁止无效的正则表达式
		"no-irregular-whitespace": 2, //不能有不规则的空格
		"no-mixed-spaces-and-tabs": [2, false], //禁止混用tab和空格
		"no-multi-spaces": 2, //禁止用多余的空格
		"no-use-before-define": 2, //未定义前不能使用
		"comma-spacing": [2, { before: false, after: true }], //逗号 前面不要空格 后面加空格
		"no-sparse-arrays": 2, //禁止稀疏数组， [1,,2]
		// 'indent': [1, 'tab', { SwitchCase: 1 }], //缩进风格
		"brace-style": [2, "1tbs"],
		"react/no-direct-mutation-state": 2, //防止this.state的直接变异
		"react/no-unknown-property": 2, //防止使用未知的DOM属性
		"key-spacing": [2, { beforeColon: false, afterColon: true }], //对象字面量中冒号的前后空格
		"no-extend-native": [0, { exceptions: ["Object"] }]
	}
};
