//client init
var client = ZAFClient.init()
client.metadata().then(function (metadata) {})
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

      if (results.status === 'failed') {
        notifications('primary', results.message)
      }


      if (results.status === 'success') {


        callback(results)
        //notifications('info', results.status)


      }
      removeLoader()
      $('#existing-customizations.bundle-id-lista #loader').removeClass('loader').trigger('enable')
      $('#existing-customizations.bundle-id-lista #loader-pane').removeClass('loader-pane')

      $(`#bundle-id.bundle-id-lista #loader`).removeClass('loader').trigger('enable')
      $('#bundle-id.bundle-id-lista #loader-pane').removeClass('loader-pane')

      $(`#proposed-customizations #loader`).removeClass('loader').trigger('enable')
      $('#proposed-customizations #loader-pane').removeClass('loader-pane')
    })
    .catch()
}
document
  .querySelector('#modal')
  .addEventListener('submit', this.onModalSubmit.bind())
//SUBMIT
function onModalSubmit() {
  event.preventDefault()
  submitData()
}
function submitData() {
  $('#proposed-customizations #loader').addClass('loader')
  $('#proposed-customizations #loader-pane').addClass('loader-pane')
  // //addCostumization propose NS
  const result = getFormData()
  const createdProposed = {
    proposed: result,
    ticketID: localStorage.getItem('zendesk-tiquet-id'),
  }
  const scriptDeploy = 'flo_cr_api'
  const action = 'addCustomizations'
  const callback = results => {
    if (results.proposedCusts != '') {
      localStorage.setItem(
        'ProposedCustomization',
        JSON.stringify(results.proposedCusts.split(','))
      )
    } else {
      localStorage.setItem('ProposedCustomization', JSON.stringify([]))
    }
    client.invoke('destroy')
  }
  transmitToNetsuite(scriptDeploy, action, createdProposed, callback)
}
$('#inp-type').change(function () {
  var prefix = $(this).val()
  if (prefix != '99999') {
    document.getElementById('inp-scriptid').value = $(this).val() + '_'
  } else {
    document.getElementById('inp-scriptid').value = ''
  }
})
function getFormData() {
  return (scriptid = document.getElementById('inp-scriptid').value)
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


function removeLoader() {
  if ($(`#loader`)) {
    $(`#loader`).removeClass('loader').trigger('enable')
    $('#loader-pane').removeClass('loader-pane')
  }
}