
import LRU from 'lru-cache';

const msMinute = (1000 * 60);
// const msHour = (msMinute * 60);
const CACHE_TIME = msMinute * 5;
// const CACHE_TIME_MIN = msMinute * 4;
// const CACHE_TIME_MAX = msMinute * 8;

export default LRU({
    max: 128,
    maxAge: CACHE_TIME,
});

export let createCache = ({max, maxAge}) => LRU({max, maxAge});
