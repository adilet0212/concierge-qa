import { BaseScreen } from './BaseScreen.ts';

class HomeScreen extends BaseScreen {
  get screen() {
    return this.byAccessibilityId('Home-screen');
  }
}

export default new HomeScreen();
