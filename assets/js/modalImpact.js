let client = ZAFClient.init()
let ticketId
let accountId
impactAnalisis()
async function impactAnalisis() {
  $('#pills-tabContent #loader').addClass('loader')
  $('#pills-tabContent #loader-pane').addClass('loader-pane')
  const scriptDeploy = 'flo_impact_analysis_restlet'
  const callback = response => {
    let impact_analysis_data = JSON.parse(response)
    impact_analysis_data = impact_analysis_data.data
    if (impact_analysis_data === null) {
      $('.impact-analisis').innerHtml =
        '<table class="aui" style="size:10px"><tbody><tr><td>No Impact Analysis data</td></tr></tbody></table>'
      removeLoader()
    } else {
      let safe_data = impact_analysis_data.safe
      let not_safe_data = impact_analysis_data.notSafe
      let not_active_data = impact_analysis_data.notActive
      let pillsSafe = document.querySelector('#pills-safe')
      let pillsNotsafe = document.querySelector('#pills-notsafe')
      let pillsInactive = document.querySelector('#pills-inactive')
      if (safe_data.length !== 0) {
        let dataSafe = document.querySelector('.data-safe')
        dataSafe.innerHTML = ''
        safe_data.forEach(element => {
          const tr = document.createElement('tr')
          tr.className = 'look-tr'
          tr.innerHTML = `  
                                  <td class=" item d-flex w-100 my-auto justify-content-center">
                                      <p class="os-12 my-auto">${element.name}</p>
                                  </td>                                  
                                  `
          dataSafe.appendChild(tr)
          let anchor = document.querySelectorAll('.item p a')
          anchor.forEach(e => {
            e.className = 'item-url'
            e.host = `${accountId}`
          })
        })
      } else {
        pillsSafe.innerHTML =
          '<p class="os-16 fw-bold mt-5">No information available to display</p>'
      }
      if (not_safe_data.length !== 0) {
        let dataNotsafe = document.querySelector('.data-notsafe')
        dataNotsafe.innerHTML = ''
        not_safe_data.forEach(element => {
          const tr = document.createElement('tr')
          tr.className = 'look-tr'
          tr.innerHTML = `  <td class=" item d-flex w-60">
                                        <p class="os-12 my-auto">${element.object}</p></td>
                                      <td class=" item d-flex w-40 my-auto">
                                          <p class="os-12 my-auto">${element.warning}</p>
                                      </td>
                                      <td class=" item d-flex w-40 my-auto">
                                          <p class="os-12 my-auto">${element.impactedlinks}</p>
                                      </td>
                                      `
          dataNotsafe.appendChild(tr)
          let anchor = document.querySelectorAll('.item p a')
          anchor.forEach(e => {
            e.className = 'item-url'
            e.host = `${accountId}`
          })
        })
      } else {
        pillsNotsafe.innerHTML =
          '<p class="os-16 fw-bold mt-5">No information available to display</p>'
      }
      if (not_active_data.length != 0) {
        let dataNotsafe = document.querySelector('.data-inactive')
        dataNotsafe.innerHTML = ''
        not_safe_data.forEach(element => {
          const tr = document.createElement('tr')
          tr.className = 'look-tr'
          tr.innerHTML = `  <td class=" item d-flex w-60">
                                        <p class="os-12 my-auto">${element.name}</p></td>
                                      <td class=" item d-flex w-40 my-auto">
                                          <p class="os-12 my-auto">${element.scriptid}</p>
                                      </td> `
          dataNotsafe.appendChild(tr)
          let anchor = document.querySelectorAll('.item p a')
          anchor.forEach(e => {
            e.className = 'item-url'
            e.host = `${accountId}`
          })
        })
      } else {
        pillsInactive.innerHTML =
          '<p class="os-16 fw-bold mt-5">No information available to display</p>'
      }
    }
  }
  const callbackError = e => {}
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
    ticketId = localStorage.getItem('crId')
    return serviceNestsuite(
      `https://${accountId.toLowerCase()}.restlets.api.netsuite.com`,
      accountId,
      consumerKey,
      consumerSecret,
      tokenId,
      tokenSecret,
      `/app/site/hosting/restlet.nl?script=customscript_${scriptDeploy}&deploy=customdeploy_${scriptDeploy}&crId=${ticketId}`
    )
  })
  client
    .request(params)
    .then(results => {
      let result = JSON.parse(results)
      if (result.message === 'success') {
        removeLoader()
      }
      callback(results)
    })
    .catch(e => {
      callbackError(e)
      if (e.statusText === 'error') {
        removeLoader()
      }
    })
}
function removeLoader() {
  if ($(`#loader`)) {
    $(`#loader`).removeClass('loader').trigger('enable')
    $('#loader-pane').removeClass('loader-pane')
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
    let base_url = domainBase.split('?')[0]
    let query_params = domainBase.split('?')[1]
    let params = query_params.split('&')
    let parameters = {}
    for (let i = 0; i < params.length; i++) {
      parameters[params[i].split('=')[0]] = params[i].split('=')[1]
    }
    let token = {
      key: tokenId,
      secret: tokenSecret,
    }
    let oauth = new OAuth({
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
    let request_data = {
      url: base_url,
      method: httpMethod,
      data: parameters,
    }
    let headerWithRealm = oauth.toHeader(oauth.authorize(request_data, token))
    headerWithRealm.Authorization += ',realm="' + accountId + '"'
    return headerWithRealm
  }
  let restUrl = domainBase + path
  //OPTIONS CREATION
  let headerWithRealm = generateTbaHeader(
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
