<script setup>
import { onMounted } from 'vue';
import { useMovieStore } from '../stores/movieStore';

const store = useMovieStore();

// 컴포넌트가 마운트되면 영화 데이터 불러오기
onMounted(() => {
  store.fetchMovies();
  document.title = '🎬 국내 극장 화제작(인기순)';
});

// [추가 미션 1: 정렬 기능] 정렬 버튼 클릭 핸들러
const handleSort = (sortType) => {
  store.sortMovies(sortType);
};
</script>

<template>
  <main class="page">
    <div class="header-section">
      <h1>🍿 국내 극장 화제작 (인기순)</h1>
      <p class="sub-title">2025년 이후 국내 정식 개봉한 실시간 인기 상영작</p>
    </div>

    <!-- [추가 미션 1: 정렬 기능] 정렬 버튼 그룹 -->
    <div class="sort-controls">
      <button 
        class="sort-btn" 
        :class="{ active: store.sortType === 'title' }"
        @click="handleSort('title')"
      >
        제목순
      </button>
      <button 
        class="sort-btn" 
        :class="{ active: store.sortType === 'release_date' }"
        @click="handleSort('release_date')"
      >
        개봉일순
      </button>
      <button 
        class="sort-btn" 
        :class="{ active: store.sortType === 'vote_average' }"
        @click="handleSort('vote_average')"
      >
        평점순
      </button>
    </div>

    <!-- 로딩 중 -->
    <div v-if="store.isLoading" class="status-message loading">
      ⏳ 실시간 국내 개봉작 데이터를 싣고 오는 중입니다...
    </div>

    <!-- 에러 발생 시 -->
    <div v-else-if="store.errorMessage" class="status-message error">
      ❌ {{ store.errorMessage }}
    </div>

    <!-- 영화 목록 -->
    <div v-else class="movie-list">
      <div v-for="movie in store.paginatedMovies" :key="movie.id" class="movie-card">
        <img
          v-if="movie.poster_path"
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
          class="poster"
        />
        <div v-else class="poster-placeholder">이미지 준비 중</div>

        <div class="card-content">
          <h3 class="title">{{ movie.title }}</h3>
          <p class="release-date" v-if="movie.release_date">
            📅 개봉일: {{ movie.release_date }}
          </p>
          <p class="rating">
            ⭐ {{ movie.vote_average.toFixed(1) }} / 10
          </p>
          <p class="overview">
            {{ movie.overview 
              ? movie.overview.substring(0, 60) + '...' 
              : '국내에 등록된 줄거리 요약 정보가 없습니다.' 
            }}
          </p>
          
          <button
            @click="store.toggleFavorite(movie.id)"
            :class="['fav-btn', { active: movie.isFavorite }]"
          >
            {{ movie.isFavorite ? '❤️ 찜 해제' : '♡ 찜하기' }}
          </button>
        </div>
        <RouterLink
          :to="`/movies/${movie.id}`"
          class="stretched-link"
          :aria-label="`${movie.title} 상세 정보 보기`"
          ></RouterLink>
      </div>
    </div>

    <!-- [추가 미션 4: 페이지네이션] 하단 페이지 번호 버튼 -->
    <div v-if="!store.isLoading && !store.errorMessage" class="pagination">
      <button
        v-for="page in store.totalPages"
        :key="page"
        class="page-btn"
        :class="{ active: store.currentPage === page }"
        @click="store.setPage(page)"
      >
        {{ page }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.page { 
  padding: 40px; 
  background-color: #f8f9fa; 
  min-height: 100vh; 
}

.header-section { 
  margin-bottom: 30px; 
  text-align: center; 
  color: #2c3e50; 
}

.sub-title { 
  font-size: 14px; 
  color: #7f8c8d; 
  margin-top: 5px; 
}

/* [추가 미션 1: 정렬 기능] 정렬 버튼 스타일 */
.sort-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.sort-btn {
  padding: 10px 20px;
  border: 2px solid #3498db;
  background-color: white;
  color: #3498db;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-btn:hover {
  background-color: #e3f2fd;
  transform: translateY(-2px);
}

.sort-btn.active {
  background-color: #3498db;
  color: white;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.status-message { 
  text-align: center; 
  font-size: 20px; 
  font-weight: bold; 
  padding: 50px; 
  border-radius: 12px; 
}

.loading { 
  color: #3498db; 
  background-color: #e3f2fd; 
}

.error { 
  color: #e74c3c; 
  background-color: #fdeaea; 
}

.movie-list { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); 
  gap: 30px; 
}

.movie-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
}

.movie-card:hover { 
  transform: translateY(-5px); 
}

.poster { 
  width: 100%; 
  height: 380px; 
  object-fit: cover; 
}

.poster-placeholder {
  width: 100%;
  height: 380px;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #2c3e50;
}

.release-date, .rating {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.overview {
  font-size: 13px;
  color: #555;
  margin: 8px 0 12px;
  flex: 1;
}

.fav-btn {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 12px;
  cursor: pointer;
  border: none;
  background: #ecf0f1;
  color: #333;
  font-weight: bold;
  font-size: 14px;
  transition: 0.3s;
  margin-top: auto;
}

.fav-btn.active {
  background-color: #e74c3c;
  color: white;
}

.stretched-link {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #3498db;
  background-color: white;
  color: #3498db;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover {
  background-color: #e3f2fd;
}

.page-btn.active {
  background-color: #3498db;
  color: white;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}
</style>