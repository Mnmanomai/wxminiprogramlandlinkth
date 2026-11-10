// utils/zones.js — the city-plan zone colour of a listing (OriginalColor from the search API) as a CSS background, for swatches.
// Same colours as the cards' colour tags; the light purple zone is drawn as the purple-striped zone (as in the filter page).
module.exports = {
  swatch(key) {
    const map = {
      purple: '#800080',
      lightpurple: 'repeating-linear-gradient(45deg, #800080, #800080 3px, #ffffff 3px, #ffffff 6px)',
      yellow: '#FFFF00',
      orange: '#FFA500',
      green: '#2E8B57',
      greendiagonal: 'repeating-linear-gradient(45deg, #008000, #008000 3px, #ffffff 3px, #ffffff 6px)',
      brown: '#8B4513',
      lightbrown: '#D2B48C',
      red: '#DC143C',
      blue: '#0000FF',
      gray: '#696969',
      olivegreen: '#808000',
      pink: '#FFC0CB'
    }
    return map[key] || ''
  }
}
