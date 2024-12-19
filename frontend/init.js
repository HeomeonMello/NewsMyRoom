// AJAX 호출 전에 실행할 전역 변수 및 해시 파싱 코드 (메뉴 옵션용)

var LIVE = false, // 완전히 초기화될 때까지 API 호출하지 않음
    VERBOSE = false, // 자세한 콘솔 보고: URL 끝에 '&verbose'를 추가하고 페이지 새로 고침
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
} // 깊은 복사 (클론)

// 시간/날짜 전역 변수
var end_date = moment(new Date());
var start_date = moment("2017-01-01 0:00 +0000", "YYYY-MM-DD HH:mm Z");
var dtft = 'DD-MMM-YYYY'; // 날짜 형식

// 비교 분석 전역 변수
var compare_mode = false;
var datasets = {};
var dataname;

// API 인수를 관리하는 사전. 수정하지 마세요 - 키의 순서가 시스템 무결성에 중요함
var query = {
  'api': 'doc', // 'doc' 또는 'geo' 또는 'tv'
  // DOC/GEO (QUERY) 공유 인수: QKEYS.slice(1, 14)
  'query': '', 'domain': '', 'imagefacetone': '', 'imagenumfaces': '', 'imageocrmeta': '', 'imagetag': '',
  'imagewebcount': '', 'imagewebtag': '', 'sourcecountry': '', 'sourcelang': '', 'theme': '', 'tone': '', 'toneabs': '',
  // GEO QUERY 인수: QKEYS.slice(14, 18)
  'geonear': '', 'geolocationcc': '', 'geolocationadm1': '', 'geolocation': '',
  // TV QUERY 인수: QKEYS.slice(18, 23)
  'context': '', 'market': '', 'network': ['BBCNEWS', 'CNN', 'FOXNEWS', 'RT', 'DW'], 'show': '', 'station': '',
  // DOC CONTENT 전용 인수: QKEYS.slice(23, 27)
  'contentmode': 'ArtList', 'maxrecords': '75', 'trans': false, 'sort': '',
  // DOC TIMELINE 전용 인수: QKEYS.slice(27, 30)
  'timelinemode': 'TimelineVol', 'timelinesmooth': '0', 'timezoom': '',
  // DOC CONTENT & TIMELINE 인수: QKEYS.slice(30, 35)
  'format': '', 'timespan': '1d', 'startdatetime': '', 'enddatetime': '', 'searchlang': '',
  // GEO 전용 인수: QKEYS.slice(35, 39)
  'geomode': 'PointData', 'geoformat': '', 'geotimespan': '1d', 'geogeores': '',
  // 특별 처리 인수: QKEYS.slice(39, 40)
  'domainis': false,
  // TV 인수: QKEYS.slice(40, 45)
  'tvmode': 'TimelineVol', 'datacomb': '', 'datanorm': '', 'last24': '', 'tvmaxrecords': ''
};
var QKEYS = Object.keys(query).slice(); // 고정된 쿼리 키 배열

// 쿼리 사전과 해시 문자열을 업데이트하는 함수
function update_query(u_key, u_val, buildhash = true) {
  if (VERBOSE) clog('updating ' + u_key + ' to ' + u_val);
  u_key = u_key.replace(/#/gi, ''); // 해시 기호 제거
  if (typeof(u_val) != typeof(true) && !u_val.length) { u_val = ''; } // 빈 배열 값 처리 (불리언 제외)
  if (u_key == 'timelinesmooth' && u_val == 0) { u_val = ''; }
  query[u_key] = u_val;

  // 시간 모드 토글
  if (query.timespan == '') {
    $('#datetime').prop('disabled', false);
  } else {
    $('#datetime').prop('disabled', true);
  }

  if (buildhash) { // API 호출 실행, 억제되지 않은 경우
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
  if (query.imagetag) { title += ' imagetags: ' + query.imagetag }
  if (query.theme) { title += ' themes: ' + query.theme }
  title = title.replace(/,/gi, ', '); // 쉼표 뒤에 공백 추가
  $("#iframe_title").text(title);

  // URL 링크와 iframe 소스 업데이트
  $("#gdelt_api_call").text(API_URL).attr("href", c(API_URL));
  if (LIVE) {
    if (API_URL.indexOf('TrendingTopics') > -1) { // 맞춤 템플릿 처리 사용
      API_URL = API_URL.replace(/&format=[^&]+/, '&format=json');
      if (API_URL.indexOf('&format=') == -1) API_URL += '&format=json';
      $("#iframe_title").text('TV의 인기 주제 및 구문');
      console.log(API_URL);
      $("#gdelt_iframe").attr("src", './trending_topics.html');
      return;
    }
    $("#gdelt_iframe").attr("src", API_URL);
  }
}

// 쿼리 사전을 쉽게 다시 파싱할 수 있는 해시 문자열을 빌드하는 함수
function build_hash() {
  if (VERBOSE && ['doc', 'geo', 'tv'].indexOf(query.api) == -1) {
    alert('query.api는 doc, geo 또는 tv 여야 합니다.');
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
  for (var i = 1; i < api_keys.length; i++) { // 'api'/'query' 인수는 건너뜀
    var key = api_keys[i];
    if (query[key] || key === 'query') { hash += '&' + key + '=' + encodeURIComponent(query[key]); }
  }
  // api_keys는 API URL 생성 함수 api_call()에도 유용하므로 반환
  return { 'keys': api_keys, 'hash': hash };
}

// API 호출을 형식화하는 함수
function format_arg(k, v, sig) {
  // 인수를 큰따옴표로 감싸야 하는 특별한 경우
  if (k == 'imagetag' || k == 'location') { v = '%22' + v + '%22'; }
  if (k == 'domain') { return 'domain:.' + v + '%20OR%20domainis:' + v; }
  if (v.substr(0, 1) == '-') { return '-' + k + sig + v.substr(1); }
  return k + sig + v;
}

// GDELT API 호출을 구성하는 함수
function api_call(k) {
  var call = 'https://api.gdeltproject.org/api/v2/';

  // 'api' 값 검증 및 'mode' 설정
  if (!['doc', 'geo', 'tv'].includes(query.api)) {
    console.error(`잘못된 API 유형: ${query.api}`);
    return '';
  }

  // 'api'에 따라 'mode' 설정
  var mode;
  switch(query.api) {
    case 'doc':
      if (query.timelinemode === 'TimelineVol' || query.timelinemode === 'TimelineTone') {
        mode = query.timelinemode;
      } else {
        mode = 'content';
      }
      break;
    case 'geo':
      mode = 'geo';
      break;
    case 'tv':
      mode = 'tv';
      break;
    default:
      mode = 'content';
  }

  call += query.api + '/' + query.api + '?mode=' + encodeURIComponent(mode) + '&query=' + encodeURIComponent(query.query);

  for (var i = 2; i < k.length; i++) { // 'api'/'query' 인수는 건너뜀
    var val = query[k[i]];
    var key = c(k[i]).replace(/^[a-zA-Z]+mode/g, 'mode').replace(/^geo/g, ''); // xxxmode 및 'geo..' 접두사 제거

    // 특별한 경우
    if (!val || val.length == 0) { continue; } // 빈 또는 false 인수 건너뜀
    if (key == 'trans' && val) { call += '&trans=googtrans'; continue; }
    if (key == 'domain' && val && query.domainis) { key = 'domainis'; } // 체크박스가 true인 경우 인수 변경
    else { if (key == 'domainis') { continue; } } // 이미 'domain'에서 처리됨

    // 규칙 기반 경우
    var ind = QKEYS.indexOf(k[i]);
    var sep = (ind >= 23) ? '&' : '%20';
    var sig = (ind >= 23) ? '=' : ':';
    if (!$.isArray(val)) { val = [val]; } // 배열로 변환

    if (val.length == 1) { // 단일 인수 경우
      if (key == 'context') { val[0] = '"' + val[0] + '"'; } // TV API 컨텍스트 인수는 큰따옴표 필요
      if (key == 'domain') {
        call += sep + '(' + format_arg(key, val[0], sig) + ')'; // 'domain'은 API 특성상 복잡한 쿼리
      } else {
        call += sep + format_arg(key, val[0], sig);
      }
    } else { // 다중 인수 경우
      var signs = [];
      for (var j = 0; j < val.length; j++) { signs.push(val[j].substr(0, 1) == '-'); }
      var all_neg = signs.every(function(x) { return x; });

      if (key == 'imagetag') { if ($('#imagetag_bool').is(":checked")) all_neg = true; } // 이미지/테마 태그에 대한 수동 AND 선택
      if (key == 'theme') { if ($('#theme_bool').is(":checked")) all_neg = true; } // 위와 동일

      if (all_neg) { // 모든 부호를 AND로 해석 (즉, sep '%20' 또는 '&')
        for (var j = 0; j < val.length; j++) { call += sep + format_arg(key, val[j], sig); }
      } else { // 모든 양호를 OR로 해석 (양호와 부호가 섞이면 AND/OR을 섞는 것은 의미가 없음)
        call += sep + '(' + format_arg(key, val[0], sig);
        for (var j = 1; j < val.length; j++) { call += '%20OR%20' + format_arg(key, val[j], sig); }
        call += ')';
      }
    }
  }

  if (VERBOSE) clog('api_call ' + call);
  if (call.indexOf('mode=Timeline') > 0) call += '&timezoom=yes'; // timezoom 인수는 현재 앱에서 작동하지 않지만 열린 링크에서는 작동함
  return call;
}

// URL 해시 문자열을 파싱하여 인수 처리

var init_args, init_argset = {}, init_argset_keys,
    selectized_ids = ['searchlang', 'sourcecountry', 'sourcelang', 'sort', 'domain', 'contentmode', 'timelinemode',
      'format', 'geolocationcc', 'geolocationadm1', 'geomode', 'imagetag', 'tvmode', 'network'];
var init_args0, compare_url;

function hash() {

  // 날짜 범위 초기화
  update_query('startdatetime', start_date.format('YYYYMMDDHHmmss'), buildhash = false);
  update_query('enddatetime', end_date.format('YYYYMMDDHHmmss'), buildhash = false);

  // 해시 문자열이 제공되지 않은 경우
  if (window.location.hash == '') {
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
  if (init_args[0] == 'compare') {
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
          if (VERBOSE) { clog('비교 데이터 추가됨: ' + dataname); }
          clog('비교 데이터 추가됨: ' + dataname);
        },
        async: false, // 동기적으로 가져오기
      });
    }
    init_argset_keys = ['timelinemode'];

    // 앱 입력을 옵션 중 하나로 초기화
    var new_init_args = compare_url
        .match(/query=.*/g)[0]
        .replace(/mode/g, 'timelinemode')
        .replace(/&format=json/g, '')
        .replace(/^#/i, '')
        .replace(/%20/gi, ' ')
        .replace(/%22/gi, '"')
        .split('&');

    init_args = ['api=doc'].concat(new_init_args);
    if (VERBOSE) { clog('compare 초기화 끝'); }
  }

  // 자세한 보고 구현
  if (init_args.indexOf('verbose') > -1) {
    VERBOSE = true;
    var i = init_args.indexOf('verbose');
    init_args.splice(i);
  }

  // 사전으로 변환
  for (var i = 0; i < init_args.length; i++) {
    var arg = init_args[i].split('=');
    if (VERBOSE && i > 0 && arg.length < 2) { alert('init_argset 빌드 오류: ' + arg); }
    if (arg[1] != '') { // 인수가 비어 있으면 동작하지 않음
      var val = arg[1].split(',');
      if (val.length == 1) val = val[0];
      init_argset[arg[0]] = val;
    }
  }

  // 해시 인수의 사전을 빌드하고 이를 사용하여 쿼리 사전을 업데이트
  init_argset_keys = Object.keys(init_argset); // 고유 키

  for (var i = 0; i < init_argset_keys.length; i++) {
    var id = init_argset_keys[i];
    update_query(id, init_argset[id], false);
  }
  // timespan 생략은 중요하므로 특별 처리
  if (init_argset_keys.indexOf('timespan') == -1) { update_query('timespan', '', false); }

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

// 초기화 및 기타 함수

document.addEventListener("DOMContentLoaded", function() {
  // 인터페이스 조정
  document.getElementById("searchTabInput").click();  // 기본 검색 탭 선택
  document.getElementById("contentTabOutput").click(); // 기본 출력 탭 선택
  $("input").focus(function() { this.select() });      // 입력 시 전체 텍스트 선택

  // 최대 기록 슬라이더 초기화
  var maxrec_slider = document.getElementById("maxrecords");
  document.getElementById("maxrecordslab").innerHTML = maxrec_slider.value;
  var smooth_slider = document.getElementById("timelinesmooth");
  document.getElementById("timelinesmoothlab").innerHTML = smooth_slider.value;

  // 날짜/시간 설정
  var daterange = $('input[name="daterange"]').daterangepicker({
    locale: { format: dtft },
    maxDate: end_date.format(dtft),
    minDate: start_date.format(dtft),
    startDate: start_date.format(dtft),
    endDate: end_date.format(dtft)
  });

  function updateDate(picker) { // 입력 위젯을 읽고 데이터 객체 업데이트
    var start_date_picked = picker.startDate.startOf('day');
    var end_date_picked = picker.endDate.endOf('day');
    update_query('startdatetime', start_date_picked.format('YYYYMMDDHHmmss'), buildhash = false);
    update_query('enddatetime', end_date_picked.format('YYYYMMDDHHmmss'));
  }

  setTimeout(function() {
    $('#datetime').on('apply.daterangepicker', function(ev, picker) {
      updateDate(picker);
    });
  }, 1000);

  // 탭 관리
  function manageInputTabs(evt, tabName) {
    var inputTabContent = document.getElementsByClassName("inputTab");
    for (var i = 0; i < inputTabContent.length; i++) {
      inputTabContent[i].style.display = "none";
    }
    var inputTabLinks = document.getElementsByClassName("inputTabLinks");
    for (var i = 0; i < inputTabLinks.length; i++) {
      inputTabLinks[i].className = inputTabLinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  var current_tab = 'tab_content'; // 현재 탭

  function manageOutputTabs(evt, tabName) {
    var outputTabContent = document.getElementsByClassName("outputTab");
    for (var i = 0; i < outputTabContent.length; i++) {
      outputTabContent[i].style.display = "none";
    }
    var outputTabLinks = document.getElementsByClassName("outputTabLinks");
    for (var i = 0; i < outputTabLinks.length; i++) {
      outputTabLinks[i].className = outputTabLinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // 탭 전환 시 변경 사항 트리거
    if (tabName == 'tab_content') {
      current_tab = 'tab_content';
      $('#doc_results_options').appendTo("#tab_content");
      $('#maxrecordsdiv').show();
      $('#sortdiv').show();
      $('#analysis_buttons_div').hide();
      $('#timelinesmoothdiv').hide();
      if (LIVE) { update_query('api', 'doc'); }
    }
    if (tabName == 'tab_timeline') {
      current_tab = 'tab_timeline';
      $('#doc_results_options').appendTo("#tab_timeline");
      $('#timelinesmoothdiv').show();
      $('#maxrecordsdiv').hide();
      $('#sortdiv').hide();
      $('#analysis_buttons_div').show();
      if (LIVE) { update_query('api', 'doc'); }
    }
    if (tabName == 'tab_geo') {
      current_tab = 'tab_geo';
      if (LIVE) { update_query('api', 'geo'); }
    }
    if (tabName == 'tab_tv') {
      current_tab = 'tab_tv';
      if (LIVE) { update_query('api', 'tv'); }
    }
  }

  // 메뉴 옵션 로드 및 입력 선택 요소 구성
  function selectize_blur(id) {
    var select = $(id).selectize();
    var selectize = select[0].selectize;
    selectize.blur();
  }

  function selectize_add_new(id, vals) {
    if (!$.isArray(vals)) vals = [vals];
    var d = [];
    for (var i = 0; i < vals.length; i++) {
      d.push({ 'name': vals[i], 'code': vals[i] });
    }
    var $select = $(id).selectize();
    var selectize = $select[0].selectize;
    selectize.addOption(d);
    for (var i = 0; i < vals.length; i++) {
      selectize.addItem(d[i].name);
    }
  }

  function selectize_element(id, max_items, options, title) {
    if (max_items > 0) {
      $(id).selectize({
        valueField: 'code',
        labelField: 'name',
        searchField: 'name',
        maxItems: max_items,
        options: options,
        create: true,
        persist: false,
        delimiter: ',',
        allowEmptyOption: true
      });

      var id0 = id.replace(/#/, '');
      if (query[id0]) {
        selectize_add_new(id, query[id0]);
      }
    }
    $(id + ' + div').attr('title', title); // 툴팁 추가
    $(id).change(function() {
      update_query(id.replace('#', ''), $(id).val());
    });
  }

  function load_menu_data(fn, ids, max_items, title) {
    $.ajax({
      url: fn,
      type: 'GET',
      dataType: 'json',
      error: function(err) { console.error(err); },
      success: function(options) {
        if (fn == "//api.gdeltproject.org/api/v2/tv/tv?mode=stationdetails&format=json") {
          options = options.station_details;
          options = options.filter(function(item) {
            var live = moment(new Date()) - moment(item.EndDate) < 604800000;
            var nat_int = ['International', 'National'].includes(item.Market);
            var cspan = !['CSPAN2', 'CSPAN3'].includes(item.StationID);
            return live && nat_int && cspan;
          }).map(function(item) {
            return {
              code: item.StationID,
              name: item.Description
            };
          });
        }
        // 각 DOM 요소에 selectize 적용
        for (var i = 0; i < ids.length; i++) {
          selectize_element(ids[i], max_items[i], options, title[i]);
        }
        sources_loaded++;
        if (sources_loaded == 8) { // 로드해야 할 메뉴 수 수정
          console.log('로드 완료');
        }
      },
    });
  }

  // 선택 옵션 세트 로드 및 DOM에 추가
  load_menu_data("data/LOOKUP-LANGUAGES.json", ['#searchlang', '#sourcelang'], [1, 7], ['', '검색할 콘텐츠의 언어. GDELT가 해석을 처리합니다.']);
  load_menu_data("data/LOOKUP-COUNTRIES.json", ['#sourcecountry', '#geolocationcc'], [7, 7], ['타겟 콘텐츠가 생성된 국가 또는 국가들', '미디어 언급의 국가를 지정']);
  load_menu_data("data/lookup-sort.json", ['#sort'], [1], ['기본적으로 결과는 관련성에 따라 정렬됩니다. 날짜나 기사 톤에 따라 정렬할 수도 있습니다.']);
  load_menu_data("data/lookup-domain.json", ['#domain'], [7], ['타겟 콘텐츠의 웹 도메인 ']);
  load_menu_data("data/lookup-mode.json", ['#contentmode'], [1], ['소스 콘텐츠를 조사하기 위한 GDELT 모드']);
  load_menu_data("data/lookup-timeline.json", ['#timelinemode'], [1], ['시간에 따른 추세를 조사하기 위한 GDELT 모드']);
  load_menu_data("data/lookup-format.json", ['#format'], [1], ['데이터 내보내기 형식']);
  load_menu_data("data/lookup-geo_mode.json", ['#geomode'], [1], ['콘텐츠 내 지리적 참조를 조사하기 위한 GDELT 모드. GDELT의 7일 GEO API를 사용합니다.']);

  // 이벤트 핸들러
  var timeout = null; // 전역 타이머

  function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }

  function manage_event(id, target, report, val) {
    var input = document.getElementById(id);
    if (typeof report != "undefined") {
      document.getElementById(report).innerHTML = input.value;
    }
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      update_query(target, input.value);
    }, 500);
  }
  // 체크박스 초기화 및 이벤트 핸들러
  document.getElementById('domainis').checked = query.domainis;

  function checkboxDomain() { update_query('domainis', !query.domainis); }

  // 'CONTENT', 'TIMELINE', 'GEO', 등 다른 탭 선택 시
  if (init_argset_keys) {
    if (init_argset.api == 'geo') {
      document.getElementById("geoTabOutput").click();
    } else {
      if (init_argset_keys.indexOf('timelinemode') > -1) {
        document.getElementById("timelineTabOutput").click();
      }
    }
  }

  // 초기화
  $(window).on("load", function() {
    LIVE = true;
    update_query('api', query.api);
    $('#query').focus();
    if (compare_mode) {
      document.getElementById("analysis_datacount").innerHTML = Object.keys(datasets).length;
      action_analysis();
    }
    resize_panels();
  });
});

// iframe 줌 함수 (다른 곳에서 정의된 것으로 가정)
function iframe_zoom(level) {
  var iframe = document.getElementById('gdelt_iframe');
  var currentZoom = parseInt(iframe.style.zoom) || 1;
  if (level === 1) { // 확대
    iframe.style.zoom = currentZoom + 0.1;
  } else if (level === 0) { // 축소
    iframe.style.zoom = currentZoom - 0.1;
  } else if (level === 2) { // 줌 초기화
    iframe.style.zoom = 1;
  }
}
