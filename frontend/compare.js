var msg = "이름을 지정하세요.\n\n\
현재 GDELT 쿼리의 데이터를 다른 쿼리의 데이터와 비교하기 위해 가져.\n\
■ 동일한 이름을 사용하여 기존 데이터셋을 덮어씁니다.\n\
■ '-' (하이픈)을 접두사로 사용하여 기존 데이터셋을 제거합니다.\n\n";

// 엔터 키로 추가 모달 닫기
$("#compareName").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#compareAddModalOK").click();
  }
});

// 모달이 열릴 때 텍스트 박스에 포커스 맞추기
$('#compareAddModal').on('shown.bs.modal', function () {
  $("#compareName").focus();
});

// 현재 메모리에 있는 레이어의 세부 정보를 추가 모달에 추가하고 해당 명령 단축키와 함께 표시
function add_layers() {
  $('#compareLayers').empty();
  // 불필요한 'imagetag'와 'theme' 제거
  var prompt_sug = [query.query, query.sourcecountry, query.sourcelang, query.domain].join(',').replace(/([,]+$)|(^[,]+)/gi, '').replace(/[,]+/gi, ',') ;
  $('#compareName').val(prompt_sug); // 추천 이름 설정
  var datakeys = Object.keys(datasets);
  if(datakeys.length == 0) {
    $('#compareLayers').append("<li>현재 저장된 레이어가 없습니다.</li>");
  }
  for(var i=0; i<datakeys.length; i++) {
    var url_txt = datasets[datakeys[i]].url.replace(/.*query=/g, 'query=').replace(/&format=[a-zA-Z]+/gi, ''); // URL 루트와 포맷 인수 제거
    var url = $("<div></div>").text(url_txt).html(); // HTML 특수 문자 이스케이프
    var layer_replace = ' <a style="cursor: pointer;" type="button" tabindex="0" onclick="$(\'#compareName\').val(\'' + datakeys[i] + '\')"> 교체 </a>';
    var layer_remove = ' <a style="cursor: pointer;" type="button" tabindex="1" onclick="$(\'#compareName\').val(\'-' + datakeys[i] + '\')"> 제거 </a>';
    var new_layer = '<li><b>\'' + datakeys[i] + '\': </b>(<i>' + url + '</i>)' + layer_replace + layer_remove + '</li>';
    $('#compareLayers').append(new_layer);
  }
}

// compareAddModal 모달에서 이름을 해석하고, 적절하게 데이터셋을 추가/교체/제거
function add_dataset(x) {
  var datakeys = Object.keys(datasets);
  dataname = x;
  if(dataname === null){
    alert('취소되었습니다.');
    return;
  }
  if(dataname[0] === '-') { // 항목 제거
    var targetName = dataname.substr(1);
    if(datakeys.indexOf(targetName) == -1) {
      alert('데이터 레이어 "' + targetName + '"을(를) 찾을 수 없습니다.\n철자를 확인해주세요.');
    } else {
      delete datasets[targetName];
      document.getElementById("analysis_datacount").innerHTML = Object.keys(datasets).length;
    }
  } else {
    // 데이터 가져오기
    if(VERBOSE) { clog('API_URL에서 데이터를 가져옵니다: ' + API_URL); }
    $.ajax({
      url: API_URL.replace(/&format=[a-zA-Z]+/gi, '') + '&format=json', // 올바른 포맷 인수 보장
      type: 'GET',
      dataType: 'json',
      error: function(err) {
        if(VERBOSE) { clog('AJAX 호출 실패: ' + err); }
      },
      success: function(options) {
        datasets[dataname] = {
          'name': dataname,
          'url': c(API_URL).replace(/&format=json/gi, ''),
          'data': options
        };
        if(VERBOSE) { clog('데이터셋 추가됨: ' + dataname); }
        $('#analysis_buttons_div').toggleClass('active');
        setTimeout(function () {
          $('#analysis_buttons_div').toggleClass('active');
        }, 500);
        document.getElementById("analysis_datacount").innerHTML = Object.keys(datasets).length;
      },
      async: true // 비동기적으로 변경하여 RESTful 방식 적용
    });
  }
}

// 'View' 클릭 시 동작
function action_analysis() {
  // 해시 업데이트
  var hash = 'compare&';
  var datakeys = Object.keys(datasets);
  for(var i=0; i<datakeys.length; i++) {
    hash += datakeys[i].replace(/:/g, '-') + '=' + encodeURIComponent(datasets[datakeys[i]].url) + '&';
  }
  location.href = '#' + hash.replace(/&$/g, '').replace(/ /gi, '%20'); // 마지막 '&' 제거 및 공백을 %20으로 변경
  // 제목 업데이트 및 비교 템플릿 호출
  var title = '비교: ' + Object.keys(datasets).join(', ');
  $("#iframe_title").text(title);
  iframe_zoom(2);
  $("#gdelt_iframe").attr("src", 'timeline.html');
}

// 'X' 클릭 시 동작
function clear_analysis() {
  datasets = {};
  document.getElementById("analysis_datacount").innerHTML = '0';
  console.log('데이터셋이 초기화되었습니다: ' + datasets);
}
