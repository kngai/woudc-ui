<template>
  <v-container>
    <h1>{{ $t('about.standards.title') }}</h1>
    <i18n path="about.standards.blurb-intro" tag="p">
      <template #interoperability>
        <a :href="interoperabilityURL" target="_blank">
          {{ $t('common.interoperability') }}
        </a>
      </template>
      <template #wis>
        <a :href="wisURL" target="_blank">
          <span>
            {{ $t('common.wis') }}
            <v-icon x-small>mdi-open-in-new</v-icon>
          </span>
        </a>
      </template>
    </i18n>
    <v-row>
      <v-col>
        <v-data-table
          id="standards-table"
          :headers="headers"
          :items="rows"
          hide-default-footer
          class="elevation-1"
        >
          <template #item.formats="props">
            <v-chip
              v-for="link in props.item.formats"
              :key="link.to"
              class="resource"
              label
            >
              <a :href="link.to" target="_blank">
                <span>
                  {{ link.text }}
                  <v-icon x-small>mdi-open-in-new</v-icon>
                </span>
              </a>
            </v-chip>
          </template>
          <template #item.services="props">
            <v-chip
              v-for="link in props.item.services"
              :key="link.to"
              class="resource"
              label
            >
              <a :href="link.to" target="_blank">
                <span>
                  {{ link.text }}
                  <v-icon x-small>mdi-open-in-new</v-icon>
                </span>
              </a>
            </v-chip>
          </template>
        </v-data-table>
        <i18n path="about.standards.blurb-howto" tag="p">
          <template #access>
            <nuxt-link :to="localePath('about-data_access')">
              <span>{{ $t('common.access') }}</span>
            </nuxt-link>
          </template>
        </i18n>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      interoperabilityURL:
        'https://www.wmo.int/pages/prog/www/WIS/documents/MOAWMO_OGC.pdf',
      wisURL:
        'https://public.wmo.int/en/about-us/vision-mission-strategic-priorities/wmo-information-system-wis',
      formatURLs: {
        csv: 'https://en.wikipedia.org/wiki/Comma-separated_values',
        geojson: 'https://geojson.org/',
        gml: 'https://www.opengeospatial.org/standards/gml',
        iso: 'https://www.wmo.int/pages/prog/www/metadata/WMO-core-metadata.html',
        wigos:
          'https://library.wmo.int/viewer/55626/download?file=1192_en.pdf&type=pdf&navigator=1',
      },
      serviceURLs: {
        csw: 'https://www.opengeospatial.org/standards/cat',
        opensearch: 'https://github.com/dewitt/opensearch',
        pmh: 'https://www.openarchives.org/pmh/',
        wfs: 'https://www.opengeospatial.org/standards/wfs',
        wms: 'https://www.opengeospatial.org/standards/wms',
      },
      tableRowIdentifiers: [
        {
          resource: 'discovery',
          formats: ['iso'],
          services: ['csw', 'pmh', 'opensearch'],
        },
        {
          resource: 'stations',
          formats: ['gml', 'wigos'],
          services: ['wms', 'wfs'],
        },
        {
          resource: 'instruments',
          formats: ['gml', 'wigos'],
          services: ['wms', 'wfs'],
        },
        {
          resource: 'observations',
          formats: ['csv', 'geojson', 'gml', 'wigos'],
          services: ['wms', 'wfs'],
        },
      ],
    }
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
    headers() {
      const headerKeys = ['resource', 'formats', 'services']
      return headerKeys.map((key) => {
        return {
          text: this.$t('about.standards.headers.' + key),
          value: key,
        }
      })
    },
    rows() {
      return this.tableRowIdentifiers.map((definition) => {
        const formatsList = definition.formats.map((format) => {
          return {
            text: this.$t('about.standards.links.formats.' + format),
            to: this.formatURLs[format],
          }
        })
        const servicesList = definition.services.map((service) => {
          return {
            text: this.$t('about.standards.links.services.' + service),
            to: this.serviceURLs[service],
          }
        })

        return {
          resource: this.$t(
            'about.standards.links.resources.' + definition.resource
          ),
          formats: formatsList,
          services: servicesList,
        }
      })
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
