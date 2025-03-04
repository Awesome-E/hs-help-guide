// Change URL Without Page Reload
/* window.onhashchange = window.onload = function(evt) {
  //On New Location
  //document.getElementById('location').innerHTML = window.location.href;
};

var anchors = document.getElementsByClassName('noRedirect');
var historyState = {};
var base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);

for (var i = 0; i < anchors.length; i++) {
  //Only apply this to same domain links
  if (anchors[i].href.substring(0, location.origin.length) !== location.origin) {
    continue;
  }

  anchors[i].addEventListener('click', function(evt) {
    evt.preventDefault();

    //Change to new page with hash
    var newPage = window.location.href + '#' + evt.target.href.replace(base, '');
    window.location.href = newPage;

    //Remove hash from URL and replace with desired URL
    if (history && history.pushState) {
      //Only do this if history.pushState is supported by the browser
      history.pushState(historyState, evt.target.innerHTML, evt.target.href)
    }
  });
}

/* The Code Above Stops Reloads for Selected Elements */
function setLocation (href) {
  // If Else Statement
  history.pushState ? history.pushState(null, null, href) : location.hash = href
}

function replaceLocation (href) {
  history.replaceState ? history.replaceState(null, null, href) : location.hash = href
}

// Access Cookies
function setCookie (cname, cvalue, exdays) {
  const d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  const expires = 'expires=' + d.toGMTString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

function getCookie (cname) {
  const name = cname + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

// Manage Preferences
// eslint-disable-next-line no-var
let LS_ACCESS = true; var prefs
try {
  // eslint-disable-next-line no-var, no-redeclare
  var prefs
  function updatePrefs () {
    prefs = JSON.parse(localStorage.getItem('preferences') || '{"dark_mode":false,"x-ray_default":false,"no_rick":false,"replace_fullscreen":false,"old_sounds":false,"new_avatars":false,"no_unload_confirm":false,"channel_sort":"","retro_pTiles":""}')
  }
  updatePrefs()
} catch (e) {
  // If the Local Storage is unreachable
  prefs = '{"dark_mode":false,"x-ray_default":false,"no_rick":false,"replace_fullscreen":false,"old_sounds":false,"new_avatars":false,"no_unload_confirm":false,"channel_sort":"","retro_pTiles":""}'
  LS_ACCESS = false
}
function getPref (name) {
  return LS_ACCESS ? updatePrefs() || !!prefs[name] : false
}
function prefVal (name) {
  return LS_ACCESS ? updatePrefs() || prefs[name] || '' : ''
}

function setPref (name, bool) {
  if (!LS_ACCESS) return console.error(new DOMException('Could not save preference'))
  prefs[name] = bool
  localStorage.setItem('preferences', JSON.stringify(prefs))
}

// Go to Homepage
function home () {
  setCookie('lastPage', '', 30)
  window.location.href = '../'
};

// Add site visit via counter
function addSiteVisit (branch) {
  branch = branch || ''
  const xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log('Visit Added')
    }
  }
  xhttp.open('GET', 'https://counter.websiteout.net/compte.php?S=' + encodeURI('https://ae-hopscotch.github.io/hs-tools/visits/' + branch) + '&C=6&D=0&N=0&M=0', true)
  xhttp.send()
}

const lastPageExceptions = /https:\/\/ae-hopscotch\.github\.io\/hs-tools\/?($|play-project|explore-channel\/about)/
if (!lastPageExceptions.test(window.location.href) && self === top) setCookie('lastPage', window.location.href, 30)
if (getCookie('visitedWithinHour') !== 'true' && /https:\/\/ae-hopscotch.github.io\/hs-tools\//gi.test(location.href)) {
  if (window.location.href !== 'https://ae-hopscotch.github.io/hs-tools/') addSiteVisit(location.href.replace(/.*?hs-tools\//, ''))
  addSiteVisit()
}
setCookie('visitedWithinHour', 'true', 0.04)

try {
  // Define Scroll End Function
  $.fn.scrollEnd = function (callback, timeout) {
    $(this).scroll(function () {
      const $this = $(this)
      if ($this.data('scrollTimeout')) {
        clearTimeout($this.data('scrollTimeout'))
      }
      $this.data('scrollTimeout', setTimeout(callback, timeout))
    })
  }

  // If there is an element with class "save-scroll", then set the hash to the nearest element
  $(window).scrollEnd(function () {
    let headings = document.querySelector('.save-scroll')
    if (headings != null) {
      headings = headings.querySelectorAll('h2[id], h3[id]')
      const headingPositions = {}
      const offset = 305 - document.getElementById(headings[0].id).getBoundingClientRect().top
      for (let i = 0; i < headings.length; i++) {
        headingPositions[Math.floor((document.getElementById(headings[i].id).getBoundingClientRect().top + offset) / 2) * 2] = headings[i].id
      }

      // When the Scroll Stops, set hash to the closest heading not passed yet
      function closest (arr, val) {
        return Math.max.apply(null, arr.filter(function (v) { return v <= val }))
      }
      const hash = headingPositions[String(closest(Object.keys(headingPositions), Math.abs(document.body.getBoundingClientRect().top)))] || ''
      // (String(window.location.href.match(RegExp("#" + hash))) != "null")
      if (window.location.href.replace(/.*?#/, '') !== hash) {
        // Set Hash if Different
        replaceLocation('#' + hash)
        setCookie('lastPage', window.location.href, 30)
      }
      // console.log(window.location.href);
    }
  }, 100)
} catch (ReferenceError) {
  console.warn('jQuery is not installed - scroll functions will not work')
}

// Remove Elements
Element.prototype.remove = function () {
  this.parentElement.removeChild(this)
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
  for (let i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i])
    }
  }
}

// String Functions
// eslint-disable-next-line no-extend-native
String.prototype.htmlEscape = function () {
  return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

// Object Functions
Object.detach = function (o) {
  return JSON.parse(JSON.stringify(o))
}

// Space or Enter -> Click Child Element
// eslint-disable-next-line camelcase
function add_keyboardClickChild (elm) {
  elm.addEventListener('keydown', function (event) { if (event.keyCode === 13 || event.keyCode === 32) elm.querySelector('*').click() })
}
document.querySelectorAll('*[AE-STCE]').forEach(function (elm) {
  add_keyboardClickChild(elm)
})

// Space or Enter -> Click Current Element
// eslint-disable-next-line camelcase
function add_keyboardClickElement (elm) {
  elm.addEventListener('keydown', function (event) { if (event.keyCode === 13 || event.keyCode === 32) elm.click() })
}
document.querySelectorAll('*[AE-STSE]').forEach(function (elm) {
  add_keyboardClickElement(elm)
})

// For Each but with output
// eslint-disable-next-line no-extend-native
Array.prototype.repeatEach = NodeList.prototype.repeatEach = HTMLCollection.prototype.repeatEach = function (fn) {
  const outputs = []
  if (!(fn && typeof fn === 'function')) throw new TypeError(fn + ' is not a function')
  for (let i = 0; i < this.length; i++) {
    outputs.push(fn(this[i]))
  }
  return outputs
}
// eslint-disable-next-line no-extend-native
Array.prototype.removeNull = NodeList.prototype.removeNull = HTMLCollection.prototype.removeNull = function () {
  const outputs = []
  for (let i = 0; i < this.length; i++) {
    if (this[i] != null) outputs.push(this[i])
  }
  return outputs
}

// Remove Duplicates
function removeDuplicates (arr) {
  arr.splice(0, arr.length, ...(new Set(arr)))
  return arr
};

// Copy Text
function copyText (val) {
  const copyTextArea = document.createElement('textarea')
  copyTextArea.value = val
  document.body.appendChild(copyTextArea)
  copyTextArea.select()
  copyTextArea.setSelectionRange(0, 9999999) // Mobile
  document.execCommand('copy')
  document.body.removeChild(copyTextArea)
}

// Better Base 64
// eslint-disable-next-line no-var
var Base64 = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  encode: function (e) {
    let t = ''
    let n, r, i, s, o, u, a
    let f = 0
    e = Base64._utf8_encode(e)
    while (f < e.length) {
      n = e.charCodeAt(f++)
      r = e.charCodeAt(f++)
      i = e.charCodeAt(f++)
      s = n >> 2
      o = (n & 3) << 4 | r >> 4
      u = (r & 15) << 2 | i >> 6
      a = i & 63
      if (isNaN(r)) {
        u = a = 64
      } else if (isNaN(i)) {
        a = 64
      }
      t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
    }
    return t
  },
  decode: function (e) {
    let t = ''
    let n, r, i
    let s, o, u, a
    let f = 0
    e = e.replace(/[^A-Za-z0-9+/=]/g, '')
    while (f < e.length) {
      s = this._keyStr.indexOf(e.charAt(f++))
      o = this._keyStr.indexOf(e.charAt(f++))
      u = this._keyStr.indexOf(e.charAt(f++))
      a = this._keyStr.indexOf(e.charAt(f++))
      n = s << 2 | o >> 4
      r = (o & 15) << 4 | u >> 2
      i = (u & 3) << 6 | a
      t = t + String.fromCharCode(n)
      if (u !== 64) {
        t = t + String.fromCharCode(r)
      }
      if (a !== 64) {
        t = t + String.fromCharCode(i)
      }
    }
    t = Base64._utf8_decode(t)
    return t
  },
  _utf8_encode: function (e) {
    e = e.replace(/\r\n/g, '\n')
    let t = ''
    for (let n = 0; n < e.length; n++) {
      const r = e.charCodeAt(n)
      if (r < 128) {
        t += String.fromCharCode(r)
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode(r >> 6 | 192)
        t += String.fromCharCode(r & 63 | 128)
      } else {
        t += String.fromCharCode(r >> 12 | 224)
        t += String.fromCharCode(r >> 6 & 63 | 128)
        t += String.fromCharCode(r & 63 | 128)
      }
    }
    return t
  },
  _utf8_decode: function (e) {
    let t = ''
    let n = 0
    let r = c1 = c2 = 0
    while (n < e.length) {
      r = e.charCodeAt(n)
      if (r < 128) {
        t += String.fromCharCode(r)
        n++
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1)
        t += String.fromCharCode((r & 31) << 6 | c2 & 63)
        n += 2
      } else {
        c2 = e.charCodeAt(n + 1)
        c3 = e.charCodeAt(n + 2)
        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
        n += 3
      }
    }
    return t
  }
}

// Requests
// eslint-disable-next-line no-var
var XHR = {
  sendReq: function (options, printResult, ca) {
    const x = new XMLHttpRequest()
    x.open(options.method, ((ca) ? 'https://cors-anywhere.herokuapp.com/' : '') + options.url)
    x.onload = x.onerror = function () {
      printResult(x.responseText || '', x.status)
    }
    if (/^POST/i.test(options.method)) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }
    x.send(options.data)
  },
  // eslint-disable-next-line camelcase
  request: function (input_method, input_url, fn, ca) {
    if (ca === null) ca = true
    busy = true
    XHR.sendReq({
      method: input_method,
      url: input_url
    }, fn, ca)
  },
  get: function (url, fn, ca) {
    if (ca == null) ca = true
    busy = true
    XHR.sendReq({
      method: 'GET',
      url: url
    }, fn, ca)
  },
  fetch: function (url, fn, useAllOrigins) {
    fetch((useAllOrigins) ? location.protocol + '//api.allorigins.win/get?url=' + encodeURIComponent(url) : url)
      .then(response => {
        if (response.ok) return response.json()
        throw new Error('Network response was not ok.')
      })
      .then(data => fn(data.contents, data.status.http_code))
      .catch(() => fn(null, 521))
  },
  requestExt: async function (method, url, callback, proxy, data, headers) {
    proxy = proxy || 0
    const proxyList = [
      '',
      'all',
      'https://corsproxy.io/?url=',
      'https://api.codetabs.com/v1/proxy?quest=',
      'https://api.allorigins.win/raw?url='
    ]
    if (proxy !== 1) {
      const encoded = proxy === 2 ? encodeURIComponent(url) : url
      fetch(proxyList[proxy] + encoded, {
        method,
        body: method === 'GET' ? undefined : data,
        headers
      }).then(async x => [await x.text(), x.status])
        .then(([text, status]) => callback(text, status))
        .catch(() => callback(null, 521))
      return
    }

    for (base of proxyList.slice(2)) {
      let error
      const query = base === proxyList[2] ? encodeURIComponent(url) : url
      const response = await fetch(base + query, {
        method,
        body: method === 'GET' ? undefined : data,
        headers
      }).then(async x => [await x.text(), x.status])
        .catch(e => { error = e })
      if (!response || error) continue
      return callback(response[0], response[1])
    }
    // All options failed
    callback(null, 521)
  }
}

function storageAccess () {
  try { return !!localStorage } catch (e) { return !1 }
}
