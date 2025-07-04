<template>
  <client-only>
    <l-map
      id="woudc-map"
      ref="woudc-map"
      :zoom="startZoom"
      :center="startCenter"
      @click="emitSelection(null)"
      @moveend="emitBoundaryChange"
    >
      <l-tile-layer :url="tileURLTemplate" :attribution="attribution" />
      <l-control class="leaflet-bar" position="topleft">
        <a class="leaflet-touch" role="button" @click="zoomToGlobe">
          <v-icon>mdi-earth</v-icon>
        </a>
      </l-control>
      <l-geo-json
        v-for="region in wmoRegions"
        :key="region.properties.WMO_RA"
        :geojson="region"
        :options="{ style: borderStyle }"
      />
      <l-feature-group ref="marker-group">
        <l-marker
          v-for="element in elements"
          :key="element.identifier"
          :ref="element.identifier + '-marker'"
          :lat-lng="element.geometry.coordinates"
          @click="emitSelection(element)"
        >
          <l-popup>
            <slot name="popup" :item="element">
              {{ element.identifier }}
            </slot>
          </l-popup>
        </l-marker>
      </l-feature-group>
      <v-overlay absolute opacity="0.66" z-index="1000" :value="loading">
        <v-progress-circular indeterminate />
      </v-overlay>
    </l-map>
  </client-only>
</template>

<script>
export default {
  name: 'SelectableMap',
  props: {
    elements: { type: Array, required: true },
    selected: { type: Object, required: false, default: null },
    country: { type: String, required: false, default: null },
    loading: { type: Boolean, required: false, default: false },
    reset: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      attribution:
        '&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      borderStyle: {
        color: 'darkblue',
        fillOpacity: 0,
        weight: 0.8,
      },
      eventLock: false,
      startCenter: [0, 0],
      startZoom: 1,
      tileURLTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    }
  },
  computed: {
    wmoRegions() {
      const regions = this.$store.getters['wmoRegions/all']
      return Object.values(regions)
    },
  },
  watch: {
    country(newSelection) {
      if (newSelection !== null) {
        this.autoZoomToCountry(newSelection)
      } else {
        this.zoomToGlobe()
      }
    },
    reset(resettingMap) {
      if (resettingMap == true) {
        this.zoomToGlobe()
      }
    },
    selected(newSelection, oldSelection) {
      if (newSelection === null) {
        // De-activate old selection (which is necessarily non-null).
        const markerID = oldSelection.identifier + '-marker'
        this.$nextTick(() => {
          this.$refs[markerID][0].mapObject.closePopup()
        })
      } else if (oldSelection === null) {
        // Make a selection when nothing was selected previously.
        const markerID = newSelection.identifier + '-marker'
        this.$nextTick(() => {
          this.$refs[markerID][0].mapObject.openPopup()
        })
      } else if (newSelection.identifier !== oldSelection.identifier) {
        // Change from one selection to a different one.
        // Block the close popup event from registering as a selection change.
        this.eventLock = true
        const oldMarkerID = oldSelection.identifier + '-marker'
        this.$refs[oldMarkerID][0].mapObject.closePopup()
        this.eventLock = false

        const newMarkerID = newSelection.identifier + '-marker'
        this.$nextTick(() => {
          this.$refs[newMarkerID][0].mapObject.openPopup()
        })
      }
    },
  },
  mounted() {
    this.setIconSize()
    this.setupWMORegions()

    if (this.selected !== null) {
      // Zoom in toward the initially selected element.
      this.startCenter = this.selected.geometry.coordinates
      this.startZoom = 12

      this.$nextTick(() => {
        const markerID = this.selected.identifier + '-marker'
        this.$refs[markerID][0].mapObject.openPopup()
      })
    }
  },
  methods: {
    autoZoomToCountry(countryCode) {
      const boundaries = this.$store.getters['countries/boundaries']
      if (boundaries[countryCode] === null) {
        this.$nextTick(this.autoZoomToMarkers)
      } else {
        const markers = this.elements.map(
          (element) => element.geometry.coordinates
        )
        let coordinates = []
        coordinates = [...markers, ...boundaries[countryCode]]

        const lats = coordinates.map((coord) => coord[0])
        const lngs = coordinates.map((coord) => coord[1])
        const southWest = [Math.min(...lats), Math.min(...lngs)]
        const northEast = [Math.max(...lats), Math.max(...lngs)]

        const coordinateBounds = this.$L.latLngBounds(southWest, northEast)
        const map = this.$refs['woudc-map']
        map.fitBounds(coordinateBounds, {
          animate: true,
        })
      }
    },
    autoZoomToMarkers() {
      const markerGroup = this.$refs['marker-group']
      const map = this.$refs['woudc-map']

      const bounds = markerGroup.mapObject.getBounds()
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 12,
        animate: true,
      })
    },
    emitBoundaryChange(event) {
      const bounds = event.target.getBounds()
      this.$emit('move', bounds)
    },
    emitSelection(element) {
      if (!this.eventLock) {
        this.$emit('select', element)
      }
    },
    setupWMORegions() {
      this.$store.dispatch('wmoRegions/download')
    },
    // Set the markers icons displayed on the map to a smaller size.
    setIconSize() {
      const iconOptions = this.$L.Icon.Default.prototype.options

      iconOptions.iconSize = [12.5, 20.5]
      iconOptions.shadowSize = [20.5, 20.5]
      iconOptions.iconAnchor = [6.25, 20.5]
      iconOptions.popupAnchor = [0, -20]
    },
    zoomToGlobe() {
      const map = this.$refs['woudc-map']
      map.mapObject.setView({ lat: 0, lon: 0 }, 1)
    },
  },
}
</script>

<style>
#woudc-map {
  height: 520px;
  width: 100%;
  min-width: 520px;

  margin-right: 20px;
  z-index: 0;
}
.leaflet-attribution-flag {
  display: none !important;
}
</style>
