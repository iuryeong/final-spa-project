import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useMovieStore = defineStore('movie', () => {
    const movies = ref([]);

    const favorites = ref(JSON.parse(sessionStorage.getItem('favorites')) || []);

    const isLoading = ref(false);
    const errorMessage = ref('');

    const selectedMovie = ref(null);

    const sortType = ref('popularity');

    // [추가 미션 2: 검색 기능]
    const searchQuery = ref('');

    // [추가 미션 4: 페이지네이션]
    const currentPage = ref(1);
    const itemsPerPage = 6;

    const totalPages = computed(() =>
        Math.ceil(movies.value.length / itemsPerPage)
    );

    const paginatedMovies = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return movies.value.slice(start, end);
    });

    const setPage = (page) => {
        currentPage.value = page;
    };

    const searchResults = computed(() => {
        if (!searchQuery.value.trim()) return movies.value;
        const query = searchQuery.value.trim().toLowerCase();
        return movies.value.filter(movie =>
            movie.title.toLowerCase().includes(query)
        );
    });

    const fetchMovies = async () => {
        isLoading.value = true;
        errorMessage.value = '';

        try{
            const API_KEY = '0c8cbd7cf72223744b1a976baa2ec959';

            const movieParams = {
                api_key: API_KEY,
                language: 'ko-KR',
                region: 'KR',
                sort_by: 'popularity.desc',
                include_adult: false,
                'release_date.gte': '2025-01-01',
                with_release_type: '2|3',
                page: 1
            };

            const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                params: movieParams
            });

            const fetchedMovies = response.data.results;
            
            fetchedMovies.forEach(movie => {
                const isAlreadyFavorite = favorites.value.some(fav => fav.id === movie.id);
                movie.isFavorite = isAlreadyFavorite;
            });
            movies.value = fetchedMovies;
        } catch (error) {
            console.error('API 통신 에러 상세 내역:', error);
            errorMessage.value = '영화 데이터를 불러오는 데 실패했습니다. 통신 상태나 API Key를 확인해 주세요.'
        } finally {
            isLoading.value = false;
        }
    };

    const fetchMovieDetail = async (movieId) => {
        isLoading.value = true;
        errorMessage.value = '';
        selectedMovie.value = null;

        try {
            const API_KEY = '0c8cbd7cf72223744b1a976baa2ec959';
            const url = `https://api.themoviedb.org/3/movie/${movieId}`;

            const response = await axios.get(url, {
                params: {
                    api_key: API_KEY,
                    language: 'ko-KR'
                }
            });
            
            selectedMovie.value = response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                errorMessage.value = '존재하지 않거나 삭제된 영화 정보입니다.';
            } else {
                errorMessage.value = '서버 통신 중 에러가 발생했습니다.';
            }
        } finally {
            isLoading.value = false;
        }
    };

    const toggleFavorite = (movieId) => {
        const movie = movies.value.find(m => m.id === movieId);
        if (movie) {
            movie.isFavorite = !movie.isFavorite;

            if(movie.isFavorite) {
                favorites.value.push(movie);
            } else {
                favorites.value = favorites.value.filter(m => m.id !== movieId);
            }
            sessionStorage.setItem('favorites', JSON.stringify(favorites.value));
        }
    };

    // [추가 미션 1: 정렬 기능]
    const sortMovies = (type) => {
        sortType.value = type;
        
       
        const sortedMovies = [...movies.value];
        
        if (type === 'title') {
            sortedMovies.sort((a, b) => 
                a.title.localeCompare(b.title, 'ko-KR')
            );
        } else if (type === 'release_date') {
            sortedMovies.sort((a, b) => {
                const dateA = new Date(a.release_date || '0000-00-00').getTime();
                const dateB = new Date(b.release_date || '0000-00-00').getTime();
                return dateB - dateA; 
            });
        } else if (type === 'vote_average') {
            sortedMovies.sort((a, b) => 
                b.vote_average - a.vote_average
            );
        }
        
        movies.value = sortedMovies;
        currentPage.value = 1;
    };

    return {
        movies,
        favorites,
        isLoading,
        errorMessage,
        fetchMovies,
        toggleFavorite,
        selectedMovie,
        fetchMovieDetail,
        sortType,
        sortMovies,
        searchQuery,
        searchResults,
        currentPage,
        totalPages,
        paginatedMovies,
        setPage
    }
});