/**
 *
 * @param {*} func
 * @param {*} timeout
 * debounce function -> make sure code is only
 * triggered once per user input
 *
 * text-field auto-saves!
 * eliminating double button
 * search box
 *
 *
 */
const myDebounce = (func, wait = 500) => {
  let timeout;
  return (...args) => {
    const context = this;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default myDebounce;
