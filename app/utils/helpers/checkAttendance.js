module.exports = function (attendance, id) {
  if (attendance == "Y")
    var string =
      '<a class="uk-button uk-button-default" href="#">Already Attended</a>';
  else
    var string =
      '<a class="uk-button uk-button-primary" href="/attended/' +
      id +
      '">Mark as Attended</a>';
  return string;
};
