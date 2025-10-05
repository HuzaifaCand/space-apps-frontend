export type WeatherCategory = {
  quantity: string;
  description: string;
};

// Temperature
export const temperatureMap: Record<string, WeatherCategory> = {
  "Very Hot": {
    quantity: "≥ 40 °C",
    description: "Extremely high temperatures, heatwave conditions",
  },
  Hot: {
    quantity: "35 – 39 °C",
    description: "Very warm to hot conditions",
  },
  Warm: {
    quantity: "30 – 34 °C",
    description: "Warm and pleasant weather",
  },
  Mild: {
    quantity: "20 – 29 °C",
    description: "Mild, comfortable weather",
  },
  Cool: {
    quantity: "11 – 19 °C",
    description: "Slightly cool, light jacket recommended",
  },
  Cold: {
    quantity: "6 – 10 °C",
    description: "Chilly weather, sweater or coat needed",
  },
  "Very Cold": {
    quantity: "≤ 5 °C",
    description: "Very cold, likely frost or snow",
  },
};

// Humidity
export const humidityMap: Record<string, WeatherCategory> = {
  Comfortable: {
    quantity: "< 60 %",
    description: "Dry and comfortable air",
  },
  Humid: {
    quantity: "60 – 79 %",
    description: "Noticeably humid atmosphere",
  },
  "Very Uncomfortable": {
    quantity: "≥ 80 %",
    description: "Oppressively humid and sticky",
  },
};

// Precipitation
export const precipitationMap: Record<string, WeatherCategory> = {
  None: {
    quantity: "0 mm",
    description: "No rainfall",
  },
  Low: {
    quantity: "0.1 – 2 mm",
    description: "Light drizzle or scattered drops",
  },
  Moderate: {
    quantity: "2 – 10 mm",
    description: "Steady rainfall",
  },
  High: {
    quantity: "> 10 mm",
    description: "Heavy downpour or storm",
  },
};

// Wind
export const windMap: Record<string, WeatherCategory> = {
  Calm: {
    quantity: "< 3 m/s",
    description: "Light breeze, barely noticeable",
  },
  Breezy: {
    quantity: "3 – 5 m/s",
    description: "Gentle, refreshing breeze",
  },
  Windy: {
    quantity: "6 – 9 m/s",
    description: "Strong, noticeable winds",
  },
  "Very Windy": {
    quantity: "≥ 10 m/s",
    description: "Strong gusts, possibly uncomfortable",
  },
};

// Heat Index
export const heatIndexMap: Record<string, WeatherCategory> = {
  Safe: {
    quantity: "< 27 °C",
    description: "Safe and comfortable",
  },
  Caution: {
    quantity: "27 – 31 °C",
    description: "Caution: fatigue possible",
  },
  "Extreme Caution": {
    quantity: "32 – 40 °C",
    description: "Heat cramps possible",
  },
  Danger: {
    quantity: "41 – 53 °C",
    description: "Danger: heat exhaustion likely",
  },
  "Extreme Danger": {
    quantity: "≥ 54 °C",
    description: "Extreme danger: heat stroke imminent",
  },
};
