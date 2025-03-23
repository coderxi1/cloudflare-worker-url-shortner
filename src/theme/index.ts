import { type GlobalThemeOverrides } from 'naive-ui'

export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: '#f0f2f4',
    primaryColor: '#0078F9',
    primaryColorHover: '#0078F9',
    primaryColorPressed: '#00408d',
  },
  Card: {
    color: '#fff',
    borderRadius: '8px',
    borderColor: 'tranparent'
  },
  Switch: {
    railColorActive: '#0078F9'
  },
  Input: {
    color: '#F9F9F9',
    border: 'solid 1px #ddd',
    borderHover: 'solid 1px #ddd',
    
  }
}

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: '#191919',
    primaryColor: '#0078F9',
    primaryColorHover: '#0078F9',
    primaryColorPressed: '#00408d',
  },
  Card: {
    color: '#1e1e1f',
    borderRadius: '8px',
    borderColor: 'tranparent'
  },
  Switch: {
    railColorActive: '#0078F9'
  },
  Input: {
    color: '#1a1a1a',
    border: 'solid 1px #333',
    borderHover: 'solid 1px #333',
    borderRadius: '5px'
  }
}