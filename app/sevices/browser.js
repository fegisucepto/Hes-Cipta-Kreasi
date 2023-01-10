import puppeteer from 'puppeteer'

let instance = null

const minimalArgs = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
]

const getBrowser = async () => {
  if (instance !== null) {
    return instance
  }
  instance = await puppeteer.launch({
    headless: true,
    args: minimalArgs,
    executablePath: '/usr/bin/chromium-browser',

  })
  return instance
}

export default async function browser(pathFileSave, link) {
  try {
    const browserApp = await getBrowser()
    const page = await browserApp.newPage()
    // eslint-disable-next-line consistent-return
    page.on('console', (msg) => {
      if (msg.text().includes('404')) return false
      if (msg.text().includes('ERR_CONNECTION_REFUSED')) return false
    })
    // add header for the navigation requests
    await page.goto(link, {
      waitUntil: 'networkidle2',
    })
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 0.68 })
    await page.pdf({
      path: pathFileSave,
      scale: 0.5,
      format: 'A4',
      margin: {
        top: '38px',
        right: '38px',
        bottom: '38px',
        left: '38px',
      },
    })
    await page.close()
    return true
  } catch (err) {
    return false
  }
}
