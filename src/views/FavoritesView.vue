<script setup>
import { useMovieStore } from '../stores/movieStore';

const store = useMovieStore();
</script>

<template>
  <main class="page">
    <div class="header-section">
      <h1>❤️ 내 찜 목록</h1>
      <p class="sub-title">
        찜한 작품
        <span class="count">{{ store.favorites.length }}편</span>
      </p>
    </div>

    <!-- 찜 목록 비어있을 때 -->
    <div v-if="store.favorites.length === 0" class="status-message empty">
      <p>아직 찜한 영화가 없습니다.</p>
      <p class="hint">영화 목록에서 ♡ 찜하기 버튼을 눌러 보세요!</p>
    </div>

    <!-- 찜 목록 -->
    <div v-else class="movie-list">
      <div
        v-for="movie in store.favorites"
        :key="movie.id"
        class="movie-card"
      >
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
          <p class="rating">⭐ {{ movie.vote_average.toFixed(1) }} / 10</p>
          <p class="overview">
            {{
              movie.overview
                ? movie.overview.substring(0, 60) + '...'
                : '국내에 등록된 줄거리 요약 정보가 없습니다.'
            }}
          </p>

          <button
            @click.prevent="store.toggleFavorite(movie.id)"
            class="fav-btn active"
          >
            ❤️ 찜 해제
          </button>
        </div>
        <RouterLink
          :to="`/movies/${movie.id}`"
          class="stretched-link"
          :aria-label="`${movie.title} 상세 정보 보기`"
        ></RouterLink>
      </div>
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
  font-size: 15px;
  color: #7f8c8d;
  margin-top: 8px;
}

.count {
  font-weight: 700;
  color: #e74c3c;
  margin-left: 4px;
}

.status-message {
  text-align: center;
  padding: 80px 20px;
  border-radius: 12px;
  background-color: #fff0f0;
  color: #7f8c8d;
}

.status-message p {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px;
}

.hint {
  font-size: 14px !important;
  font-weight: normal !important;
  color: #aaa;
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
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

.release-date,
.rating {
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
  font-weight: bold;
  font-size: 14px;
  transition: 0.3s;
  margin-top: auto;
  background-color: #e74c3c;
  color: white;
}

.fav-btn:hover {
  background-color: #c0392b;
}

.stretched-link {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
</style>
