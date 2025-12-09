<template>
  <v-container>
    <h1>{{ $t('about.standards.title') }}</h1>
    <i18n path="about.standards.blurb-intro" tag="p">
      <template #interoperability>
        <span>{{ $t('common.interoperability') }}</span>
      </template>
      <template #wis>
        <span>
          {{ $t('common.wis') }}
        </span>
      </template>
    </i18n>
    <i18n path="about.standards.blurb-intro2" tag="p">
      <template #os_ogc>
        <a href="https://ogcapi.ogc.org" target="_blank">
          <span>
            {{ $t('about.standards.os_ogc') }}
            <v-icon x-small>mdi-open-in-new</v-icon>
          </span>
        </a>
      </template>
    </i18n>

    <v-simple-table id="standards-table" class="elevation-1">
      <template #default>
        <thead>
          <tr>
            <th>{{ $t('about.standards.headers.resourceType') }}</th>
            <th>{{ $t('about.standards.headers.formats') }}</th>
            <th>{{ $t('about.standards.headers.api') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resource in resourceRows" :key="resource.resource">
            <td>{{ resource.resource }}</td>
            <td>
              <v-chip label>{{ resource.formats }}</v-chip>
            </td>
            <td>
              <v-chip label>{{ resource.services }}</v-chip>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <i18n path="about.standards.blurb-howto" tag="p">
      <template #access>
        <nuxt-link :to="localePath('about-data_access')">
          <span>{{ $t('common.access') }}</span>
        </nuxt-link>
      </template>
    </i18n>
  </v-container>
</template>

<script>
export default {
  data() {
    return {}
  },
  head() {
    return {
      title: this.$t('about.standards.title'),
      titleTemplate: this.$titleTemplate(
        this.$t('common.woudc'),
        this.$t('common.woudcFull')
      ),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('about.standards.description'),
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.$t('about.standards.keywords'),
        },
      ],
    }
  },
  computed: {
    resourceRows() {
      return [
        {
          resource: this.$t('about.standards.links.resources.discovery'),
          formats: 'WMO Core Metadata Profile (WCMP2)',
          services: 'OGC API - Records',
        },
        {
          resource: this.$t(
            'about.standards.links.resources.station_instrument'
          ),
          formats: 'GeoJSON',
          services: 'OGC API - Features',
        },
        {
          resource: this.$t('about.standards.links.resources.observations'),
          formats: 'CSV',
          services: 'OGC API - Features',
        },
      ]
    },
  },
  nuxtI18n: {
    paths: {
      en: '/about/standards',
      fr: '/a-propos/normes',
    },
  },
}
</script>

<style scoped>
#standards-table .v-chip {
  margin-right: 8px;
  background-color: #e8e8e8;
}

#standards-table .v-chip a {
  text-decoration: none;
}
</style>
