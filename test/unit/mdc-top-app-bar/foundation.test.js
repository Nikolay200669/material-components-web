/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';
import {captureHandlers} from '../helpers/foundation';

import {verifyDefaultAdapter} from '../helpers/foundation';
import MDCTopAppBarFoundation from '../../../packages/mdc-top-app-bar/foundation';
import {strings} from '../../../packages/mdc-top-app-bar/constants';


suite('MDCTopAppBarFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCTopAppBarFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTopAppBarFoundation, [
    'hasClass', 'addClass', 'removeClass', 'registerNavigationIconInteractionHandler',
    'deregisterNavigationIconInteractionHandler', 'notifyNavigationIconClicked',
  ]);
});

const setupTest = () => {
  const mockAdapter = td.object(MDCTopAppBarFoundation.defaultAdapter);

  const foundation = new MDCTopAppBarFoundation(mockAdapter);

  return {foundation, mockAdapter};
};

test('foundation returns strings', () => {
  assert.deepEqual(MDCTopAppBarFoundation.strings, strings);
});

test('on click emits navigation icon event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerNavigationIconInteractionHandler');
  foundation.init();
  handlers.click();
  td.verify(mockAdapter.notifyNavigationIconClicked(), {times: 1});
});

test('click handler removed from navigation icon during destroy', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterNavigationIconInteractionHandler('click', td.matchers.isA(Function)));
});
