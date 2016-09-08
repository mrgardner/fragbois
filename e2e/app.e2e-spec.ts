import { FragBoisPage } from './app.po';

describe('frag-bois App', function() {
  let page: FragBoisPage;

  beforeEach(() => {
    page = new FragBoisPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
