<template>
  <div class="contents">
    <div v-for="book in books" :key="book.id">
      <div>{{ book.title }} {{ book.author }}</div>
    </div>
    <PostList></PostList>
    <div>
      <label>
        検索キーワード
        <input v-model="keyword" type="text" name="query" />
      </label>
      <button type="button" @click="search">検索</button>
      <p>
        Search Result:
        <span>{{ keyword }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import PostList from '~/components/PostList.vue'

export default {
  name: 'Posts',
  components: {
    PostList
  },
  data() {
    return {
      keyword: '',
      books: [
        { id: 1, title: '坊っちゃん', author: '夏目漱石' },
        { id: 2, title: '人間失格', author: '太宰治' },
        { id: 3, title: 'ノルウェイの森', author: '村上春樹' }
      ]
    }
  },
  async asyncData({ $axios }) {
    console.log('asyncData')
    const ip = await $axios.$get('http://icanhazip.com')
    console.log('ip', ip)
    return { ip }
  },
  methods: {
    search() {
      // search イベントを発火し、keywordを引数として渡す
      this.$emit('search', this.keyword)
    }
  }
}
</script>

<style>
.contents {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
