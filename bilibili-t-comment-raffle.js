(async function () {
  // config
  const oid = "598864860801381543";

  // max-page size
  let max = 20;

  let data = [];
  let next = 0;
  let end = false;
  let participant = [];

  // record uid
  function record(replies) {
    for (let i = 0; i < replies.length; i++) {
      participant.push(replies[i].mid);
      if (replies[i].replies) {
        record(replies[i].replies);
      }
    }
  }

  // random function
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  // fetch data
  while (!end && max > 0) {
    console.log(`starting fetch page ${next + 1}`);
    const page = await fetch(
      `https://api.bilibili.com/x/v2/reply/main?next=${next}&type=17&oid=${oid}`
    ).then((response) => response.json());
    if (page && page.data && page.data.replies) {
      record(page.data.replies);
    }
    if (page.data.cursor.is_end) {
      end = true;
    }
    next++;
    max--;
    // sleep(500)
    await new Promise(r => setTimeout(r, 500));
  }

  // dedup
  const uniqueParticipant = Array.from(new Set(participant));

  // output participant number
  console.log("Participant num:", uniqueParticipant.length);

  // get random index
  const randon = getRandomInt(uniqueParticipant.length);

  // output win uid
  console.log(
    "%cWin uid:" + uniqueParticipant[randon],
    "color: red;font-size: 24px;font-weight: bold;"
  );
})();
