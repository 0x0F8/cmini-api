import Cookies from "js-cookie";

const cookies = Cookies.withConverter({
  write: function (value, name) {
    return value;
  },
  read: function (value, name) {
    return value;
  },
});

export default cookies;
