/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import {JsonTableMixin} from './json-table-mixin.js';
import './json-table-object.js';
import './json-table-array.js';
/**
 * A table view from the JSON structure.
 *
 * The element renders a table and / or list view from a JSON object.
 * If JSON is an array it renders a table view. For objects it renders a list view.
 *
 * Complex object are represented as an embedded view of a list or table inside the parent object
 * representation. That may create very complex structure and lead to performance issues when computing
 * data model and building the DOM. Therefore the element will only build the first level of the view.
 * If the object / array contains other objects / arrays it will show only a button to display embeded
 * objects. That should prohibit from freezing the UI while rendering the view.
 *
 * Another optimization is pagination (disabled by default). After setting the `paginate` property
 * array tables will contain a pagination with `itemsPerPage` items rendered at a time. The user can
 * change number of items at any time.
 *
 * ### Example
 * ```html
 * <json-table json="[...]" paginate items-per-page="15"></json-table>
 * ```
 *
 * ## Content actions
 *
 * The element can render an actions pane above the table / list view. Action pane is to
 * display content actions that is relevant in context of the content displayed
 * below the buttons. It should be icon buttons list or just buttons added to this view.
 *
 * Buttons must have `slot="content-action"` attributte set to be included to this view.
 *
 * ```html
 * <json-table json='{"json": "test"}'>
 *  <paper-icon-button
 *    slot="content-action"
 *    title="Copy content to clipboard"
 *    icon="arc:content-copy"></paper-icon-button>
 * </json-table>
 * ```
 *
 * ### Styling
 *
 * `<json-table>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--json-table` | Mixin applied to the element | `{}`
 * `--json-table-main-array-wrapper` | Mixin applied to the top level array's table view. This element has `overflow` property set.  | `{}`
 * `--json-table-item-border-bottom-color` | Color of the bottom border in the array able items or in the object list row | `rgba(0, 0, 0, 0.12)`
 * `--json-table-list-property-name-width` | Width of the property name for the list view for the object display | `120px`
 * `--json-table-array-header-color` | Color of the array table header labels | ``
 * `--json-table-array-body-color` | Color of the array table body values | ``
 *
 * @polymer
 * @customElement
 * @appliesMixin JsonTableMixin
 * @memberof UiElements
 */
class JsonTable extends JsonTableMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --json-table;
    }

    .array-wrapper {
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -ms-flex-direction: row;
      -webkit-flex-direction: row;
      flex-direction: row;
      overflow-y: hidden;
      overflow-x: auto;
      @apply --json-table-main-array-wrapper;
    }

    json-table-array {
      -ms-flex: 1 1 0.000000001px;
      -webkit-flex: 1;
      flex: 1;
      -webkit-flex-basis: 0.000000001px;
      flex-basis: 0.000000001px;
    }

    .actions-panel {
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -ms-flex-direction: row;
      -webkit-flex-direction: row;
      flex-direction: row;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;

      @apply --response-raw-viewer-action-bar;
    }
    </style>
    <div class="actions-panel">
      <slot name="content-action"></slot>
    </div>
    <template is="dom-if" if="[[isArray(_renderJson)]]" restamp="true">
      <div class="array-wrapper">
        <json-table-array
          json="[[_renderJson]]"
          paginate="[[paginate]]"
          page="[[page]]"
          items-per-page="[[itemsPerPage]]"></json-table-array>
      </div>
    </template>
    <template is="dom-if" if="[[isObject(_renderJson)]]" restamp="true">
      <json-table-object
        json="[[_renderJson]]"
        paginate="[[paginate]]"
        page="[[page]]"
        items-per-page="[[itemsPerPage]]"></json-table-object>
    </template>`;
  }

  static get is() {
    return 'json-table';
  }
  static get properties() {
    return {
      /**
       * JSON data to display.
       * If provided data is type of string then it will use the `JSON.stringify` function to
       * create a JavaScript object from string.
       */
      json: {
        type: Object,
        observer: '_jsonChanged'
      },
      // A copy of the `json` object so it can be altered by the element.
      _renderJson: Object,
      /**
       * Will be set to true if the passed `json` is a string and it's not valid JSON.
       */
      parserError: {
        type: Boolean,
        value: false,
        readOnly: true
      }
    };
  }
  /**
   * Handler for `json` attribute value change.
   *
   * @param {Object|Array} json JSON object to render.
   */
  _jsonChanged(json) {
    this._setParserError(false);
    this.set('_renderJson', undefined);
    if (!json) {
      this.set('_renderJson', undefined);
      return;
    }
    if (typeof json === 'string') {
      try {
        json = JSON.parse(json);
        // No need for copy.
        this._setRenderJson(json);
        return;
      } catch (e) {
        this._setParserError(true);
        return;
      }
    }
    if (this.isArray(json)) {
      this._setRenderJson(Array.from(json));
    } else {
      this._setRenderJson(Object.assign({}, json));
    }
  }
  /**
   * Sets `_renderJson` property after 1 ms.
   *
   * @param {Object|Array} json JSON object to render.
   */
  _setRenderJson(json) {
    setTimeout(() => {
      this.set('_renderJson', json);
    }, 1);
  }
}
window.customElements.define(JsonTable.is, JsonTable);
