//client init
var client = ZAFClient.init()
localStorage.setItem('filter1', '[]')
$('#mod-inner #loader').addClass('loader')
$('#mod-inner #loader-pane').addClass('loader-pane')
document
  .querySelector('#modal')
  .addEventListener('submit', this.onModalSubmit.bind())
var httpMethod = 'GET'
/// EDITANDO EMI FER
async function transmitToNetsuite(scriptDeploy, action, formValues, callback) {
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
      if (prop.trim() !== '')
        result += `${result.length > 0 ? '&' : ''}${item}=${prop.trim()}`
    })
    return result
  }
  const params = await client.metadata().then(async metadata => {
    let id = metadata.appId === 0 ? 502876 : metadata.appId
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
              function (response) {}
            )
          }
        }
        return params3
      },
      function (response) {}
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
      `/app/site/hosting/restlet.nl?script=customscript_${scriptDeploy}&deploy=customdeploy_${scriptDeploy}&action=${action}&${setPath(
        formValues
      )}`
    )
  })
  client
    .request(params)
    .then(results => {
      callback(results)
      removeLoader()
    })
    .catch(e => {
      removeLoader()
    })
}
//SELECT MODIFY BY
function getModifyBy() {
  const selectOptions = { value: 'customer' }
  const scriptDeploy = 'flo_customization_api'
  const action = 'allEmployees'
  const callback = results => {
    objectResp = JSON.parse(results)
    const impmodif = document.querySelector('#inp-modif')
    impmodif.innerHTML = objectResp.results
  }
  transmitToNetsuite(scriptDeploy, action, selectOptions, callback)
}
getModifyBy()
//SUBMIT
function onModalSubmit() {
  document.querySelector('#modal').classList.add('colapse')
  document.querySelector('.header').classList.add('colapse')
  document.querySelector('.header2').classList.add('visible')
  document.querySelector('.header2').classList.remove('colapse')
  document.querySelector('.header').classList.add('pb-0')
  document.querySelector('.header').classList.remove('pb-4')
  document.querySelector('.look-list').classList.remove('colapse')
  event.preventDefault()
  getFilterData()
}
function getFilterData() {
  //agrega el loader
  $('#mod-inner #loader').addClass('loader')
  $('#mod-inner #loader-pane').addClass('loader-pane')
  //obtiene los datos del formulario
  const filter = obtData()
  //arama la llamada de modified by
  const scriptDeploy = 'flo_customization_api'
  const action = 'search'
  const callback = results => {
    objectResp = JSON.parse(results)
    objectResp = objectResp.results
    renderlook(objectResp)
  }
  transmitToNetsuite(scriptDeploy, action, filter, callback)
}
function formatDate(date1) {
  let fechaFrom = ''
  if (date1 === '') {
  } else {
    var cdate = new Date(date1)
    var options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }
    date = cdate.toLocaleDateString('es-ar', options)
    date1 = date.split('/')
    //estrae el año
    let month = date1[1]
    let day = date1[0] + 1
    let year = Array.from(date1[2])
    year.splice(0, 2)
    fechaFrom = `${month}/${day}/ ${year[0]}${year[1]}`
  }
  return fechaFrom
}
function obtData() {
  value = document.getElementById('inp-name').value
  modifiedby = document.getElementById('inp-modif').value
  scriptid = document.getElementById('inp-scriptid').value
  type = document.getElementById('inp-type').value
  bundleid = document.getElementById('inp-bundleid').value
  from = document.getElementById('inp-date-from').value
  to = document.getElementById('inp-date-to').value
  from = formatDate(from)
  var r = {
    value: value,
    modifiedby: modifiedby,
    scriptId: scriptid,
    type: type,
    bundleId: bundleid,
    from: from,
    to: to,
  }
  return r
}
function renderlook(res) {
  let resultList = document.querySelector('.resultList')
  resultList.innerHTML = ''
  for (let i = 0; i < res.length; i++) {
    if (res[i] !== '') {
      const tr = document.createElement('tr')
      tr.className = 'look-tr'
      tr.innerHTML = `
                        <td headers="name" class="d-flex w-60">
                            <input type="checkbox" class="lookupSelectedCusts my-auto check" name="lookupSelectedCusts" value="${res[i].values.name}" data-id="${res[i].id}">
                            <span class="my-auto os-12">${res[i].values.name}</span>                            
                        </td>
                        <td class="look-th d-flex w-40">
                            <p class="os-12"><i>${res[i].values.custrecord_flo_cust_id}</i></p>
                        </td>`
      resultList.appendChild(tr)
    }
  }
}
function addCustom() {
  $('#mod-inner #loader').addClass('loader')
  $('#mod-inner #loader-pane').addClass('loader-pane')
  let existingId = ''
  let inputs = $('.check')
  $('.check').each(i => {
    if (inputs[i].checked) {
      existingId += `${existingId.length > 0 ? ',' : ''}${inputs[i].dataset.id}`
    }
  })
  //addCostumization existing NS
  const selectedCustom = {
    existing: existingId,
    ticketID: localStorage.getItem('zendesk-tiquet-id'),
  }
  const scriptDeploy = 'flo_cr_api'
  const action = 'addCustomizations'
  const callback = results => {
    let existingList = []
    results.custIds.forEach((id, idx) => {
      existingList.push({ name: results.custNames[idx], id: id })
    })
    localStorage.setItem(
      'selectedCustomizationValues',
      JSON.stringify(existingList)
    )
    client.invoke('destroy')
  }
  transmitToNetsuite(scriptDeploy, action, selectedCustom, callback)
}
function checkAll(source) {
  let checkboxes = document.querySelectorAll('input[type="checkbox"]')
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i] != source) checkboxes[i].checked = source.checked
  }
}
function serviceNestsuite(
  domainBase,
  account_id,
  consumer_key,
  consumer_secret,
  token_id,
  token_secret,
  path
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
  let options = {
    url: restUrl,
    type: 'GET',
    headers: headerWithRealm,
    cors: false,
    contentType: 'application/json',
  }
  return options
}
function removeLoader() {
  if ($(`#mod-inner #loader`)) {
    $('#mod-inner #loader').removeClass('loader').trigger('enable')
    $('#mod-inner #loader-pane').removeClass('loader-pane')
  }
}
