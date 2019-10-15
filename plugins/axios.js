import ApiService from '~/common/api.service'

if (process.browser) {
  window.onNuxtReady(() => {
    ApiService.init()
  })
}
