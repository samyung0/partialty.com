import type { AddComponents, Theme } from '../index';

const component = (addComponents: AddComponents, theme: Theme) => {
  addComponents({
    '.highlight-yellow': {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/yellow.svg)`,
      'background-size': '100% 100%',
      margin: '-2px -6px',
      padding: '2px  6px',
    },
    '.highlight-middle-tomato': {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/middle-tomato.svg)`,
      'background-size': '100% 100%',
      margin: '-2px -6px',
      padding: '2px  6px',
    },
    '.highlight-tomato': {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/tomato.svg)`,
      'background-size': '100% 100%',
      margin: '-2px -6px',
      padding: '2px  6px',
    },
    '.highlight-pink': {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/pink.svg)`,
      'background-size': '100% 100%',
      margin: '-2px -6px',
      padding: '2px  6px',
    },
    '.highlight-pink-audio': {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/pink.svg)`,
      'background-size': '100% 100%',
      // margin: "-2px -6px",
      // padding: "2px  6px",
    },
    '.highlight-dark-lilac': {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/dark-lilac.svg)`,
      'background-size': '100% 100%',
      margin: '-2px -6px',
      padding: '2px  6px',
    },
    '.highlight-lilac': {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/lilac.svg)`,
      'background-size': '100% 100%',
      margin: '-2px -6px',
      padding: '2px  6px',
    },
    '.highlight-light-lilac': {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/light-lilac.svg)`,
      'background-size': '100% 100%',
      margin: '-2px -6px',
      padding: '2px  6px',
    },
    '.highlight-mint': {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/mint.svg)`,
      'background-size': '100% 100%',
      margin: '-2px -6px',
      padding: '2px  6px',
    },
    '.highlight-mint-down': {
      background: `no-repeat center url(/src/assets/svg/highlightSVG/mint-down.svg)`,
      'background-size': '100% 100%',
      margin: '-2px -6px',
      padding: '2px  6px',
    },
    '.drawer-open': {
      transform: 'translateY(-100%)',
    },
  });
};

export default component;
