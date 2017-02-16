var q = require('./')

function postEvent (data) {
  var job = q.create(data[0] === '_' ? 'name' : 'email', {
    title: data,
    to: data + '@qq.com',
    from: data + '@123.com'
  })
  job
    .removeOnComplete(true)
    .save((err) => { if (!err) console.log('job = ', job.id)})
}

var stdin = process.openStdin()
stdin.addListener("data", function (d) {
  let data = d.toString().trim()
  console.log('you entered: ', Object.keys(d))
  postEvent(data)
})