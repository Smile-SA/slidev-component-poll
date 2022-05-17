import { App, Plugin } from 'vue';

// Import vue components
import Poll from "./Poll.vue";
import PollControl from "./PollControl.vue";
import PollQuestion from "./PollQuestion.vue";
import PollResult from "./PollResult.vue";
import PollResults from "./PollResults.vue";
import PollTitle from "./PollTitle.vue";
import { configs } from './configs';
import { init } from './state';

type InstallableComponent = Record<string, any> & { install: Exclude<Plugin['install'], undefined> };

export default /*#__PURE__*/((): InstallableComponent => {
  return {
    install(app: App) {
      const title = configs.titleTemplate.replace('%s', configs.title || 'Slidev')
      init(`${title} - poll`);
      app.component('Poll', Poll);
      app.component('PollControl', PollControl);
      app.component('PollQuestion', PollQuestion);
      app.component('PollResult', PollResult);
      app.component('PollResults', PollResults);
      app.component('PollTitle', PollTitle);
    }
  };
})();
