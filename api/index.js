import edgeChromium from 'chrome-aws-lambda';

// Importing Puppeteer core as default otherwise
// it won't function correctly with "launch()"
import puppeteer from 'puppeteer-core';

// You may want to change this if you're developing
// on a platform different from macOS.
// See https://github.com/vercel/og-image for a more resilient
// system-agnostic options for Puppeteeer.
const LOCAL_CHROME_EXECUTABLE =
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

export default async function (req, res) {
  // Edge executable will return an empty string locally.
  const executablePath =
    (await edgeChromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

  const browser = await puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: false,
  });

  const page = await browser.newPage();

  let scrapedData = [];

  await page.goto('https://www.futwiz.com/en/fifa23/player/xaver-schlager/576');

  await page.waitForSelector('.player-prices');
  // Get all prices
  let prices = await page.$$eval('.player-prices .price-num', (links) => {
    if (links.length) {
      return links[0].textContent;
    }
    return 0;
  });
  scrapedData.push(prices);

  await page.close();

  res.json({ scrapedData });
}
// export default async function (req, res) {
//   // Edge executable will return an empty string locally.
//   const executablePath =
//     (await edgeChromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

//   const browser = await puppeteer.launch({
//     executablePath,
//     args: edgeChromium.args,
//     headless: false,
//   });

//   const page = await browser.newPage();

//   await page.goto('https://github.com');

//   res.send('hello');
// }

// export default function handler(req, res) {
//   res.status(200).json({
//     hello: true,
//   });
// }
