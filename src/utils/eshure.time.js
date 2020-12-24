import moment from 'moment';
import { localeMessage } from './';
/**
 * 定义字符常量
 */
const STRINGS = {
	nodiff: '',
	year: localeMessage('utils.year'),
	month: localeMessage('utils.month'),
	day: localeMessage('utils.day'),
	hour: localeMessage('utils.hour'),
	minute: localeMessage('utils.minute'),
	second: localeMessage('utils.second'),
	delimiter: ''
};

/**
 *精确差值
 */
export const preciseDiff = (d1, d2) => {
	let m1 = moment(d1), m2 = moment(d2);

	m1.add(m2.utcOffset() - m1.utcOffset(), 'minutes'); //将m1的时区移到m2

	if (m1.isSame(m2)) {
		return STRINGS.nodiff;
	}
	if (m1.isAfter(m2)) {//m1在m2之后，交换时间
		let tmp = m1;
		m1 = m2;
		m2 = tmp;
	}

	//得到天数，月份是从0开始计数，
	let dDiff = moment([m2.year(), m2.month(), m2.date()]).diff(moment([m1.year(), m1.month(), m1.date()]), 'day');
	let hourDiff = m2.hour() - m1.hour();//小时相减
	let minDiff = m2.minute() - m1.minute();//分钟相减
	let secDiff = m2.second() - m1.second();//秒相减

	//秒计算，秒数相减小于0，借位分钟，秒数+60变为正
	if (secDiff < 0) {
		secDiff = 60 + secDiff;
		minDiff--;
	}
	//分计算，分数小于0，借位小时，分钟+60变为正
	if (minDiff < 0) {
		minDiff = 60 + minDiff;
		hourDiff--;
	}
	//小时计算,小时小于0，借位天数，小时+24大于0
	if (hourDiff < 0) {
		hourDiff = 24 + hourDiff;
		dDiff--;
	}
	return buildStringFromValues(dDiff, hourDiff, minDiff, secDiff);
};

/**
 *构建格式化字符串
 */
const buildStringFromValues = (dDiff, hourDiff, minDiff, secDiff) => {
	let result = [];
	if (dDiff) {
		result.push(dDiff + STRINGS['day']);
	}
	if (hourDiff) {
		result.push(hourDiff + STRINGS['hour']);
	}
	if (minDiff) {
		result.push(minDiff + STRINGS['minute']);
	}
	if (secDiff) {
		result.push(secDiff + STRINGS['second']);
	}
	return result.join(STRINGS.delimiter);
};

/**
* 计算时间间隔
*/
export const calculateTimeInterval = (beginTime, timeInterval, timeUnit) => {
	if (!beginTime || !timeInterval || !timeUnit) {
		return '';
	}
	let now = moment();
	let endTime = moment(typeof beginTime === 'string' ? beginTime.replace(/-/g, '/') : beginTime).add(timeInterval, timeUnit);
	let diff = '';
	if (now.isBefore(endTime)) {
		//当前时间在截止时间之前
		diff = preciseDiff(now, endTime);
	} else {
		diff = '';
	}
	return diff;
};
