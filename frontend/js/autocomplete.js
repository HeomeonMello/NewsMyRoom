// frontend/js/autocomplete.js

$(document).ready(function() {
    // selectize 초기화
    $('#query').selectize({
        valueField: 'value',
        labelField: 'label',
        searchField: 'label',
        create: false, // 사용자가 새 항목을 추가할 수 없도록 설정
        placeholder: '검색어를 입력하세요',
        maxOptions: 5, // 표시할 최대 옵션 수
        loadThrottle: 300, // 요청 간 최소 시간 (밀리초)
        load: function(query, callback) {
            if (!query.length) return callback();
            // AJAX 요청을 통해 자동완성 데이터 가져오기
            $.ajax({
                url: '/api/autocomplete', // 백엔드 엔드포인트
                type: 'GET',
                dataType: 'json',
                data: {
                    type: 'term', // 또는 'section'으로 변경 가능
                    query: query
                },
                error: function() {
                    callback();
                },
                success: function(res) {
                    if (res.items && res.items.length > 0) {
                        const formatted = res.items.map(item => ({
                            value: item,
                            label: item
                        }));
                        callback(formatted);
                    } else {
                        callback([]);
                    }
                }
            });
        }
    });

    // 검색 버튼 클릭 이벤트
    $('#searchButton').on('click', function() {
        performSearch();
    });

    // 엔터 키 눌렀을 때 검색 수행
    $('#query').on('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // 폼 제출 방지
            performSearch();
        }
    });

    function performSearch() {
        var query = $('#query').val();
        // 검색어가 비어있지 않은지 확인
        if (!query) {
            alert('검색어를 입력해주세요.');
            return;
        }
        // iframe에 검색 결과 로드
        var searchUrl = '/api/search?q=' + encodeURIComponent(query);
        $('#gdelt_iframe').attr('src', searchUrl);
    }
});
