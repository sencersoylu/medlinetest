const cheerio = require("cheerio");

const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(`https://athome.medline.com/en/customer/account/login`, {
      waitUntil: "networkidle0",
    }); // Read url query parameter.

    await page.focus("input[name='login[username]']");
    await page.keyboard.type("denoliver1025@gmail.com", { delay: 100 });

    await page.focus("input[name='login[password]']");
    await page.keyboard.type("P@kyongjun1025", { delay: 100 });

    await page.waitFor(1000);

    await page.keyboard.down("Enter");
    await page.waitFor(50);
    await page.keyboard.up("Enter");

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    let html = await page.content();
    let $ = await cheerio.load(html);

    let cat_items = $(".level2 > a").toArray();

    const cat_links = cat_items.map((i) => {
      return $(i).attr("href");
    });

    const random = Math.floor(Math.random() * cat_links.length);

    await page.goto(cat_links[random] + "?product_list_limit=36", {
      waitUntil: "networkidle2",
    });

    await page.click("button.action.tocart.primary");

    await page.waitForSelector("div.addtocart-popup", {
      visible: true,
      timeout: 5000,
    });

    await page.waitFor(3000);

    // Empty Cart Section

    //await page.goto(`https://athome.medline.com/en/checkout/cart/`, {
    //  waitUntil: "networkidle2",
    //}); // Read url query parameter.
    //
    //await page.click("button#empty_cart_button");
    //
    //await page.waitForNavigation({ waitUntil: "networkidle2" });
    //
    //await page.waitFor(3000);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
