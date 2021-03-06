/**
 * Time constants
 * @const {Object.<string, number>}
 */
var TIME = {};

TIME.MONTHS_IN_YEAR = 12;

TIME.DAYS_IN_WEEK = 7;
TIME.DAYS_IN_MONTH = 30;
TIME.DAYS_IN_YEAR = 365;

TIME.HOURS_IN_DAY = 24;
TIME.HOURS_IN_WEEK = TIME.HOURS_IN_DAY * TIME.DAYS_IN_WEEK;
TIME.HOURS_IN_MONTH = TIME.HOURS_IN_DAY * TIME.DAYS_IN_MONTH;
TIME.HOURS_IN_YEAR = TIME.HOURS_IN_DAY * TIME.DAYS_IN_YEAR;

TIME.MINUTES_IN_HOUR = 60;
TIME.MINUTES_IN_DAY = TIME.MINUTES_IN_HOUR * TIME.HOURS_IN_DAY;
TIME.MINUTES_IN_WEEK = TIME.MINUTES_IN_DAY * TIME.DAYS_IN_WEEK;
TIME.MINUTES_IN_MONTH = TIME.MINUTES_IN_DAY * TIME.DAYS_IN_MONTH;
TIME.MINUTES_IN_YEAR = TIME.MINUTES_IN_DAY * TIME.DAYS_IN_YEAR;

TIME.SECONDS_IN_MINUTE = 60;
TIME.SECONDS_IN_HOUR = TIME.SECONDS_IN_MINUTE * TIME.MINUTES_IN_HOUR;
TIME.SECONDS_IN_DAY = TIME.SECONDS_IN_HOUR * TIME.HOURS_IN_DAY;
TIME.SECONDS_IN_WEEK = TIME.SECONDS_IN_DAY * TIME.DAYS_IN_WEEK;
TIME.SECONDS_IN_MONTH = TIME.SECONDS_IN_DAY * TIME.DAYS_IN_MONTH;
TIME.SECONDS_IN_YEAR = TIME.SECONDS_IN_DAY * TIME.DAYS_IN_YEAR;

TIME.MS_IN_SECOND = 1000;
TIME.MS_IN_MINUTE = TIME.MS_IN_SECOND * TIME.SECONDS_IN_MINUTE;
TIME.MS_IN_HOUR = TIME.MS_IN_MINUTE * TIME.MINUTES_IN_HOUR;
TIME.MS_IN_DAY = TIME.MS_IN_HOUR * TIME.HOURS_IN_DAY;
TIME.MS_IN_WEEK = TIME.MS_IN_DAY * TIME.DAYS_IN_WEEK;
TIME.MS_IN_MONTH = TIME.MS_IN_DAY * TIME.DAYS_IN_MONTH;
TIME.MS_IN_YEAR = TIME.MS_IN_DAY * TIME.DAYS_IN_YEAR;
