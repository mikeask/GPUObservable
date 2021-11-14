const schedule = require("node-schedule");
const { default: axios } = require("axios");
const GpuPrice = require("../models/gpuPriceSchema");

const rule = new schedule.RecurrenceRule();
rule.second = 10;

const job = schedule.scheduleJob("0 0 * * * *", function () {
  axios.defaults.baseURL = process.env.TWITTER_BASE_URL;
  axios.defaults.headers.common = {
    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
  };

  console.log("====================================");
  console.log("Refreshing observer twitter data...");
  getFeedTweets();
  console.log("====================================");
});

async function getFeedTweets() {
  const path = `/users/${process.env.TWITTER_OBSERVER_USER_ID}/tweets?max_results=100&tweet.fields=created_at`;
  try {
    const result = await axios.get(path);

    const gpuPriceDataMined = result.data.data
      .map(async (tweet) => {
        const newGpuPrice = getDataFromTweet(tweet);
        if (newGpuPrice) await updateOrCreateGpuPriceOnDB(newGpuPrice);
        return newGpuPrice;
      })
      .filter((undefined) => undefined);
  } catch (err) {
    console.log(err);
  }
}

async function updateOrCreateGpuPriceOnDB(newGpuPrice) {
  console.log("====================================");
  console.log(newGpuPrice);
  console.log("====================================");
  try {
    const result = await GpuPrice.findByIdAndUpdate(
      newGpuPrice._id,
      newGpuPrice
    );
    if (!result) {
      console.log("====================================");
      console.log(result);
      console.log("====================================");
      await GpuPrice.create(newGpuPrice);
    }
  } catch (err) {
    console.log(err);
  }
}

function getDataFromTweet(tweet) {
  const IS_INFORMATIVE_TWEET = tweet.text.includes("mín.:");
  if (!IS_INFORMATIVE_TWEET) return false;

  const gpuName = tweet.text
    .split(" - ")[0]
    .replace("Aumentos:\n", "")
    .replace("Reduções:\n", "");

  const newGpuData = {
    _id: gpuName,
    lastPrice: mineLastPrice(tweet.text),
    lastPriceDate: tweet.created_at,
    links: mineLinks(tweet.text),
    ...mineMinorPriceAndDate(tweet.text),
  };

  return newGpuData;
}

function mineLastPrice(tweetText) {
  const strFromLastPrice = tweetText.substring(
    tweetText.indexOf("-&gt; R$") + "-&gt; R$".length,
    tweetText.length
  );
  const lastPriceString = strFromLastPrice.split(" ")[0].replace(",", ".");
  return lastPriceString;
}

function mineMinorPriceAndDate(tweetText = "teste") {
  const strFromMinorPrice = tweetText.substring(
    tweetText.indexOf("mín.:R$") + "mín.:R$".length,
    tweetText.length
  );
  [minorPriceData, mineMinorPriceDateData, ...rest] =
    strFromMinorPrice.split(" ");

  const sanitizedMinorPriceData = mineMinorPriceDateData
    .split(")\n")[0]
    .replace("(", "")
    .replace(",", ".");

  const minorPriceDate = formatMinorPriceDate(sanitizedMinorPriceData);

  const minorPrice = minorPriceData.replace(",", ".");

  return { minorPrice, minorPriceDate };
}

function formatMinorPriceDate(sanitizedMinorPriceData) {
  const [day, month, year] = sanitizedMinorPriceData.split("/");

  const fourDigitsYear = year.length === 2 ? `20${year}` : year;
  return new Date(fourDigitsYear, month - 1, day, 0, 0, 0, 0);
}

function mineLinks(tweetText) {
  const words = tweetText.split(" ");
  const linksNotSanitized = words.filter((str) => str.includes("https://"));
  const links = linksNotSanitized
    .join("\n")
    .split("\n")
    .filter((str) => str.includes("https://"));

  return links;
}
