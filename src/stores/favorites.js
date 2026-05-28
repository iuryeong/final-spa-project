import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
  // 1. State (상태): 브라우저 스토리지에 저장된 데이터가 있으면 파싱해서 가져옵니다.
  const savedFavorites = JSON.parse(localStorage.getItem('favorite_movies')) || [];
  const favoriteMovies = ref(savedFavorites);

  // 2. Getters (게터): 데이터를 계산해서 보여주는 인내원들
  // 2-1. 찜한 영화의 총 개수
  const totalFavorites = computed(() => favoriteMovies.value.length);

  // 2-2. [심화] 찜한 영화들의 평균 평점 계산 (reduce 활용)
  const averageRating = computed(() => {
    if (favoriteMovies.value.length === 0) return 0;
    const sum = favoriteMovies.value.reduce((acc, movie) => acc + movie.rating, 0);
    return (sum / favoriteMovies.value.length).toFixed(1); // 소수점 1자리까지
  });

  const toggleFavorite = (movie) => {
    const index = favoriteMovies.value.findIndex((m) => m.id === movie.id);
    if (index === -1) {
        favoriteMovies.value.push(movie);
    } else {
        favoriteMovies.value.splice(index, 1);
    }
    };

    const clearAllFavorites = () => {
        favoriteMovies.value = [];
        };


    watch(favoriteMovies, (newVal) => {
        localStorage.setItem('favorite_movies', JSON.stringify(newVal));
    }, { deep: true }
    );
    
    return { favoriteMovies, totalFavorites, averageRating, toggleFavorite, clearAllFavorites };
});