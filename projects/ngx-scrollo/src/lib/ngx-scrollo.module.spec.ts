import { NgxScrolloModule } from './ngx-scrollo.module';

describe('NgxScrolloModule', () => {
  let ngxScrolloModule: NgxScrolloModule;

  beforeEach(() => {
    ngxScrolloModule = new NgxScrolloModule();
  });

  it('should create an instance', () => {
    expect(ngxScrolloModule).toBeTruthy();
  });
});
