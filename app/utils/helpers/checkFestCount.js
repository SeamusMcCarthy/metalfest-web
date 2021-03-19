module.exports = function (count) {
  if (count == 1) var string = "There is 1 festival in the system";
  else var string = "There are " + count + " festivals in the system";
  return string;
};
