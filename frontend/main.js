// 인터페이스 조정
document.getElementById("searchTabInput").click();  // 기본 쿼리 탭 선택
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
  var start_date = picker.startDate.startOf('day');
  var end_date = picker.endDate.endOf('day');
  update_query('startdatetime', start_date.format('YYYYMMDDHHmmss'), buildhash = false);
  update_query('enddatetime', end_date.format('YYYYMMDDHHmmss'));
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
  if(tabName == 'tab_content') {
    current_tab = 'tab_content';
    $('#doc_results_options').appendTo("#tab_content");
    $('#maxrecordsdiv').show();
    $('#sortdiv').show();
    $('#analysis_buttons_div').hide();
    $('#timelinesmoothdiv').hide();
    if(LIVE){ update_query('api', 'doc'); }
  }
  if(tabName == 'tab_timeline') {
    current_tab = 'tab_timeline';
    $('#doc_results_options').appendTo("#tab_timeline");
    $('#timelinesmoothdiv').show();
    $('#maxrecordsdiv').hide();
    $('#sortdiv').hide();
    $('#analysis_buttons_div').show();
    if(LIVE){ update_query('api', 'doc'); }
  }
  if(tabName == 'tab_geo') {
    current_tab = 'tab_geo';
    if(LIVE){ update_query('api', 'geo'); }
  }
}

// 해시가 있는 경우 초기화
if(window.location.hash != ''){
  for(var i=0; i<init_argset_keys.length; i++) {
    var id = init_argset_keys[i];
    if(id != 'api' && selectized_ids.indexOf(id) == -1) {
      if(['startdatetime','enddatetime'].indexOf(id) == -1){
        if(['trans','domainis'].indexOf(id) > -1){
          document.getElementById(id).checked = query[id];
        } else {
          if(id != 'timezoom') document.getElementById(id).value = query[id];
        }
      } else {
        if(id == 'startdatetime'){
          var sd = init_argset.startdatetime;
          var ed = init_argset.enddatetime;
          $('#datetime').daterangepicker({
            startDate: [sd.substr(4,2), sd.substr(6,2), sd.substr(0,4)].join('/'),
            endDate: [ed.substr(4,2), ed.substr(6,2), ed.substr(0,4)].join('/')
          });
          $('#timespan').val('')
          updateDate( $('#datetime').data('daterangepicker') );
        }
      }
      if(id == 'maxrecords') document.getElementById('maxrecordslab').innerHTML = init_argset[id];
      if(id == 'timelinesmooth') document.getElementById('timelinesmoothlab').innerHTML = init_argset[id];
    }
  }
}

// 메뉴 옵션 로드 및 입력 선택 요소 구성
function selectize_blur(id) {
  var select = $(id).selectize();
  var selectize = select[0].selectize;
  selectize.blur();
}

function selectize_add_new(id, vals) {
  if(!$.isArray(vals)) vals = [vals];
  var d = [];
  for(var i=0; i<vals.length; i++) {
    d.push({'name':vals[i],'code':vals[i]});
  }
  var $select = $(id).selectize();
  var selectize = $select[0].selectize;
  selectize.addOption(d);
  for(var i=0; i<vals.length; i++) {
    selectize.addItem(d[i].name);
  }
}

function selectize_element (id, max_items, options, title) {
  if(max_items > 0) {
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
    if(query[id0]) {
      selectize_add_new(id, query[id0]);
    }
  }
  $(id + ' + div').attr('title', title); // 툴팁 추가
  $(id).change(function() {
    update_query(id.replace('#', ''), $(id).val());
  });
}

function load_menu_data (fn, ids, max_items, title) {
  $.ajax({
    url: fn,
    type: 'GET',
    dataType: 'json',
    error: function(err) { console.error(err); },
    success: function(options) {
      if(fn == "data/LOOKUP-IMAGETAGS.json" || fn == "data/LOOKUP-GKGTHEMES.json"){
        for(var i=0; i<options.length; i++) {
          options[i].name = options[i].code + ' (' + options[i].n + ')';
        }
      }
      if(fn == "//api.gdeltproject.org/api/v2/tv/tv?mode=stationdetails&format=json"){
        options = options.station_details;
        options = options.filter(function (item) {
          var live = moment(new Date()) - moment(item.EndDate) < 604800000;
          var nat_int = ['International','National'].includes(item.Market);
          var cspan = !['CSPAN2','CSPAN3'].includes(item.StationID);
          return live && nat_int && cspan;
        }).map(function(item) {
          return {
            code: item.StationID,
            name: item.Description
          };
        });
      }
      // 각 DOM 요소에 selectize 적용
      for(var i=0; i<ids.length; i++) {
        selectize_element(ids[i], max_items[i], options, title[i]);
      }
      sources_loaded++;
      if(sources_loaded == 11) {
        console.log('로드 완료');
      }
    },
  });
}

// 선택 옵션 세트 로드 및 DOM에 추가
load_menu_data("data/LOOKUP-IMAGETAGS.json", ['#imagetag'], [7], ['모든 이미지에 대해 GDELT가 인식한 10,000개 이상의 객체 및 활동 중 하나 이상의 주제 태그가 할당됩니다.']);
load_menu_data("data/LOOKUP-GKGTHEMES.json", ['#theme'], [7], ['GDELT 글로벌 지식 그래프(GKG) 테마를 검색합니다. GKG 테마는 단일 헤딩 아래에 여러 다른 구문이나 이름이 있을 수 있어 복잡한 주제를 검색하는 강력한 방법을 제공합니다. 관련성이 높은 테마를 입력하여 일치하는 옵션을 찾으세요.']);
load_menu_data("data/LOOKUP-LANGUAGES.json", ['#searchlang','#sourcelang'], [1,7], ['','검색할 콘텐츠의 언어. GDELT가 해석을 처리합니다.']);
load_menu_data("data/LOOKUP-COUNTRIES.json", ['#sourcecountry','#geolocationcc'], [7,7], ['타겟 콘텐츠가 생성된 국가 또는 국가들','미디어 언급의 국가를 지정']);
load_menu_data("data/LOOKUP-ADM1.json", ['#geolocationadm1'], [7], ['미디어 언급의 ADM1(최상위 하위 국가) 지리적 지역을 지정']);
load_menu_data("data/lookup-sort.json", ['#sort'], [1], ['기본적으로 결과는 관련성에 따라 정렬됩니다. 날짜나 기사 톤에 따라 정렬할 수도 있습니다.']);
load_menu_data("data/lookup-domain.json", ['#domain'], [7], ['타겟 콘텐츠의 웹 도메인 - 예: "cnn.com"']);
load_menu_data("data/lookup-mode.json", ['#contentmode'], [1], ['소스 콘텐츠를 조사하기 위한 GDELT 모드']);
load_menu_data("data/lookup-timeline.json", ['#timelinemode'], [1], ['시간에 따른 추세를 조사하기 위한 GDELT 모드']);
load_menu_data("data/lookup-tv.json", ['#tvmode'], [1], ['텔레비전 추세를 조사하기 위한 GDELT 모드']);
load_menu_data("data/lookup-format.json", ['#format'], [1], ['데이터 내보내기 형식']);
load_menu_data("data/lookup-geo_mode.json", ['#geomode'], [1], ['콘텐츠 내 지리적 참조를 조사하기 위한 GDELT 모드. GDELT의 7일 GEO API를 사용합니다.']);
load_menu_data("data/lookup-geo_format.json", ['#geoformat'], [1], ['데이터 내보내기 형식']);
load_menu_data("//api.gdeltproject.org/api/v2/tv/tv?mode=stationdetails&format=json", ['#network'], [7], ['국내외 TV 네트워크.']);

// 이벤트 핸들러
var timeout = null; // 전역 타이머

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function manage_event(id, target, report, val) {
  var input = document.getElementById(id);
  if(typeof report != "undefined"){
    document.getElementById(report).innerHTML = input.value;
  }
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    update_query(target, input.value);
  }, 500);
}

$("#query").keyup(function(){ manage_event('query', 'query') });
$("#timespan").keyup(function(){ manage_event('timespan', 'timespan') });
$("#maxrecords").on('input', function(){ manage_event('maxrecords', 'maxrecords', 'maxrecordslab') });
$("#timelinesmooth").on('input', function(){ manage_event('timelinesmooth', 'timelinesmooth', 'timelinesmoothlab') });
$("#geotimespan").on('input', function(){ manage_event('geotimespan', 'geotimespan') });
$("#geolocation").keyup(function(){ manage_event('geolocation', 'geolocation' )});
$("#geogeores").keyup(function(){ manage_event('geogeores', 'geogeores') });
$("#geonear").keyup(function(){ manage_event('geonear', 'geonear') });
$("#context").keyup(function(){ manage_event('context', 'context') });

// 체크박스 초기화 및 이벤트 핸들러
document.getElementById('domainis').checked = query.domainis;
document.getElementById('trans').checked = query.trans;

function checkboxDomain() { update_query('domainis', !query.domainis); }
function checkboxTrans() { update_query('trans', !query.trans); }
function checkboxImageBool() { action_query(); }
function checkboxThemeBool() { action_query(); }

// 'CONTENT'가 아닌 탭 선택
if(init_argset_keys){
  if(init_argset.api == 'geo') {
    document.getElementById("geoTabOutput").click();
  } else {
    if(init_argset.api == 'tv'){
      document.getElementById("tvTabOutput").click();
    } else {
      if(init_argset_keys.indexOf('timelinemode') > -1) {
        document.getElementById("timelineTabOutput").click();
      }
    }
  }
  if(!query.query) {
    if(query.imagetag) {
      document.getElementById("imageTabInput").click();
    } else {
      if(query.theme) {
        document.getElementById("themeTabInput").click();
      }
    }
  }
}

// 초기화
$(window).on("load", function() {
  LIVE = true;
  update_query('api', query.api);
  $('#query').focus();
  if(compare_mode){
    document.getElementById("analysis_datacount").innerHTML = Object.keys(datasets).length;
    action_analysis();
  }
  resize_panels();
});
