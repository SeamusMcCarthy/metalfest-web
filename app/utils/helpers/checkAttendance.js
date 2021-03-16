module.exports = function (attendance) {
  if (attendance == "Y")
    var string =
      '<a class="uk-button uk-button-default" href="#">Already Attended</a>';
  else
    var string =
      '<a class="uk-button uk-button-primary" href="/attended/{{festival._id}}">Mark as Attended</a>';

  return decodeURI(string);
};
