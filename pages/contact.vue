<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>{{ $t('contact.title') }}</h1>
        <i18n path="contact.blurb.body-faq" tag="p">
          <template #faq>
            <nuxt-link :to="localePath('about-faq')">
              {{ $t('common.faq') }}
            </nuxt-link>
          </template>
        </i18n>
        <i18n path="contact.blurb.body-contact" tag="p">
          <template #woudc>
            <strong>{{ $t('common.woudc') }}</strong>
          </template>
        </i18n>
        <v-alert class="mt-1 mb-4" color="info" outlined text border="left">
          <h3>{{ $t('contact.note.title') }}</h3>
          <i18n path="contact.note.body" tag="div">
            <template #privacy-act>
              <i>
                <a :href="privacyActURL" target="_blank">
                  {{ $t('common.privacy-act') }}
                  <v-icon small>mdi-open-in-new</v-icon>
                </a>
              </i>
            </template>
          </i18n>
        </v-alert>
        <div id="other-contacts">
          <h2>{{ $t('contact.other-channels') }}</h2>
          <div>
            <h3>{{ $t('contact.by-email') }}</h3>
            <a :href="`mailto:${$config.WOUDC_UI_EMAIL_ADDRESS}`">
              {{ $config.WOUDC_UI_EMAIL_ADDRESS }}
            </a>
          </div>
          <div>
            <h3>{{ $t('contact.by-mail') }}</h3>
            <div v-text="$t('common.woudcFull')" />
            <div v-text="$t('contact.mail-address.msc')" />
            <div v-text="$t('contact.mail-address.eccc')" />
            <div v-text="$t('contact.mail-address.street')" />
            <div v-text="$t('contact.mail-address.city-prov-postcode')" />
            <div v-text="$t('contact.mail-address.country')" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      privacyActURL: 'https://laws-lois.justice.gc.ca/eng/acts/P-21/index.html',
    }
  },
  head() {
    return {
      title: this.$t('contact.title'),
      titleTemplate: this.$titleTemplate(
        this.$t('common.woudc'),
        this.$t('common.woudcFull')
      ),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('contact.description'),
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.$t('contact.keywords'),
        },
      ],
    }
  },
  nuxtI18n: {
    paths: {
      en: '/contact',
      fr: '/contacter',
    },
  },
}
</script>

<style></style>
