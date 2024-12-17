// 전역 변수 및 AJAX 호출 전에 실행되는 해시 파싱 코드 (메뉴 옵션용)

var LIVE = false, // 초기화 완료 전까지 API 호출 안 함
    VERBOSE = false, // 상세 콘솔 보고: URL 끝에 '&verbose' 추가 후 새로고침
    API_URL = '';

var t0 = performance.now();
var sources_loaded = 0;

// 타이머/디버깅 함수
function clog(msg) {
  var report = Math.round(performance.now() - t0) / 1000 + ' - ' + msg;
  console.log(report);
}

function xp() {
  for (var i = 0; i < QKEYS.length; i++) {
    console.log(QKEYS[i] + ': "' + query[QKEYS[i]] + '"');
  }
}

function c(x) {
  return JSON.parse(JSON.stringify(x));
}

// 시간/날짜 전역 변수
var end_date = moment(new Date());
var start_date = moment("2017-01-01 0:00 +0000", "YYYY-MM-DD HH:mm Z");
var dtft = 'DD-MMM-YYYY'; // 날짜 형식

// 비교 분석 전역 변수
var compare_mode = false;
var datasets = {};
var dataname;

// API 인수를 관리하는 딕셔너리. 절대 수정 금지 - 키의 순서가 시스템 무결성에 중요함
var query = {
  'api': 'doc', // 'doc' 또는 'geo' 또는 'tv'
  // 공통 DOC/GEO (QUERY) 인수
  'query': '', 'domain': '',
  'sourcecountry': '', 'sourcelang': '', 'theme': '', 'tone': '', 'toneabs': '',
  // GEO QUERY 인수
  'geonear': '', 'geolocationcc': '', 'geolocationadm1': '', 'geolocation': '',

  // DOC CONTENT 전용 인수
  'contentmode': 'ArtList', 'maxrecords': '75', 'trans': false, 'sort': '',
  // DOC TIMELINE 전용 인수
  'timelinemode': 'TimelineVol', 'timelinesmooth': '0', 'timezoom': '',
  // DOC CONTENT & TIMELINE 인수
  'format': '', 'timespan': '1d', 'startdatetime': '', 'enddatetime': '', 'searchlang': '',
  // GEO 전용 인수
  'geomode': 'PointData', 'geoformat': '', 'geotimespan': '1d', 'geogeores': '',
  // 특별 처리 인수
  'domainis': false,

};

var QKEYS = Object.keys(query).slice(); // 쿼리 딕셔너리 키의 고정 배열

// 쿼리 딕셔너리와 해시 문자열을 업데이트하는 함수
function update_query(u_key, u_val, buildhash = true) {
  if (VERBOSE) clog('업데이트 중 ' + u_key + '을/를 ' + u_val + '으로');
  u_key = u_key.replace(/#/gi, ''); // 해시 기호 제거
  if (typeof(u_val) !== typeof(true) && !u_val.length) { u_val = ''; } // 빈 배열 값 처리 (불리언 제외)
  if (u_key === 'timelinesmooth' && u_val === 0) { u_val = ''; }
  query[u_key] = u_val;

  // 시간 모드 토글
  if (query.timespan === '') {
    $('#datetime').prop('disabled', false);
  } else {
    $('#datetime').prop('disabled', true);
  }

  if (buildhash) { // 해시 빌드 시 API 호출
    action_query();
    iframe_zoom(2);
  }
}

// 새로운 쿼리를 조정하는 함수
function action_query() {
  if (VERBOSE) { clog('action_query'); }
  var new_qry = build_hash();
  API_URL = api_call(new_qry.keys);
  location.href = '#' + new_qry.hash;

  // iframe 위에 쿼리 문자열과 태그 표시
  var title = query.query;
  if (query.theme) { title += ' themes: ' + query.theme; }
  title = title.replace(/,/gi, ', '); // 쉼표 뒤에 공백 추가
  $("#iframe_title").text(title);

  // URL 링크와 iframe 소스 업데이트
  $("#gdelt_api_call").text(API_URL).attr("href", c(API_URL));
  if (LIVE) {
    if (API_URL.indexOf('TrendingTopics') > -1) { // 커스텀 템플릿 처리
      API_URL = API_URL.replace(/&format=[^&]+/, '&format=json');
      if (API_URL.indexOf('&format=') === -1) API_URL += '&format=json';
      $("#iframe_title").text('TV의 트렌딩 주제 및 문구');
      console.log(API_URL);
      $("#gdelt_iframe").attr("src", './trending_topics.html');
      return;
    }
    $("#gdelt_iframe").attr("src", API_URL);
  }
}

// 해시 문자열을 빌드하여 쿼리 딕셔너리로 다시 파싱할 수 있게 하는 함수
function build_hash() {
  if (VERBOSE && ['doc', 'geo', 'tv'].indexOf(query.api) === -1) {
    alert('query.api는 doc, geo 또는 tv 중 하나여야 함');
  }

  let api_keys;
  if (current_tab === 'tab_content') {
    api_keys = QKEYS.slice(0, 14).concat(QKEYS.slice(23, 27)).concat(QKEYS.slice(30, 35));
  }
  if (current_tab === 'tab_timeline') {
    api_keys = QKEYS.slice(0, 14).concat(QKEYS.slice(27, 30)).concat(QKEYS.slice(30, 35));
  }
  if (current_tab === 'tab_geo') {
    api_keys = QKEYS.slice(0, 18).concat(QKEYS.slice(35, 39));
  }
  if (current_tab === 'tab_tv') {
    api_keys = QKEYS.slice(0, 2).concat(QKEYS.slice(18, 23)).concat(QKEYS.slice(28, 29)).concat(QKEYS.slice(30, 34)).concat(QKEYS.slice(40, 45));
  }
  if (current_tab !== 'tab_geo') {
    if (query.timespan) { api_keys.splice(api_keys.indexOf('startdatetime'), 2); }
  }
  if (query.domainis) { api_keys.push('domainis'); }

  var hash = 'api=' + query.api;
  for (var i = 1; i < api_keys.length; i++) {
    var key = api_keys[i];
    if (query[key] || key === 'query') { hash += '&' + key + '=' + query[key]; }
  }
  return { 'keys': api_keys, 'hash': hash };
}

// API 호출을 위한 키/값 쌍을 형식화하는 함수
function format_arg(k, v, sig) {
  if (k === 'domain') { return 'domain:.' + v + '%20OR%20domainis:' + v; }
  if (v.substr(0, 1) === '-') { return '-' + k + sig + v.substr(1); }
  return k + sig + v;
}

// GDELT API 호출을 구성하는 함수
function api_call(k) {
  var call = 'https://api.gdeltproject.org/api/v2/';
  call += query.api + '/' + query.api + '?query=' + query.query;
  for (var i = 2; i < k.length; i++) { // 'api'/'query' 인수 제외
    var val = query[k[i]];
    var key = c(k[i]).replace(/^[a-zA-Z]+mode/g, 'mode').replace(/^geo/g, ''); // xxxmode 및 'geo..' 접두사 제거

    if (!val || val.length === 0) { continue; } // 빈 또는 false 인수 건너뜀
    if (key === 'trans' && val) { call += '&trans=googtrans'; continue; }
    if (key === 'domain' && val && query.domainis) {
      key = 'domainis'; // 체크박스 true 시 인수 변경
    } else {
      if (key === 'domainis') { continue; } // 'domain'에 의해 이미 처리됨
    }

    var ind = QKEYS.indexOf(k[i]);
    var sep = (ind >= 23) ? '&' : '%20';
    var sig = (ind >= 23) ? '=' : ':';
    if (!$.isArray(val)) { val = [val]; } // 배열로 변환

    if (val.length === 1) { // 단일 인수 경우
      if (key === 'context') { val[0] = '"' + val[0] + '"'; } // TV API 컨텍스트 인수는 따옴표 필요
      if (key === 'domain') {
        call += sep + '(' + format_arg(key, val[0], sig) + ')'; // 도메인은 API 특성상 복잡한 쿼리
      } else {
        call += sep + format_arg(key, val[0], sig);
      }
    } else { // 다중 인수 경우
      var signs = [];
      for (var j = 0; j < val.length; j++) { signs.push(val[j].substr(0, 1) === '-'); }
      var all_neg = signs.every(function(x) { return x; });

      if (all_neg) { // 모든 음수를 AND로 해석
        for (var j = 0; j < val.length; j++) { call += sep + format_arg(key, val[j], sig); }
      } else { // 모든 양수를 OR로 해석
        call += sep + '(' + format_arg(key, val[0], sig);
        for (var j = 1; j < val.length; j++) { call += '%20OR%20' + format_arg(key, val[j], sig); }
        call += ')';
      }
    }
  }

  if (VERBOSE) clog('api_call ' + call);
  if (call.indexOf('mode=Timeline') > -1) call += '&timezoom=yes'; // timezoom 인수는 현재 앱에서 작동하지 않지만 열린 링크에서는 작동
  return call;
}

// URL 해시 문자열을 인수로 파싱하는 함수

var init_args, init_argset = {}, init_argset_keys,
    selectized_ids = ['searchlang', 'sourcecountry', 'sourcelang', 'sort', 'domain', 'contentmode', 'timelinemode',
      'format', 'geolocationcc', 'geolocationadm1', 'geomode'];
var init_args0, compare_url;

function hash() {
  // 날짜 범위 초기화
  update_query('startdatetime', start_date.format('YYYYMMDDHHmmss'), buildhash = false);
  update_query('enddatetime', end_date.format('YYYYMMDDHHmmss'), buildhash = false);

  // 해시 문자열이 없는 경우
  if (window.location.hash === '') {
    if (VERBOSE) clog('on_load() 종료: 해시 없음');
    return;
  }

  // URL 해시에서 받은 인수로 필드 초기화
  init_args = window.location.hash
      .replace(/^#/i, '')
      .replace(/%20/gi, ' ')
      .replace(/%22/gi, '"')
      .split('&');

  init_args0 = init_args;

  // 해시가 COMPARE 설정인 경우 특별 처리 필요
  if (init_args[0] === 'compare') {
    if (VERBOSE) { clog('compare 초기화 시작'); }
    compare_mode = true; // 비교 모드 초기화
    for (var i = 1; i < init_args.length; i++) {
      var compare_arg = c(init_args[i]).split('=');
      var dataname = c(compare_arg[0]);
      compare_url = decodeURIComponent(c(compare_arg[1]));
      compare_url = compare_url.replace(/&format=[a-zA-Z]+/gi, '') + '&format=json'; // 올바른 형식 인수 보장
      $.ajax({
        url: compare_url,
        type: 'GET',
        dataType: 'json',
        error: function(err) { if (VERBOSE) { clog('ajax 호출 실패: ' + err); } },
        success: function(options) {
          datasets[dataname] = { 'name': dataname, 'url': compare_url, 'data': options };
          if (VERBOSE) { clog('comp 데이터 추가: ' + dataname); }
          clog('comp 데이터 추가: ' + dataname);
        },
        async: false, // 동기적으로 가져옴
      });
    }
    init_argset_keys = ['timelinemode'];

    // 옵션 중 하나로 앱 입력 초기화
    var new_init_args = compare_url
        .match(/query=.*/g)[0]
        .replace(/mode/g, 'timelinemode')
        .replace(/&format=json/g, '')
        .replace(/^#/i, '')
        .replace(/%20/gi, ' ')
        .replace(/%22/gi, '"')
        .split('&');

    init_args = ['api=doc'].concat(new_init_args);
    if (VERBOSE) { clog('compare 초기화 종료'); }
  }

  // 상세 보고 활성화
  if (init_args.indexOf('verbose') > -1) {
    VERBOSE = true;
    var i = init_args.indexOf('verbose');
    init_args.splice(i);
  }

  // 딕셔너리로 변환
  for (var i = 0; i < init_args.length; i++) {
    var arg = init_args[i].split('=');
    if (VERBOSE && i > 0 && arg.length < 2) { alert('init_argset 빌드 오류: ' + arg); }
    if (arg[1] !== '') { // 인수가 비어있으면 아무 작업도 하지 않음
      var val = arg[1].split(',');
      if (val.length === 1) val = val[0];
      init_argset[arg[0]] = val;
    }
  }

  // 해시 인수 딕셔너리를 쿼리 딕셔너리에 업데이트
  init_argset_keys = Object.keys(init_argset); // 고유 키

  for (var i = 0; i < init_argset_keys.length; i++) {
    var id = init_argset_keys[i];
    update_query(id, init_argset[id], false);
  }
  // timespan 생략은 중요하므로 특별 처리
  if (init_argset_keys.indexOf('timespan') === -1) { update_query('timespan', '', false); }

  if (VERBOSE) clog('해시 파싱 완료');
}

// API 호출을 복사하는 함수
function copyApiCall(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($("#gdelt_api_call").text()).select();
  document.execCommand("copy");
  $temp.remove();
}

hash();
