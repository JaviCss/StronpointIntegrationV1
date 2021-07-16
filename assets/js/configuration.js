let loader1 = $('#loader-pane #loader')
let loader2 = $('#loader-pane')
let groupsRequestAppropve = []
let groupsApprove = []
let client = ZAFClient.init()
//carga las variables con los datos del manifest
//y ejecuta los renders de cada grupo
client.metadata().then(metadata => {
  if (metadata.settings.requestApproveGroups !== 'null') {
    let group1 = metadata.settings.requestApproveGroups
    group1 = group1.split(',')
    group1.forEach(e => {
      groupsRequestAppropve.push(e)
    })
    rendergroup(group1)
  }
  if (metadata.settings.approveGroups !== 'null') {
    let group2 = metadata.settings.approveGroups
    group2 = group2.split(',')
    group2.forEach(e => {
      groupsApprove.push(e)
    })
    rendergroup2(group2)
  }
  if (metadata.settings.approvalProcess !== 'null') {
    let approvalProcess = metadata.settings.approvalProcess
    select(approvalProcess)
  } else {
    select('Not set')
  }
})
//obtiene los datos de cuenta netsuite
$('.btn-change-account').click(async function () {
  loader1.addClass('loader1')
  loader2.addClass('loader-pane1')
  //variables
  let accountId
  let consumerKey
  let consumerSecret
  let tokenId
  let tokenSecret
  let accountNumber
  //selecciona elementos del dom
  event.preventDefault()
  accountId = document.getElementById('accountId').value
  consumerKey = document.getElementById('consumerKey').value
  consumerSecret = document.getElementById('consumerSecret').value
  tokenId = document.getElementById('tokenId').value
  tokenSecret = document.getElementById('tokenSecret').value
  accountNumber = document.getElementById('select-acc').value
  //guarga las crdenciales en el manifest
  switch (accountNumber) {
    case '1':
      await setNsCredentials1(
        accountId,
        consumerKey,
        consumerSecret,
        tokenId,
        tokenSecret
      )
      break
    case '2':
      await setNsCredentials2(
        accountId,
        consumerKey,
        consumerSecret,
        tokenId,
        tokenSecret
      )
      break
    case '3':
      await setNsCredentials3(
        accountId,
        consumerKey,
        consumerSecret,
        tokenId,
        tokenSecret
      )
      break
    case '4':
      await setNsCredentials4(
        accountId,
        consumerKey,
        consumerSecret,
        tokenId,
        tokenSecret
      )
      break
    case '5':
      await setNsCredentials5(
        accountId,
        consumerKey,
        consumerSecret,
        tokenId,
        tokenSecret
      )
      break
    default:
      break
  }
  document.getElementById('form-user').reset()
  setTimeout(() => {
    renderAccount()
  }, 2000)
})
function setNsCredentials1(
  accountId,
  consumerKey,
  consumerSecret,
  tokenId,
  tokenSecret
) {
  client.metadata().then(metadata => {
    let id = metadata.appId === 0 ? 500882 : metadata.appId
    let settings2 = {
      url: '/api/v2/apps/installations.json?include=app',
      type: 'GET',
      dataType: 'json',
    }
    client.request(settings2).then(
      function (data) {
        data.installations.forEach(e => {
          if (e.app_id === id) {
            let settings = {
              url: `/api/v2/apps/installations/${e.id}`,
              type: 'PUT',
              data: {
                settings: {
                  AccountId1: accountId,
                  ConsumerKey1: consumerKey,
                  ConsumerSecret1: consumerSecret,
                  TokenId1: tokenId,
                  TokenSecret1: tokenSecret,
                },
              },
              dataType: 'json',
            }
            client.request(settings).then(
              function (data) {
                reload(client)
              },
              function (response) {}
            )
          }
        })
      },
      function (response) {}
    )
  })
}
function setNsCredentials2(
  accountId,
  consumerKey,
  consumerSecret,
  tokenId,
  tokenSecret
) {
  client.metadata().then(metadata => {
    let id = metadata.appId === 0 ? 500882 : metadata.appId
    let settings2 = {
      url: '/api/v2/apps/installations.json?include=app',
      type: 'GET',
      dataType: 'json',
    }
    client.request(settings2).then(
      function (data) {
        data.installations.forEach(e => {
          if (e.app_id === id) {
            let settings = {
              url: `/api/v2/apps/installations/${e.id}`,
              type: 'PUT',
              data: {
                settings: {
                  AccountId2: accountId,
                  ConsumerKey2: consumerKey,
                  ConsumerSecret2: consumerSecret,
                  TokenId2: tokenId,
                  TokenSecret2: tokenSecret,
                },
              },
              dataType: 'json',
            }
            client.request(settings).then(
              function (data) {
                reload(client)
              },
              function (response) {}
            )
          }
        })
      },
      function (response) {}
    )
  })
}
function setNsCredentials3(
  accountId,
  consumerKey,
  consumerSecret,
  tokenId,
  tokenSecret
) {
  client.metadata().then(metadata => {
    let id = metadata.appId === 0 ? 500882 : metadata.appId
    let settings2 = {
      url: '/api/v2/apps/installations.json?include=app',
      type: 'GET',
      dataType: 'json',
    }
    client.request(settings2).then(
      function (data) {
        data.installations.forEach(e => {
          if (e.app_id === id) {
            let settings = {
              url: `/api/v2/apps/installations/${e.id}`,
              type: 'PUT',
              data: {
                settings: {
                  AccountId3: accountId,
                  ConsumerKey3: consumerKey,
                  ConsumerSecret3: consumerSecret,
                  TokenId3: tokenId,
                  TokenSecret3: tokenSecret,
                },
              },
              dataType: 'json',
            }
            client.request(settings).then(
              function (data) {
                reload(client)
              },
              function (response) {}
            )
          }
        })
      },
      function (response) {}
    )
  })
}
function setNsCredentials4(
  accountId,
  consumerKey,
  consumerSecret,
  tokenId,
  tokenSecret
) {
  client.metadata().then(metadata => {
    let id = metadata.appId === 0 ? 500882 : metadata.appId
    let settings2 = {
      url: '/api/v2/apps/installations.json?include=app',
      type: 'GET',
      dataType: 'json',
    }
    client.request(settings2).then(
      function (data) {
        data.installations.forEach(e => {
          if (e.app_id === id) {
            let settings = {
              url: `/api/v2/apps/installations/${e.id}`,
              type: 'PUT',
              data: {
                settings: {
                  AccountId4: accountId,
                  ConsumerKey4: consumerKey,
                  ConsumerSecret4: consumerSecret,
                  TokenId4: tokenId,
                  TokenSecret4: tokenSecret,
                },
              },
              dataType: 'json',
            }
            client.request(settings).then(
              function (data) {
                reload(client)
              },
              function (response) {}
            )
          }
        })
      },
      function (response) {}
    )
  })
}
function setNsCredentials5(
  accountId,
  consumerKey,
  consumerSecret,
  tokenId,
  tokenSecret
) {
  client.metadata().then(metadata => {
    let id = metadata.appId === 0 ? 500882 : metadata.appId
    let settings2 = {
      url: '/api/v2/apps/installations.json?include=app',
      type: 'GET',
      dataType: 'json',
    }
    client.request(settings2).then(
      function (data) {
        data.installations.forEach(e => {
          if (e.app_id === id) {
            let settings = {
              url: `/api/v2/apps/installations/${e.id}`,
              type: 'PUT',
              data: {
                settings: {
                  AccountId5: accountId,
                  ConsumerKey5: consumerKey,
                  ConsumerSecret5: consumerSecret,
                  TokenId5: tokenId,
                  TokenSecret5: tokenSecret,
                },
              },
              dataType: 'json',
            }
            client.request(settings).then(
              function (data) {
                reload(client)
              },
              function (response) {}
            )
          }
        })
      },
      function (response) {}
    )
  })
}

// agrega los grupos al manifest
function addGroup() {
  let groupsRequest = document.getElementById('select-groups').value
  if (!groupsRequestAppropve.includes(groupsRequest)) {
    groupsRequestAppropve.push(groupsRequest)
  }
  rendergroup(groupsRequestAppropve)
  setgroup(groupsRequestAppropve.join())
}
function addGroup2() {
  let groupsRequest = document.getElementById('select-groups-2').value
  if (!groupsApprove.includes(groupsRequest)) {
    groupsApprove.push(groupsRequest)
  }
  rendergroup2(groupsApprove)
  setgroup2(groupsApprove.join())
}
//renders
function rendergroup(groupsRequestAppropve) {
  const groupsList = document.querySelector('.groups-request-list')
  groupsList.innerHTML = ''
  let i = 0
  groupsRequestAppropve.forEach(group => {
    const li = document.createElement('li')
    li.className = 'bundle-li'
    li.innerHTML = `
        <span class="w-75 pt-0 os-14 ps-2">${group}</span>
        <div class="btn-group dropdown w-25">
          <button type="button" class="btn-up dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
          <ul class="dropdown-menu">
            <li><button class=" os-14 dropdown-item" onclick="removeGroupsRequestAppropve('${group}','${i}')" data-value="${i}" id="bundle-delete">Remove</button></li>
        </div>`
    groupsList.appendChild(li)
    i++
  })
}
function rendergroup2(groupsApprove) {
  const groupsList = document.querySelector('.groups-approval-list')
  groupsList.innerHTML = ''
  let i = 0
  groupsApprove.forEach(group => {
    const li = document.createElement('li')
    li.className = 'bundle-li'
    li.innerHTML = `
        <span class="w-75 os-14 pt-o ps-2">${group}</span>
        <div class="btn-group dropdown w-25">
          <button type="button" class="btn-up dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
          <ul class="dropdown-menu">
            <li><button class="os-14 dropdown-item" onclick="removeGroupsAppropve('${group}','${i}')" data-value="${i}" id="bundle-delete">Remove</button></li>
        </div>`
    groupsList.appendChild(li)
    i++
  })
}
//elimina de los grupos
function removeGroupsRequestAppropve(name, i) {
  groupsRequestAppropve.splice(i, 1)
  setgroup(groupsRequestAppropve.join())
  rendergroup(groupsRequestAppropve)
}
function removeGroupsAppropve(name, i) {
  groupsApprove.splice(i, 1)
  setgroup2(groupsApprove.join())
  rendergroup2(groupsApprove)
}
//setea en el manifest los grupos
function setgroup(requestApproveGroups) {
  if (requestApproveGroups.length === 0) {
    requestApproveGroups = 'null'
  }
  client.metadata().then(metadata => {
    let id = metadata.appId === 0 ? 500882 : metadata.appId
    let settings2 = {
      url: '/api/v2/apps/installations.json?include=app',
      type: 'GET',
      dataType: 'json',
    }
    client.request(settings2).then(
      function (data) {
        data.installations.forEach(e => {
          if (e.app_id === id) {
            let settings = {
              url: `/api/v2/apps/installations/${e.id}`,
              type: 'PUT',
              data: {
                settings: {
                  requestApproveGroups: requestApproveGroups,
                },
              },
              dataType: 'json',
            }
            client.request(settings).then(
              function (data) {
                reload(client)
              },
              function (response) {}
            )
          }
        })
      },
      function (response) {}
    )
  })
}
function setgroup2(approveGroups) {
  if (approveGroups.length === 0) {
    approveGroups = 'null'
  }
  client.metadata().then(metadata => {
    let id = metadata.appId === 0 ? 500882 : metadata.appId
    let settings2 = {
      url: '/api/v2/apps/installations.json?include=app',
      type: 'GET',
      dataType: 'json',
    }
    client.request(settings2).then(
      function (data) {
        data.installations.forEach(e => {
          if (e.app_id === id) {
            let settings = {
              url: `/api/v2/apps/installations/${e.id}`,
              type: 'PUT',
              data: {
                settings: {
                  approveGroups: approveGroups,
                },
              },
              dataType: 'json',
            }
            client.request(settings).then(
              function (data) {
                reload(client)
              },
              function (response) {}
            )
          }
        })
      },
      function (response) {}
    )
  })
}
function setapprovalProcess(approvalProcess) {
  client.metadata().then(metadata => {
    let id = metadata.appId === 0 ? 502876 : metadata.appId
    let settings2 = {
      url: '/api/v2/apps/installations.json?include=app',
      type: 'GET',
      dataType: 'json',
    }
    client.request(settings2).then(
      function (data) {
        data.installations.forEach(e => {
          if (e.app_id === id) {
            let settings = {
              url: `/api/v2/apps/installations/${e.id}`,
              type: 'PUT',
              data: {
                settings: {
                  approvalProcess: approvalProcess,
                },
              },
              dataType: 'json',
            }
            client.request(settings).then(
              function (data) {
                setTimeout(() => {
                  $(' #loader').css('display', 'hidden').fadeOut(2000)
                }, 2000)
                reload(client)
              },
              function (response) {}
            )
          }
        })
      },
      function (response) {}
    )
  })
}
// muestra los botones seun el rol de usuario
client.get('currentUser').then(async function (data) {
  if (data['currentUser'].role === 'admin') {
  } else {
    $('#pills-credentials').addClass('hid')
    $('#pills-group').addClass('hid')
  }
})
let settings = {
  url: ' /api/v2/groups',
  type: 'GET',
  dataType: 'json',
}
client.request(settings).then(function (data) {
  data.groups.forEach(e => {
    //groups
    const option = document.createElement('option')
    const option2 = document.createElement('option')
    option2.value = e.name
    option2.innerHTML = e.name
    option.value = e.name
    option.innerHTML = e.name
    document.querySelector('#select-groups').appendChild(option)
    document.querySelector('#select-groups-2').appendChild(option2)
  })
})
//select('In SP Netsuite')
// select approval process
function select(selectedValues) {
  for (const option of document.querySelectorAll('.custom-option')) {
    if (option.classList.contains('selected')) {
      option.classList.remove('selected')
    }
    if (option.textContent == selectedValues) {
      option.classList.add('selected')
    } else {
      document.querySelector('#default').classList.add('selected')
      document.querySelector('.custom-select__trigger span').textContent =
        selectedValues
    }
  }
}
document
  .querySelector('.custom-select-wrapper')
  .addEventListener('click', function () {
    this.querySelector('.custom-select').classList.toggle('open')
  })
for (const option of document.querySelectorAll('.custom-option')) {
  option.addEventListener('click', function () {
    if (!this.classList.contains('selected')) {
      document.querySelector('#default').classList.remove('selected')
      this.parentNode
        .querySelector('.custom-option')
        .classList.remove('selected')
      this.classList.add('selected')
      this.closest('.custom-select').querySelector(
        '.custom-select__trigger span'
      ).textContent = this.textContent
      $('#loader').css('opacity', '1')
      setapprovalProcess(this.textContent)
    }
  })
}
window.addEventListener('click', function (e) {
  const select = document.querySelector('.custom-select')
  if (!select.contains(e.target)) {
    select.classList.remove('open')
  }
})
setTimeout(() => {
  loader1.addClass('loader1')
  loader2.addClass('loader-pane1')
  renderAccount()
}, 2000)
function renderAccount() {
  let accContainer = document.querySelector('#acc-container')
  accContainer.innerHTML = ''
  client.metadata().then(async function (metadata) {
    let id = metadata.appId === 0 ? 500882 : metadata.appId
    let settings2 = {
      url: '/api/v2/apps/installations.json?include=app',
      type: 'GET',
      dataType: 'json',
    }
    await client.request(settings2).then(
      function (data) {
        data.installations.forEach(e => {
          if (e.app_id === id) {
            let settings = {
              url: `/api/v2/apps/installations/${e.id}`,
              type: 'PUT',
              dataType: 'json',
            }
            client.request(settings).then(
              async function (data) {
                await data.settings_objects.forEach(element => {
                  for (let i = 1; i < 6; i++) {
                    if (createArrAcount(i).includes(element.name)) {
                      let arr = createArrAcount(i)
                      if (element.value !== null) {
                        if (element.name === arr[0]) {
                          let div = document.createElement('div')
                          div.className = 'col-4'
                          div.innerHTML = `
                                                            <div class="acc-ns">
                                                                <h2 class="os-16 p-0 mt-auto mb-2 fw-bold ">Accoutn ${i}</h2>
                                                                <h2 class="os-14 p-0 mb-auto fw-bold">${element.value}</h2>
                                                                <div class="btn-acc dropdown w-25">
                                                                    <button type="button" class="btn-config dropdown-toggle" data-bs-toggle="dropdown"
                                                                    aria-expanded="false"></button>
                                                                    <ul class="dropdown-menu">
                                                                        <li><button class=" os-14 dropdown-item" onclick="removeAccount('${i}')" data-value=""
                                                                        id="acc-delete">Remove account</button>
                                                                    </li>
                                                                </div>
                                                            </div>  `
                          accContainer.appendChild(div)
                        }
                      }
                    }
                  }
                })
                $('#loader-pane #loader')
                  .removeClass('loader1')
                  .trigger('enable')
                $('#loader-pane').removeClass('loader-pane1')
              },
              function (response) {}
            )
          }
        })
      },
      function (response) {}
    )
  })
  function createArrAcount(i) {
    let arrCredentials = []
    arrCredentials.push(`AccountId${i}`)
    arrCredentials.push(`ConsumerKey${i}`)
    arrCredentials.push(`ConsumerSecret${i}`)
    arrCredentials.push(`TokenId${i}`)
    arrCredentials.push(`TokenSecret${i}`)
    return arrCredentials
  }
}
async function removeAccount(accountNumber) {
  loader1.addClass('loader1')
  loader2.addClass('loader-pane1')
  switch (accountNumber) {
    case '1':
      await setNsCredentials1('', '', '', '', '')
      break
    case '2':
      await setNsCredentials2('', '', '', '', '')
      break
    case '3':
      await setNsCredentials3('', '', '', '', '')
      break
    case '4':
      await setNsCredentials4('', '', '', '', '')
      break
    case '5':
      await setNsCredentials5('', '', '', '', '')
      break

    default:
      break
  }
  setTimeout(() => {
    renderAccount()
  }, 2000)
}

function reload(client) {
  var topBarClientPromise = client
    .get('instances')
    .then(function (instancesData) {
      var instances = instancesData.instances
      for (var instanceGuid in instances) {
        if (instances[instanceGuid].location === 'ticket_sidebar') {
          return client.instance(instanceGuid)
        }
      }
    })
  topBarClientPromise.then(function (topBarClient) {
    topBarClient.trigger('reload')
  })
}
