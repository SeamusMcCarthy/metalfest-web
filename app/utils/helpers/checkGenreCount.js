module.exports = function (count) {
  if (count == 1) var string = "There is 1 genre in the system";
  else var string = "There are " + count + " genres in the system";
  return string;
};
