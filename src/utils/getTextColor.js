import tinycolor from 'tinycolor2'

export const generateColorConfigs = () => {
  const COLORSBACKGROUND = [
    ['#1e293b', '#475569'], // Slate dark to slate lighter
    ['#0f766e', '#5eead4'], // Teal dark to light
    ['#1d4ed8', '#93c5fd'], // Blue to light blue
    ['#f97316', '#fdba74'] // Orange to light orange
  ]

  return COLORSBACKGROUND?.map(([fromColor, toColor]) => {
    const averageColor = tinycolor.mix(fromColor, toColor, 50).toHexString()
    const textColor = tinycolor(averageColor).isLight() ? '#000000' : '#ffffff'
    const headerBg = tinycolor(averageColor).isLight()
      ? tinycolor(averageColor).darken(10).toHexString()
      : tinycolor(averageColor).lighten(10).toHexString()
    // BoardBar pha giữa headerBg và background để hài hoà
    const boardBarBg = tinycolor.mix(headerBg, COLORSBACKGROUND, 50).toHexString()
    return {
      background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
      text: textColor,
      headerBg,
      boardBarBg
    }
  })
}
