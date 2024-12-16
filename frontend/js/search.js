// 검색 폼과 결과 컨테이너 가져오기
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("resultsContainer");

// 검색 이벤트 처리
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();
    if (!query) return;

    resultsContainer.innerHTML = "<p>검색 중...</p>";

    try {
        // API 호출 (예제 URL)
        const response = await fetch(`https://api.example.com/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        // 검색 결과 렌더링
        renderResults(data.results);
    } catch (error) {
        resultsContainer.innerHTML = "<p>검색 실패. 다시 시도해주세요.</p>";
        console.error("검색 오류:", error);
    }
});

// 검색 결과 렌더링 함수
function renderResults(results) {
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = "<p>검색 결과가 없습니다.</p>";
        return;
    }

    resultsContainer.innerHTML = results
        .map(result => `
            <div class="result-item">
                <h3><a href="${result.url}" target="_blank">${result.title}</a></h3>
                <p>${result.summary}</p>
            </div>
        `).join("");
}
