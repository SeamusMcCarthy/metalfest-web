module.exports = function (count) {
  if (count == 1) var string = "There is 1 user in the system";
  else var string = "There are " + count + " users in the system";
  return string;
};
