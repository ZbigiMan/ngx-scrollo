import { ScrolloModule } from './ngx-scrollo.module';

describe('ScrolloModule', () => {
  let scrolloModule: ScrolloModule;

  beforeEach(() => {
    scrolloModule = new ScrolloModule();
  });

  it('should create an instance', () => {
    expect(scrolloModule).toBeTruthy();
  });
});
