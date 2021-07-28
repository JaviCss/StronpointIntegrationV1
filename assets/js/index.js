//VARIABLES
let bundlesList = []
let existingCustom = {}
let existingProp = {}
let name, scriptid, bundleid, type, from, to
let ticketNumber
let ticketSubject
let ticketDescription
let ticketStatus
let statusNS
let linkCR
let bundleID = 0
let crId
let client = ZAFClient.init()
client.invoke('resize', { width: '100%', height: '900px' })
client.on('reload', function () {
  setTimeout(() => {
    start(client)
  }, 1300)
})
start(client)

var httpMethod = 'GET'
function start(client) {
  try {

    client.get('ticket').then(async function (data) {

      userData = await getCurrentUser()
      userName = userData?.name
      ticketNumber = data.ticket.id.toString()
      ticketSubject = data.ticket.subject
      ticketDescription = data.ticket.description
      ticketStatus = data.ticket.status

      client.metadata().then(metadata => {
        let id = metadata.appId
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
                  dataType: 'json',
                }
                client.request(settings).then(
                  async function (data) {
                    let approverGroups = data.settings.approveGroups
                    let requestApproveGroups = data.settings.requestApproveGroups
                    let approvalProcess = data.settings.approvalProcess
                    requestApproveGroups = requestApproveGroups.split(',')
                    approverGroups = approverGroups.split(',')
                    approvalProcess = approvalProcess.split(',')
                    let isOperator
                    userData?.groups.forEach(e => {
                      if (requestApproveGroups.includes(e.name)) {
                        isOperator = requestApproveGroups.includes(e.name)
                        return
                      }
                    })
                    let isAdministrator
                    userData?.groups.forEach(e => {
                      if (approverGroups.includes(e.name)) {
                        isAdministrator = approverGroups.includes(e.name)
                        return
                      }
                    })
                    // showInfo(data, userName)
                    showHome(data)
                    document.getElementById('btn-request').style.display = 'none'
                    document.getElementById('btn-approved').style.display = 'none'
                    document.getElementById('btn-reject').style.display = 'none'
                    document.getElementById('btn-close-status').style.display = 'none'
                    document.getElementById('btn-push').style.display = 'none'
                    await getManifest(client)
                    getNameAcc()
                    getCustomizations(isOperator, isAdministrator, approvalProcess)







                  },
                  function (response) { }
                )
              }
            })
          },
          function (response) { }
        )
      })


    })
  } catch (error) { }
}
//Connection with netsuite
async function getNameAcc() {
  const scriptDeploy = 'flo_get_account_name_type'
  $('#info #loader').addClass('loader')
  $('#info #loader-pane').addClass('loader-pane')
  const params = await client.metadata().then(async metadata => {
    let id = metadata.appId
    let settings2 = {
      url: '/api/v2/apps/installations.json?include=app',
      type: 'GET',
      dataType: 'json',
    }
    let params1 = await client.request(settings2).then(
      async function (data) {
        let params3
        for (let index = 0; index < data.installations.length; index++) {
          if (data.installations[index].app_id === id) {
            let settings = {
              url: `/api/v2/apps/installations/${data.installations[index].id}`,
              type: 'GET',
              dataType: 'json',
            }
            params3 = await client.request(settings).then(
              function (dat) {
                let acc = []
                accountId = dat.settings.AccountId
                consumerKey = dat.settings.ConsumerKey
                consumerSecret = dat.settings.ConsumerSecret
                tokenId = dat.settings.TokenId
                tokenSecret = dat.settings.TokenSecret
                acc.push(accountId)
                acc.push(consumerKey)
                acc.push(consumerSecret)
                acc.push(tokenId)
                acc.push(tokenSecret)
                return acc
              },
              function (response) { }
            )
          }
        }
        return params3
      },
      function (response) { }
    )
    accountId = params1[0]
    consumerKey = params1[1]
    consumerSecret = params1[2]
    tokenId = params1[3]
    tokenSecret = params1[4]
    return serviceNestsuite(
      `https://${accountId.toLowerCase()}.restlets.api.netsuite.com`,
      accountId,
      consumerKey,
      consumerSecret,
      tokenId,
      tokenSecret,
      `/app/site/hosting/restlet.nl?script=customscript_${scriptDeploy}&deploy=1`,
      `/app/site/hosting/restlet.nl?script=customscript_${scriptDeploy}&deploy=1`
    )
  })

  client
    .request(params)
    .then(results => {
      let res = JSON.parse(results)
      $('#synchronized').text(res.companyname)
    })
    .catch(e => { })
}
function getCustomizations(isOperator, isAdministrator, approvalProcess) {
  const scriptDeploy = 'flo_cr_api'
  const action = 'getCRData'
  const ticketId = { ticketID: ticketNumber }


  const callback = results => {
    let policyApplied = results.policyApplied
    let levelRequired = results.clReq
    $('#synchronized').text()
    $('#policy').text(policyApplied)
    $('#level').text(levelRequired)
    crId = results.crId
    localStorage.setItem('crId', crId)
    bundlesList =
      results.affectedBundleID === '' ? [] : results.affectedBundleID.split(',')
    linkCR = results.link
    statusNS = results.statusBarState
    if (statusNS == '') {
      document.querySelector('#statusNS').textContent = 'N/S'
    } else {
      document.querySelector('#statusNS').textContent = statusNS
    }

    var element = document.getElementById('linkCR')
    element.href = linkCR
    let existingList = []
    results.custIds.forEach((id, idx) => {
      existingList.push({ name: results.custNames[idx], id: id })
    })
    if (
      isOperator &&
      ['', 'Not Started', 'In Progress'].includes(results.statusBarState) &&
      ['SP Approval In Zendesk', 'SP Approval In NetSuite'].includes(approvalProcess[0]) &&
      true
    ) {
      document.getElementById('btn-request').style.display = 'flex'
      // document.getElementById('btn-reject').style.display = 'flex';
    }
    if (
      isAdministrator &&
      results.statusBarState === 'Pending Approval' &&
      ['SP Approval In Zendesk'].includes(approvalProcess[0]) &&
      true
    ) {
      document.getElementById('btn-approved').style.display = 'flex'
      document.getElementById('btn-reject').style.display = 'flex'
    }
    // close
    if (
      isAdministrator &&
      results.statusBarState === 'Approved' &&
      ['SP Approval In Zendesk', 'No Approval Needed'].includes(approvalProcess[0]) &&
      true
    ) {
      document.getElementById('btn-close-status').style.display = 'flex'
    }
    // push

    if (
      isAdministrator &&
      !['Completed', 'Rejected', 'Cancelled', 'Approved'].includes(
        results.statusBarState
      ) && ['No Approval Needed'].includes(approvalProcess[0]) &&
      true
    ) {
      document.getElementById('btn-push').style.display = 'flex'
    }



    localStorage.setItem(
      'selectedCustomizationValues',
      JSON.stringify(existingList)
    )
    if (results.proposedCusts != '') {
      localStorage.setItem(
        'ProposedCustomization',
        JSON.stringify(results.proposedCusts.split(','))
      )
    } else {
      localStorage.setItem('ProposedCustomization', JSON.stringify([]))
    }
    renderlookup()
    renderProposed()
    renderBundle()
  }
  const callbackError = e => {
    if (isOperator) {
      document.getElementById('btn-request').style.display = 'flex'
      document.getElementById('btn-reject').style.display = 'flex'
    }
  }
  transmitToNetsuite(scriptDeploy, action, ticketId, callback, callbackError)
}
async function updateTicketStatus(newState) {
  const scriptDeploy = 'flo_cr_api'
  const action = 'createCR'
  const params = {
    ticketID: ticketNumber,
    changeNum: ticketSubject,
    description: ticketDescription,
    state: newState,
  }
  const callback = results => {
    statusNS = results.statusBarState
    start(client)
  }
  await transmitToNetsuite(scriptDeploy, action, params, callback)
}

function setPathEndoded(baseObject) {
  var result = ''
  Object.entries(baseObject).forEach(([item, prop]) => {
    if (prop && prop.trim() !== '')
      result += `${result.length > 0 ? '&' : ''}${item}=${encodeURIComponent(prop.trim())}`
  })
  return result
}





async function transmitToNetsuite(
  scriptDeploy,
  action,
  formValues,
  callback,
  callbackError
) {
  $('#info #loader').addClass('loader')
  $('#info #loader-pane').addClass('loader-pane')
  // Function to unify transmitions of differents actions with netsuit
  // url is the current Rest Domain Base
  // accId is the currect account Id
  // key and secret is the current consumer Key and Secret
  // tokId and tokSecret is the current Id and Secret of token
  // scriptDeploy is the current script using into netsuit
  // action is the action to be executed
  // formValues is the object with the data to be transmited to NetSuite into path
  // callback is the callback to be used when all work as expected
  function setPath(baseObject) {
    var result = ''
    Object.entries(baseObject).forEach(([item, prop]) => {
      if (prop && prop.trim() !== '')
        result += `${result.length > 0 ? '&' : ''}${item}=${prop.trim()}`
    })
    return result
  }
  const params = await client.metadata().then(async metadata => {
    let id = metadata.appId
    let settings2 = {
      url: '/api/v2/apps/installations.json?include=app',
      type: 'GET',
      dataType: 'json',
    }
    let params1 = await client.request(settings2).then(
      async function (data) {
        let params3
        for (let index = 0; index < data.installations.length; index++) {
          if (data.installations[index].app_id === id) {
            let settings = {
              url: `/api/v2/apps/installations/${data.installations[index].id}`,
              type: 'GET',
              dataType: 'json',
            }
            params3 = await client.request(settings).then(
              function (dat) {
                let acc = []
                accountId = dat.settings.AccountId
                consumerKey = dat.settings.ConsumerKey
                consumerSecret = dat.settings.ConsumerSecret
                tokenId = dat.settings.TokenId
                tokenSecret = dat.settings.TokenSecret
                acc.push(accountId)
                acc.push(consumerKey)
                acc.push(consumerSecret)
                acc.push(tokenId)
                acc.push(tokenSecret)
                return acc
              },
              function (response) { }
            )
          }
        }
        return params3
      },
      function (response) { }
    )
    if (params1[0] === null) {
      accountId = ''
    } else {
      accountId = params1[0]
    }
    consumerKey = params1[1]
    consumerSecret = params1[2]
    tokenId = params1[3]
    tokenSecret = params1[4]

    return serviceNestsuite(
      `https://${accountId.toLowerCase()}.restlets.api.netsuite.com`,
      accountId,
      consumerKey,
      consumerSecret,
      tokenId,
      tokenSecret,
      `/app/site/hosting/restlet.nl?script=customscript_${scriptDeploy}&deploy=customdeploy_${scriptDeploy}&action=${action}&${setPath(
        formValues
      )}`,
      `/app/site/hosting/restlet.nl?script=customscript_${scriptDeploy}&deploy=customdeploy_${scriptDeploy}&action=${action}&${setPathEndoded(
        formValues
      )}`

    )

  })
  client
    .request(params)
    .then(results => {
      const elementos = document.querySelectorAll('.statusbar')
      if (results.status === 'success') {
        removeLoader()
      }
      if (!results.inactive) {
        for (i = 0; i < elementos.length; i++) {
          elementos[i].classList.remove('hid')
          elementos[i].classList.add('vis')
        }

        const elementos2 = document.querySelectorAll('#infoNs')
        for (i = 0; i < elementos2.length; i++) {
          elementos2[i].classList.remove('hid')
          elementos2[i].classList.add('vis')
        }

      } else {
        for (i = 0; i < elementos.length; i++) {
          elementos[i].classList.add('hid')
          elementos[i].classList.remove('vis')
        }
      }
      if (results.status === 'failed') {
        notifications('primary', results.message)
      }


      if (results.status === 'success') {


        callback(results)
        // notifications('info', results.status)
        removeLoader()

      }
      removeLoader()
      $('#existing-customizations.bundle-id-lista #loader').removeClass('loader').trigger('enable')
      $('#existing-customizations.bundle-id-lista #loader-pane').removeClass('loader-pane')

      $(`#bundle-id.bundle-id-lista #loader`).removeClass('loader').trigger('enable')
      $('#bundle-id.bundle-id-lista #loader-pane').removeClass('loader-pane')

      $(`#proposed-customizations #loader`).removeClass('loader').trigger('enable')
      $('#proposed-customizations #loader-pane').removeClass('loader-pane')

    })
    .catch(e => {
      const elementos = document.querySelectorAll('#infoNs')
      for (i = 0; i < elementos.length; i++) {
        elementos[i].classList.remove('vis')
        elementos[i].classList.add('hid')
      }
      if (e.statusText === 'error') {
        removeLoader()
      }
      removeLoader()
    })
}
function serviceNestsuite(
  domainBase,
  account_id,
  consumer_key,
  consumer_secret,
  token_id,
  token_secret,
  path,
  pathEncoded
) {
  function generateTbaHeader(
    domainBase,
    accountId,
    consumerKey,
    consumerSecret,
    tokenId,
    tokenSecret,
    httpMethod
  ) {

    httpMethod =
      httpMethod == undefined || httpMethod == null ? 'GET' : httpMethod
    var base_url = domainBase.split('?')[0]
    var query_params = domainBase.split('?')[1]
    var params = query_params.split('&')
    var parameters = {}
    for (var i = 0; i < params.length; i++) {
      parameters[params[i].split('=')[0]] = params[i].split('=')[1]
    }
    var token = {
      key: tokenId,
      secret: tokenSecret,
    }
    var oauth = new OAuth({
      consumer: {
        key: consumerKey,
        secret: consumerSecret,
      },
      signature_method: 'HMAC-SHA256',
      hash_function: function (base_string, key) {
        return CryptoJS.HmacSHA256(base_string, key).toString(
          CryptoJS.enc.Base64
        )
      },
    })
    var request_data = {
      url: base_url,
      method: httpMethod,
      data: parameters,
    }
    var headerWithRealm = oauth.toHeader(oauth.authorize(request_data, token))
    headerWithRealm.Authorization += ',realm="' + accountId + '"'
    return headerWithRealm
  }
  var restUrl = domainBase + path
  //OPTIONS CREATION
  var headerWithRealm = generateTbaHeader(
    restUrl,
    account_id,
    consumer_key,
    consumer_secret,
    token_id,
    token_secret
  )
  let urln = domainBase + pathEncoded
  let options = {
    url: urln,
    type: 'GET',
    headers: headerWithRealm,
    cors: false,
    contentType: 'application/json',
  }
  return options
}

function getManifest(client) {
  $('#info #loader').addClass('loader')
  $('#info #loader-pane').addClass('loader-pane')
  $('#select-acc-ui').change(function () {
    var estado = $('#select-acc-ui').val()
    $('#info #loader').addClass('loader')
    $('#info #loader-pane').addClass('loader-pane')
    client.metadata().then(metadata => {
      let id = metadata.appId

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
                type: 'GET',
                dataType: 'json',
              }
              client.request(settings).then(
                function (data) {
                  let AccountId
                  let ConsumerKey
                  let ConsumerSecret
                  let TokenId
                  let TokenSecret
                  data.settings_objects.forEach(async function (setting) {
                    if (setting.name === 'AccountId' + estado) {
                      AccountId = setting.value
                    }
                    if (setting.name === 'ConsumerKey' + estado) {
                      ConsumerKey = setting.value
                    }
                    if (setting.name === 'ConsumerSecret' + estado) {
                      ConsumerSecret = setting.value
                    }
                    if (setting.name === 'TokenId' + estado) {
                      TokenId = setting.value
                    }
                    if (setting.name === 'TokenSecret' + estado) {
                      TokenSecret = setting.value
                    }
                  })
                  let settings3 = {
                    url: `/api/v2/apps/installations/${e.id}`,
                    type: 'PUT',
                    dataType: 'json',
                    data: {
                      settings: {
                        AccountId: AccountId,
                        ConsumerKey: ConsumerKey,
                        ConsumerSecret: ConsumerSecret,
                        TokenId: TokenId,
                        TokenSecret: TokenSecret,
                      },
                    },
                  }
                  client.request(settings3).then(
                    function (dataS) { },
                    function (response) { }
                  )
                },
                function (response) { }
              )
            }
          })
        },
        function (response) { }
      )
    })
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
    $('#select-acc-ui option').removeAttr('selected')
    $(this).attr({ selected: true })
    $('#select-acc-ui').html($('option:selected', this).text())
  })
  //completa el dropbox
  client.metadata().then(metadata => {
    let id = metadata.appId

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
              dataType: 'json',
            }
            client.request(settings).then(
              async function (data) {
                document.querySelector('#select-acc-ui').innerHTML = ''
                await data.settings_objects.forEach(element => {
                  for (let i = 1; i < 6; i++) {
                    if (createArrAcount(i).includes(element.name)) {
                      // let arr = createArrAcount(i)
                      if (element.value !== null) {
                        if (
                          [
                            'AccountId1',
                            'AccountId2',
                            'AccountId3',
                            'AccountId4',
                            'AccountId5',
                          ].includes(element.name)
                        ) {
                          const select =
                            document.querySelector('#select-acc-ui')
                          const option = document.createElement('option')
                          option.value = i
                          option.className = 'option-acc'
                          option.innerHTML = `${element.name}: ${element.value}`
                          select.appendChild(option)
                        }
                      }
                    }
                  }
                  if (['AccountId'].includes(element.name)) {
                    const select = document.querySelector('#select-acc-ui')
                    const option = document.createElement('option')
                    option.value = 0
                    option.className = 'option-acc'
                    option.innerHTML = `Selected Account ID: ${element.value}`
                    option.selected = true
                    select.appendChild(option)
                  }
                })
              },
              function (response) { }
            )
          }
        })
      },
      function (response) { }
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
/*SHOW INFO */
function showInfo(data, userName) {
  let requester_data = {
    title: data.ticket.raw_subject,
    id: data.ticket.id,
    priority: data.ticket.priority,
    state: data.ticket.status,
    type: data.ticket.type,
    userName: userName,
  }
  let source = $('#info-template').html()
  let template = Handlebars.compile(source)
  let html = template(requester_data)
  $('#info').html(html)
}
/*SHOW HOME */
function showHome(data) {
  let requester_data = {}
  let source = $('#home-template').html()
  let template = Handlebars.compile(source)
  let html = template(requester_data)
  $('#home').html(html)
  let btn2 = document.getElementById('proposed')
  btn2.addEventListener('click', () => {
    popModal('assets/modal.html', '440')
  })
  let btn3 = document.getElementById('lookup')
  btn3.addEventListener('click', () => {
    popModal('assets/modalList.html', '240')
  })
  let btn4 = document.getElementById('btn-impact')
  btn4.addEventListener('click', () => {
    popModal('assets/modalImpact.html', '550')
  })
}
/*ERRORES */
function showError(response) {
  let error_data = {
    status: response.status,
    statusText: response.statusText,
  }
  let source = $('#error-template').html()
  let template = Handlebars.compile(source)
  let html = template(error_data)
  $('#content').html(html)
}
function renderlookup() {
  let existingList = document.querySelector('.lookup-list')
  existingList.innerHTML = ''
  let selectedCustomizationValues = JSON.parse(
    localStorage.getItem('selectedCustomizationValues')
  )
  selectedCustomizationValues.forEach(item => {
    const url = `https://${accountId}.app.netsuite.com/c.${accountId}/suitebundle294336/FLODocs%20Enterprise/FLOEntryScreens.html?STAGE=custframe&customizationid=${item.id}`
    const li = document.createElement('li')
    li.className = 'bundle-li'
    li.innerHTML = `      
    <span class="w-75 ps-2">${item.name}</span>
      <div class="btn-group dropdown w-25">
        <button type="button" class="btn-up dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul class="dropdown-menu">
          <li><button class="dropdown-item" onclick="clickDeleteLookup('${item.id}', '${item.name}')" id="bundle-delete">Remove</button></li>
          <li> 
          <a target="_blank" onclick="erd('${url}')">
          <button class="dropdown-item" id="ver-erd">ERD</button>
          </a>
          </li>
          </div>`
    existingList.appendChild(li)
  })
  localStorage.removeItem('selectedCustomizationValues')
}
function erd(url) {
  window.open(url, '_blank')
}
//Existing Customizations
function removeExistingCustomization(existingName, existingId) {
  const scriptDeploy = 'flo_cr_api'
  const action = 'removeCustomization'
  const params = {
    ticketID: ticketNumber,
    isExisting: 'true',
    existing: existingName,
    custoInternalId: existingId,
  }
  const callback = async results => {
    let existingList = []
    if (results.custIds) {
      results.custIds.forEach((id, idx) => {
        existingList.push({ name: results.custNames[idx], id: id })
      })
    }

    await localStorage.setItem(
      'selectedCustomizationValues',
      JSON.stringify(existingList)
    )
    renderlookup()
    $('#existing-customizations.bundle-id-lista #loader')
      .removeClass('loader')
      .trigger('enable')
    $('#existing-customizations.bundle-id-lista #loader-pane').removeClass(
      'loader-pane'
    )
  }
  transmitToNetsuite(scriptDeploy, action, params, callback)
}
function clickDeleteLookup(id, name) {
  $('#existing-customizations.bundle-id-lista #loader').addClass('loader')
  $('#existing-customizations.bundle-id-lista #loader-pane').addClass(
    'loader-pane'
  )
  const selectedCustomizationValues = JSON.parse(
    localStorage.getItem('selectedCustomizationValues')
  )
  removeExistingCustomization(name, id)
}
//Proposed Customization
function renderProposed() {
  let bundleLista = document.querySelector('.proposed-lista')
  bundleLista.innerHTML = ''
  let ProposedCustomization = JSON.parse(
    localStorage.getItem('ProposedCustomization')
  )
  let i = 0
  ProposedCustomization.forEach(item => {
    const li = document.createElement('li')
    li.className = 'bundle-li'
    li.innerHTML = `      
    <span class="w-75 ps-2">${item}</span>
    <div class="btn-group dropdown w-25">
    <button type="button" class="btn-up dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
    <ul class="dropdown-menu">
          <li><button class="dropdown-item" onclick="clickDeleteProposed('${item}')" data-value="${i}" id="bundle-delete">Remove</button></li>
          </div>`
    bundleLista.appendChild(li)
    i++
  })
  localStorage.removeItem('ProposedCustomization')
}
function removeProposed(proposedName) {
  $('#proposed-customizations.bundle-id-lista #loader').addClass('loader')
  $('#proposed-customizations.bundle-id-lista #loader-pane').addClass(
    'loader-pane'
  )
  const scriptDeploy = 'flo_cr_api'
  const action = 'removeCustomization'
  const params = {
    ticketID: ticketNumber,
    isExisting: '',
    existing: proposedName,
  }
  const callback = results => {
    if (results.proposedCusts != '') {
      localStorage.setItem(
        'ProposedCustomization',
        JSON.stringify(results.proposedCusts.split(','))
      )
    } else {
      localStorage.setItem('ProposedCustomization', JSON.stringify([]))
    }
    renderProposed()
    $(`#proposed-customizations #loader`)
      .removeClass('loader')
      .trigger('enable')
    $('#proposed-customizations #loader-pane').removeClass('loader-pane')
  }
  transmitToNetsuite(scriptDeploy, action, params, callback)
}
function clickDeleteProposed(name) {
  removeProposed(name)
}
/*BUNDLE*/
function renderBundle() {
  const bundlesRender = document.querySelector('.bundle-list')
  bundlesRender.innerHTML = ''
  let i = 0
  bundlesList.forEach(bundle => {
    const li = document.createElement('li')
    li.className = 'bundle-li'
    li.innerHTML = `
      <span class="w-75 ps-2">${bundle}</span>
      <div class="btn-group dropdown w-25">
        <button type="button" class="btn-up dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul class="dropdown-menu">
          <li><button class="dropdown-item" onclick="removeBundle('${bundle}')" data-value="${i}" id="bundle-delete">Remove</button></li>
      </div>`
    bundlesRender.appendChild(li)
    i++
  })
  $(`#bundle-id.bundle-id-lista #loader`)
    .removeClass('loader')
    .trigger('enable')
  $('#bundle-id.bundle-id-lista #loader-pane').removeClass('loader-pane')
}
function addBundle() {
  //valida los dats del input
  //compara si esta vacio
  if ($('#inp-bundle')[0].value !== '') {
    //compara si es un numero
    if (!isNaN($('#inp-bundle')[0].value)) {
      //compara si tiene mas de 6 digitos
      if ($('#inp-bundle')[0].value.length > 0) {
        //activa y desactiva el boton
        $('#bundle-id.bundle-id-lista #loader').addClass('loader')
        $('#bundle-id.bundle-id-lista #loader-pane').addClass('loader-pane')
        $('.btn-plus').prop('disabled', true)
        $('#bundle-id.bundle-id-lista #loader').on('enable', function () {
          $('.btn-plus').prop('disabled', false)
        })
        //obtiene el valor
        bundleID = document.getElementById('inp-bundle').value
        $('#inp-bundle')[0].value = ''
        //scryt de NS
        const params = {
          bundleId: bundleID,
          ticketID: ticketNumber,
        }
        const scriptDeploy = 'flo_cr_api'
        const action = 'addBundleId'
        const callback = async results => {
          bundlesList =
            results.affectedBundleID === ''
              ? []
              : results.affectedBundleID.split(',')
          renderBundle()
          start(client)
        }
        transmitToNetsuite(scriptDeploy, action, params, callback)
        $('#errorBundle')[0].innerHTML = ''
      } else {
        $('#errorBundle')[0].innerHTML = '<p>You must enter six numbers</p>'
      }
    } else {
      $('#errorBundle')[0].innerHTML = '<p>You must enter a number</p>'
    }
  } else {
    $('#errorBundle')[0].innerHTML = '<p>You must enter a bundle ID</p>'
  }
}
function removeBundle(bundleID) {
  $('#bundle-id.bundle-id-lista #loader').addClass('loader')
  $('#bundle-id.bundle-id-lista #loader-pane').addClass('loader-pane')
  const scriptDeploy = 'flo_cr_api'
  const action = 'removeBundleId'
  const params = {
    ticketID: ticketNumber,
    bundleId: bundleID,
  }
  const callback = results => {
    if (results.affectedBundleID !== '') {
      bundlesList =
        results.affectedBundleID === ''
          ? []
          : results.affectedBundleID.split(',')
      renderBundle()
    } else {
      bundlesList =
        results.affectedBundleID === ''
          ? []
          : results.affectedBundleID.split(',')
      renderBundle()
    }
    renderBundle()
  }
  transmitToNetsuite(scriptDeploy, action, params, callback)
}
//zendesk user data
var userData = ''
var userName = ''
function getCurrentUser() {
  return client.get('currentUser').then(async function (data) {
    return data['currentUser']
  })
}
/*LOGIN*/
function loginUser(client, id) {
  let settings = {
    url: '/api/v2/tickets',
    type: 'GET',
    dataType: 'json',
  }
  client.request(settings).then(
    function (data) {
      showHome(data)
    },
    function (response) {
      showError(response)
    }
  )
}
function popModal(url, h) {
  localStorage.removeItem('zendesk-tiquet-id')
  localStorage.setItem('zendesk-tiquet-id', ticketNumber)
  client
    .invoke('instances.create', {
      location: 'modal',
      url: url,
      size: { width: '750px', height: h },
    })
    .then(function (modalContext) {
      // The modal is on the screen now!
      var modalClient = client.instance(
        modalContext['instances.create'][0].instanceGuid
      )
      client.on('instance.registered', function () { })
      modalClient.on('modal.close', function () {
        if (localStorage.getItem('selectedCustomizationValues')) {
          renderlookup()
          start(client)
        }
        if (localStorage.getItem('ProposedCustomization')) {
          renderProposed()
          start(client)
        }
        // The modal has been closed.
      })
    })
}
function changeStatus(action) {
  switch (action) {
    case 'request':
      updateTicketStatus('PendingApproval')
      break
    case 'approved':
      updateTicketStatus('Approve')
      break
    case 'reject':
      updateTicketStatus('Reject')
      break
    case 'close':
      updateTicketStatus('Closed')
      break
    default:
      break
  }
}
function removeLoader() {
  if ($(`#loader`)) {
    $(`#loader`).removeClass('loader').trigger('enable')
    $('#loader-pane').removeClass('loader-pane')
  }
}






// notificaciones
function notifications(type, message) {
  $.showNotification({
    body: message,
    duration: 3000,
    type: type,
    maxWidth: "300px",
    shadow: "0 2px 6px rgba(0,0,0,0.2)",
    zIndex: 100,
    margin: "1rem"
  })
}

