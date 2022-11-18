import $ from "jquery";

async function getRequest(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.status);
        }
      }
    };
  });
}

function formatTimestamp(timestamp, timeFormat) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  // format to "MM/DD/YYYY HH:mm:ss"
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

function twentyFourToTwelve(hour, minutes) {
  let amPm = "AM";
  if (hour > 12) {
    hour -= 12;
    amPm = "PM";
  }
  return `${hour}:${minutes} ${amPm}`;
}

function handleStatus(status) {
  switch (status) {
    case "closed":
    case "closed:fair_play_violations":
      return "Deactivated";
    case "basic":
      return "Basic";
    case "premium":
      return "Premium";
    case "mod":
      return "Moderator";
    case "staff":
      return "Staff Member";
  }
}

$("button").on("click", () => {
  const url = `https://api.chess.com/pub/player/${$("#name").val()}`;
  // const url = `../index.html`;
  getRequest(url).then((response) => {
    const res = JSON.parse(response);
    $("#user-img").attr(
      "src",
      res.avatar ||
        "https://images.chesscomfiles.com/uploads/v1/user/140401027.7840aa99.200x200o.f27f0c7ef43f.jpeg" // avatar of "nopfp" user
    );
    $("#user-name").text(res.username);
    $("#user-joined").text(formatTimestamp(res.joined, "MM/DD/YYYY HH:mm:ss"));
    $("#user-last-online").text(
      formatTimestamp(res.last_online, "MM/DD/YYYY HH:mm:ss")
    );
    $("#user-status").text(handleStatus(res.status));
  });
});
