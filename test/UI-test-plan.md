# UI Test Plan

A test plan to test all aspects of the UI. Ensure Developer Tools (F12) are enabled before proceeding.

## News

[`/en/news`](https://woudc.org/en/news)

- Ensure page loads
  - Check XHR GET loads `https://api.woudc.org/collections/notifications/items?f=json`
- Click on keyword "graphs" to filter the news
  - Should have 2 articles displayed
  - Click "Reset Filters" to undo

## Station List

[`/en/data/stations`](https://woudc.org/en/data/stations)

- Ensure page loads
  - Check XHR POST loads `https://api.woudc.org/processes/woudc-data-registry-select-distinct/execution`
- Check to see if all columns sort properly
- Click on GAW ID `KAG` and ensure it opens an external link on a new tab/page of station Kagoshima
- Click on the row with WOUDC Station ID `007` and ensure row is highlighted and map shows popup of station

### Single Station

- Click on the link `007` to view the single station page and ensure the following
  - Map displays a zoomed-in view of the station with popup
  - Data distribution graph shows data with working date range sliders
  - Table view of station
  - Table view of contributor `JMA`
  - Table view of instruments
- Refresh the page to see if page loads correctly to ensure the `woudc-ui.conf` apache redirect is working (SPA fallback to enable persistant routing)

## Instrument List

[`/en/data/instruments`](https://woudc.org/en/data/instruments)

- Ensure page loads
  - Table view of instruments
  - Map view of instruments
  - Check XHR POST loads `https://api.woudc.org/processes/woudc-data-registry-select-distinct/execution`
- Click on a row and ensure row highlights and map displays a popup of corresponding instrument
- Check to see if all columns sort properly
- Click on a Station Name link and ensure it loads the single station page
- Click on a WAF folder link to ensure it opens a new page

## Contributor List

- Ensure page loads
  - Table view of contributors
  - Map view of contributors
  - Check XHR GET loads `https://api.woudc.org/collections/contributors/items?sortby=acronym&limit=1000`
- Click on a row and ensure row highlights and map displays a popup of corresponding contributor
- Check to see if all columns sort properly
- Click on a Contributor Name link and ensure it opens an external link on a new page

### Single Contributor

- Click on Acronym `ABM` and ensure it loads the page
  - Map view of a single contributor zoomed-in
  - Table view of a single contriubtor
  - Table view of stations belonging to the contributor
- Click on a WOUDC Station ID to ensure it loads a single station page

## Ozonesonde Plots

[`/en/data/products/ozonesonde`](https://woudc.org/en/data/products/ozonesonde)

- Ensure list of stations are loaded
  - Check for 2 XHR POST that loads `https://api.woudc.org/processes/woudc-data-registry-select-distinct/execution`
    - Request input for station: `{"inputs":{"index":"station","distinct":{"orderByID":["woudc_id"]}}}`
    - Request input for contribution: `{"inputs":{"index":"contribution","distinct":{"orderByID":["station_id","dataset_id"]},"source":["station_id"]}}`
  - Check for XHR GET that loads `https://cdn.rawgit.com/OGCMetOceanDWG/wmo-ra/master/wmo-ra.geojson`
- Select station: Alert (018)
  - Ensure year dropdown has options from 1987 to 2020
- Set sort by: Station ID
  - Ensure station dropdown list is sorted by ID
- Select year: 2000
  - Ensure all graphs in results are loaded

## Total Ozone Plots

[`/en/data/products/totalozone`](https://woudc.org/en/data/products/totalozone)

- Ensure list of stations are loaded
  - Map view of stations
  - Check for 2 XHR POST that loads `https://api.woudc.org/processes/woudc-data-registry-select-distinct/execution`
    - Request input for contribution: `{"inputs":{"index":"contribution","distinct":{"orderByID":["station_id","dataset_id"]},"source":["station_id"]}}`
    - Request input for station: `{"inputs":{"index":"station","distinct":{"orderByID":["woudc_id"]}}}`
  - Check for XHR GET that loads `https://cdn.rawgit.com/OGCMetOceanDWG/wmo-ra/master/wmo-ra.geojson`
- Select station: `Alert (018)`
  - Ensure instrument dropdown list has 5 Brewer and 1 Dobson option
- Select instrument: `Brewer #019`
  - Ensure year dropdown list ranges from 2004 to 2021
- Select year: `All` and submit
  - Check that all graphs are loaded correctly

## UV Index Plots

[`/en/data/products/uvindex`](https://woudc.org/en/data/products/uvindex)

- Ensure list of stations are loaded
  - Map view of stations
  - Check for 2 XHR POST that loads `https://api.woudc.org/processes/woudc-data-registry-select-distinct/execution`
    - Request input for contribution: `{"inputs":{"index":"contribution","distinct":{"orderByID":["station_id","dataset_id"]},"source":["station_id"]}}`
    - Request input for station: `{"inputs":{"index":"station","distinct":{"orderByID":["woudc_id"]}}}`
  - Check for XHR GET that loads `https://cdn.rawgit.com/OGCMetOceanDWG/wmo-ra/master/wmo-ra.geojson`
- Select station: `Davos (501)`
  - Ensure instrument dropdown list has the following:
    - `Brewer MKIII #163`
    - `Kipp_Zonen UV-S-E-T #560`
    - `UV-Biometer 501A #1492`
    - `UV-Biometer 501A #1493`
    - `UV-Biometer 501A #3860`
    - `Yankee UVB-1 #10938`
- Select instrument: `Kipp_Zonen UV-S-E-T #560`
  - Ensure year dropdown list ranges from 2007 to 2021
- Select year: `All` and submit
  - Check that all graphs are loaded correctly

## Data Search and Download

[`/en/data/data-search-and-download`](https://woudc.org/en/data/data-search-and-download)

- Ensure all dropdowns shown are loaded and have options other than `All`
  - Map view of all stations (Dataset: `All`)
- Ensure year range slider works and updates the data distribution graph display
- Ensure the sort by toggles the sort order for country and station dropdown list
- Select dataset: `Total Ozone - Daily Observations`
- Ensure the country and station dropdown list has changed (should be less options vs `All` datasets)
- Select station: `Buenos Aires Observatorio (091)`
  - Ensure data distribution graphs are updated and displayed correctly
  - Ensure the instrument dropdown only has `Dobson` available
  - Change the year range of your choice
- Submit
  - Check search results match your selections
