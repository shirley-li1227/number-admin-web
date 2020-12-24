export const PrivateEnum = {
	yz: "yz",
	agent_jy: "agent_jy"
};

const getConfig = () => {
	console.log(SERVICE_EVN);
	const config = {
		H5URL: "https://wx.315family.com"
	};
	switch (SERVICE_EVN) {
		case "production": //正式
			config.baseurl = "./api";
			config.baseImgUrl = "https://zpws-1255382539.picsh.myqcloud.com";
			config.H5URL = "https://xcxh5.zpws.ehsure.com";
			break;
		case "release": //315测试
			config.baseurl = "./api";
			config.baseImgUrl = "https://test-1255382539.picsh.myqcloud.com";
			break;
		case "development": //本地
			config.baseurl = "http://172.81.241.236:8801";
			config.baseImgUrl = "https://test-1255382539.picsh.myqcloud.com";
			config.H5URL = "http://10.1.37.106:8040";
			break;
		default:
			break;
	}

	return config;
};

const config = getConfig();

config.uploadFileSize = 1024 * 1024 * 2;
export const H5URL = config.H5URL;
export const BASEURL = config.baseurl;
export const baseImgUrl = config.baseImgUrl;
export const uploadFileSize = config.uploadFileSize;
export const DateFormat = "YYYY-MM-DD";

// 私有化ID
export const PrivateId = "";
export const PlatformName = "门店取号";
export const PlatformShortName = "门店取号";
export const PlatformLogo = "./static/images/logo.png";
export const PlatformFavicon = "";
// 注册时是否需要行业类目
export const RegisterCategory = true;
//

export const RewardVo = {
	// 前端唯一ID
	uid: "",

	enabled: true,
	name: "",
	qty: "",
	dailyAwardMaxTimes: "",
	prizeType: 1,
	winProbability: "",
	freeWinProbability: "",
	bonusType: 1,
	maxBonus: "",
	minBonus: "",
	prizeName: "",

	default: false,
	firstJoin: false,
	whitePrize: false
};
