const {Builder, By, Key, until} = require('selenium-webdriver');

(async function test_basic_demo() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:8080');
    await driver.findElements(By.className('highlight'))
                .then(highlights => {
                  console.assert(highlights.length === 2);
                });
  } finally {
    await driver.quit();
  }
})();
