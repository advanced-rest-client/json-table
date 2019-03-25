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
import './json-table-array.js';
/**
 * An element that displays object structure.
 *
 * ### Example
 *
 * ```html
 * <json-table-object json="{...}"></json-table-object>
 * ```
 *
 * ### Styling
 *
 * `<json-table>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--json-table-object` | Mixin applied to the element | `{}`
 *
 * @polymer
 * @customElement
 * @appliesMixin JsonTableMixin
 * @memberof UiElements
 */
class JsonTableObject extends JsonTableMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        --json-table-property-name-width: auto;
      }

      .item {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;

        min-height: 24px;
        padding: 8px 0;
        border-bottom: 1px var(--json-table-item-border-bottom-color, rgba(0, 0, 0, 0.12)) solid;
      }

      .item.array,
      .item.object {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;

        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
      }

      .item:last-of-type {
        border-bottom: none;
      }

      .property-name {
        color: var(--json-table-list-property-name-color, #000);
        word-break: break-all;
        margin-right: 12px;
        padding-right: 12px;
        white-space: normal;
        word-break: normal;
        margin: 8px 12px 8px 0;
      }

      .property-value {
        @apply --layout-flex;
        word-wrap: normal;
        overflow: auto;

      }

      .object .property-value,
      .array .property-value {
        overflow: visible;
      }

      .object .property-value {
        margin-left: var(--json-table-indent-size, 12px);
      }

      .object .property-name,
      .array .property-name  {
        font-weight: 600;
        width: auto;
        min-width: auto;
      }

      json-table-object,
      json-table-array {
        overflow: auto;
      }

      :host > .object > .property-name,
      :host > .array > .property-name {
        color: var(--json-table-list-property-name-color, #000);
      }

      .enum-value {
        display: block;
      }

      .enum-value::after {
        content: ',';
        color: rgba(0, 0, 0, 0.54);
      }

      .enum-value:last-of-type::after {
        content: ''
      }

      .object-label,
      .array-label {
        color: var(--json-table-complex-name-label-color, #58595A);
      }
    </style>
    <template is="dom-repeat" items="[[display]]">
      <div class\$="item [[_computeItemClass(item.*)]]">
        <div class="property-name">
          [[item.key]]
          <template is="dom-if" if="[[item.isObject]]">
            <span class="object-label">(Object)</span>
          </template>
          <template is="dom-if" if="[[_isEnumOrArray(item.*)]]">
            <span class="array-label">(Array [[_computeArraySize(item.*)]])</span>
          </template>
        </div>
        <div class="property-value">
          <template is="dom-if" if="[[item.isObject]]">
            <json-table-object json="[[item.value]]" paginate="[[paginate]]" page="[[page]]" items-per-page="[[itemsPerPage]]"></json-table-object>
          </template>
          <template is="dom-if" if="[[item.isEnum]]">
            <template is="dom-repeat" items="[[item.value]]">
              <span class="enum-value">[[item]]</span>
            </template>
          </template>
          <template is="dom-if" if="[[item.isArray]]">
            <div class="array-wrapper">
              <json-table-array json="[[item.value]]" paginate="[[paginate]]" page="[[page]]" items-per-page="[[itemsPerPage]]"></json-table-array>
            </div>
          </template>
          <template is="dom-if" if="[[item.isPrimitive]]">
            <json-table-primitive-teaser class="primitive-value">[[item.value]]</json-table-primitive-teaser>
          </template>
        </div>
      </div>
    </template>
`;
  }

  /* global JsonTableMixin */
  static get is() { return 'json-table-object'; }
  static get properties() {
    return {
      // An object to render.
      json: {
        type: Object,
        observer: '_jsonChanged'
      },
      // data model created from the `json` attribute.
      display: {
        type: Array,
        readOnly: true
      }
    };
  }
  /**
   * Creates a data model from the JSON object.
   * The element is only interested in first level properties. Other properties will be rendered
   * by child elements.
   *
   * TODO: This should be a deep data observer to update only the portion of the model that
   * actually has changed.
   */
  _jsonChanged(json) {
    if (!json) {
      return this._setDisplay(undefined);
    }
    const names = Object.keys(json);
    const model = names.map((key) => this.getPropertyModel(key, json[key]));
    this._setDisplay(model);
  }

  _computeItemClass(record) {
    if (!record || !record.base) {
      return;
    }
    const item = record.base;
    if (item.isArray/* || item.isEnum*/) {
      return 'array';
    }
    if (item.isEnum) {
      return 'enum';
    }
    if (item.isObject) {
      return 'object';
    }
  }
}
window.customElements.define(JsonTableObject.is, JsonTableObject);
