const osascript = require("./darwin_osahelper.js").osascript;

exports.getVolume = async function getVolume () {
  return parseInt(await osascript('output volume of (get volume settings)'), 10)
}

exports.setVolume = async function setVolume (val) {
  await osascript('set volume output volume (item 1 of argv)', [val])
}

exports.getMuted = async function getMuted () {
  return (await osascript('output muted of (get volume settings)')) === 'true'
}

exports.setMuted = async function setMuted (val) {
  await osascript('set volume ' + (val ? 'with' : 'without') + ' output muted')
}
