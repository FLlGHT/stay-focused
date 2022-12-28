export interface Color {
  name: string
  color: string
}

export let COLORS: Map<string | undefined, Color> = new Map([
  [undefined, {name: 'Peacock', color: '#039be5'}],
  ['1', {name: 'Lavender', color: '#7986cb'}],
  ['2', {name: 'Sage', color: '#009688'}],
  ['3', {name: 'Grape', color: '#8e24aa'}],
  ['4', {name: 'Flamingo', color: '#e67c73'}],
  ['5', {name: 'Banana', color: '#e4c441'}],
  ['6', {name: 'Mandarin', color: '#f4511e'}],
  ['8', {name: 'Graphite', color: '#616161'}],
  ['9', {name: 'Blueberry', color: '#9e69af'}],
  ['10', {name: 'Basil', color: '#0b8043'}],
  ['11', {name: 'Tomato', color: '#d50000'}]
]);
