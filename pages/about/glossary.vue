<template>
  <v-container>
    <h1>{{ $t('about.glossary.title') }}</h1>
    <p>{{ $t('about.glossary.blurb') }}</p>
    <v-row>
      <v-col>
        <div v-for="(item, index) in $t('about.glossary.terms')" :key="index">
          <h4>{{ item.term }}</h4>
          <i18n :path="'about.glossary.terms[' + index + '].definition'" tag="p">
            <template v-slot:carcinogenesis>
              <a :href="carcinogensURL" target="_blank">
                {{ $t('about.glossary.carcinogenesis') }}
              </a>
            </template>
            <template v-slot:registration-page>
              <nuxt-link :to="localePath('contributors-registration')">
                {{ $t('common.registration-page') }}
              </nuxt-link>
            </template>
            <template v-slot:w3>
              <a :href="w3URL" target="_blank">
                www.w3.org
              </a>
            </template>
            <template v-slot:waf>
              <a :href="wafURL" target="_blank">
                {{ wafURL }}
              </a>
            </template>
          </i18n>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      carcinogensURL: 'https://www.wmo.int/pages/prog/dra/etrp/documents/926E.pdf',
      w3URL: 'https://www.w3.org/',
      wafURL: process.env.WAF_URL
    }
  },
  nuxtI18n: {
    paths: {
      en: '/about/glossary',
      fr: '/a-propos/glossaire'
    }
  }
}
</script>
